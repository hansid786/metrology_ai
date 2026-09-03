import { getSupabase, isSupabaseConfigured } from './supabaseClient';
import { SavedInspection } from '../types/inspection';

export interface CloudSyncStatus {
  isConfigured: boolean;
  lastSyncedAt: string | null;
  totalSyncedCount: number;
  isSyncing: boolean;
  error?: string;
}

export const cloudSyncService = {
  /**
   * Syncs a single inspection docket to Supabase PostgreSQL table
   */
  async syncInspection(inspection: SavedInspection): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    try {
      const res = inspection.result;
      const meta = inspection.metadata;

      const payload = {
        id: inspection.id,
        inspection_id: meta?.inspectionId || inspection.id,
        timestamp: inspection.savedAt || new Date().toISOString(),
        establishment_name: meta?.establishmentName || 'Retail Mart',
        establishment_address: meta?.establishmentAddress || meta?.location || '',
        product_name: meta?.productName || res?.product?.name || 'Packaged Commodity',
        brand_name: res?.product?.brand || '',
        product_category: meta?.productCategory || res?.product?.category || 'FOOD',
        mrp_amount: res?.pricing?.mrpAmount || 0,
        net_quantity_value: res?.pricing?.netQuantityValue || 0,
        net_quantity_unit: res?.pricing?.netQuantityUnit || 'g',
        printed_usp_amount: res?.pricing?.printedUSPAmount || null,
        calculated_usp_amount: res?.pricing?.calculatedUSPAmount || null,
        usp_discrepancy: Boolean(res?.pricing?.isDiscrepancy),
        usp_discrepancy_type: res?.pricing?.discrepancyType || 'NONE',
        overall_status: res?.overallStatus || 'COMPLIANT',
        compliance_percentage: res?.compliancePercentage || 100,
        verified_count: res?.verifiedCount || 0,
        total_count: res?.totalCount || 0,
        manufacturer_name: meta?.manufacturer || '',
        fssai_license: res?.declarations?.find(d => d.key === 'fssai_lic')?.extractedValue || null,
        country_of_origin: res?.declarations?.find(d => d.key === 'country_of_origin')?.extractedValue || 'INDIA',
        raw_ocr_text: res?.rawOcrText || '',
        health_safety_score: res?.ingredientAnalysis?.healthSafetyScore || 100,
        inspector_id: meta?.inspectorId || res?.inspector?.id || '',
        inspector_name: meta?.inspectorName || res?.inspector?.name || '',
        full_result_json: res,
        audit_trail: inspection.auditTrail || [],
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('inspections')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('[MetrologyLens] Supabase upsert note:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[MetrologyLens] Cloud sync error:', err);
      return false;
    }
  },

  /**
   * Syncs all local storage inspections to the cloud in bulk
   */
  async syncAllLocalInspections(inspections: SavedInspection[]): Promise<{ synced: number; failed: number }> {
    if (!isSupabaseConfigured() || inspections.length === 0) {
      return { synced: 0, failed: 0 };
    }

    let synced = 0;
    let failed = 0;

    for (const insp of inspections) {
      const ok = await this.syncInspection(insp);
      if (ok) synced++;
      else failed++;
    }

    return { synced, failed };
  },

  /**
   * Fetches latest inspections from Supabase PostgreSQL
   */
  async fetchCloudInspections(): Promise<any[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('[MetrologyLens] Fetch cloud inspections error:', err);
      return [];
    }
  },

  /**
   * Submits consumer grievance / violation filing to central database
   */
  async submitConsumerComplaint(complaint: {
    productName: string;
    retailerName: string;
    retailerLocation: string;
    violationType: string;
    printedMrp: number;
    chargedMrp: number;
    consumerName?: string;
    consumerPhone?: string;
  }): Promise<{ success: boolean; ticketNumber?: string }> {
    const ticketNumber = `GRV-GOI-${Date.now().toString().slice(-6)}`;
    const supabase = getSupabase();

    if (!supabase) {
      // Offline fallback: save in localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('metrologylens_complaints') || '[]');
        stored.unshift({ ...complaint, ticketNumber, status: 'SUBMITTED', submittedAt: new Date().toISOString() });
        localStorage.setItem('metrologylens_complaints', JSON.stringify(stored));
      } catch {}
      return { success: true, ticketNumber };
    }

    try {
      const { error } = await supabase.from('consumer_complaints').insert({
        ticket_number: ticketNumber,
        product_name: complaint.productName,
        retailer_name: complaint.retailerName,
        retailer_location: complaint.retailerLocation,
        violation_type: complaint.violationType,
        printed_mrp: complaint.printedMrp,
        charged_mrp: complaint.chargedMrp,
        consumer_name: complaint.consumerName || 'Citizen Anonymous',
        consumer_phone: complaint.consumerPhone || '',
        status: 'SUBMITTED'
      });

      if (error) throw error;
      return { success: true, ticketNumber };
    } catch {
      return { success: false };
    }
  }
};
