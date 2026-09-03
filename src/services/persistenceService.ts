import { SavedInspection, DashboardStats } from '../types/inspection';
import { demoInspections } from '../data/demoInspections';
import { sanitizeProductName } from '../utils/sanitize';
import { analyzeIngredients } from './ingredientAnalyzer';
import { cloudSyncService } from './cloudSyncService';

const INSPECTIONS_KEY = 'metrologylens_inspections';
const SEEDED_KEY = 'metrologylens_seeded_v5';

function sanitizeInspection(insp: SavedInspection): SavedInspection {
  if (!insp) return insp;
  const cleanName = sanitizeProductName(insp.metadata?.productName || insp.result?.product?.name, insp.id);
  const ingredientAnalysis = insp.result?.ingredientAnalysis || analyzeIngredients(
    insp.result?.rawOcrText || (insp.result?.declarations?.map(d => d.extractedValue).join(' ') || cleanName),
    (insp.metadata?.productCategory as any) || 'FOOD'
  );

  return {
    ...insp,
    metadata: {
      ...insp.metadata,
      productName: cleanName,
    },
    result: {
      ...insp.result,
      product: {
        ...insp.result?.product,
        name: cleanName,
      },
      ingredientAnalysis,
    },
  };
}

function loadAll(): SavedInspection[] {
  try {
    if (!localStorage.getItem(SEEDED_KEY)) {
      localStorage.setItem(INSPECTIONS_KEY, JSON.stringify(demoInspections.map(sanitizeInspection)));
      localStorage.setItem(SEEDED_KEY, 'true');
    }
    const stored = localStorage.getItem(INSPECTIONS_KEY);
    if (!stored) return [];
    const parsed: SavedInspection[] = JSON.parse(stored);
    return parsed.map(sanitizeInspection);
  } catch {
    return [];
  }
}

function saveAll(inspections: SavedInspection[]): void {
  localStorage.setItem(INSPECTIONS_KEY, JSON.stringify(inspections.map(sanitizeInspection)));
}

export const persistenceService = {
  save(inspection: SavedInspection): void {
    const sanitized = sanitizeInspection(inspection);
    const all = loadAll();
    const idx = all.findIndex(i => i.id === sanitized.id);
    if (idx >= 0) {
      all[idx] = { ...sanitized, updatedAt: new Date().toISOString() };
    } else {
      all.unshift(sanitized);
    }
    saveAll(all);

    // Asynchronously sync to Cloud Database (PostgreSQL / Supabase)
    cloudSyncService.syncInspection(sanitized).catch(() => {});
  },

  get(id: string): SavedInspection | null {
    return loadAll().find(i => i.id === id) || null;
  },

  getAll(): SavedInspection[] {
    return loadAll();
  },

  delete(id: string): void {
    saveAll(loadAll().filter(i => i.id !== id));
  },

  getStats(): DashboardStats {
    const all = loadAll();
    const today = new Date().toDateString();
    const passed = all.filter(i => i.result.overallStatus === 'COMPLIANT').length;
    const withViolations = all.filter(i => i.result.overallStatus === 'CRITICAL_NON_COMPLIANT' || i.result.overallStatus === 'NON_COMPLIANT').length;
    const highSeverity = all.filter(i =>
      i.result.findings.some(f => f.severity === 'CRITICAL')
    ).length;
    const pendingReview = all.length - passed - withViolations;
    const avgCompliance = all.length
      ? Math.round(all.reduce((s, i) => s + i.result.compliancePercentage, 0) / all.length)
      : 0;
    return {
      total: all.length,
      today: all.filter(i => new Date(i.savedAt).toDateString() === today).length,
      passed,
      withViolations,
      highSeverity,
      pendingReview: Math.max(0, pendingReview),
      overallComplianceRate: avgCompliance,
    };
  },

  getChartData(days: number = 30): { date: string; count: number; passed: number; violations: number }[] {
    const all = loadAll();
    const result: Record<string, { count: number; passed: number; violations: number }> = {};
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      result[key] = { count: 0, passed: 0, violations: 0 };
    }
    all.forEach(insp => {
      const d = new Date(insp.savedAt);
      const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (diff < days) {
        const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        if (result[key]) {
          result[key].count++;
          if (insp.result.overallStatus === 'COMPLIANT') result[key].passed++;
          if (insp.result.overallStatus === 'CRITICAL_NON_COMPLIANT') result[key].violations++;
        }
      }
    });
    return Object.entries(result).map(([date, v]) => ({ date, ...v }));
  },

  getViolationsByCategory(): { category: string; count: number }[] {
    const all = loadAll();
    const map: Record<string, number> = {};
    all.forEach(insp => {
      const cat = insp.metadata.productCategory || 'FOOD';
      const violations = insp.result.findings.filter(f => f.severity === 'CRITICAL' || f.severity === 'WARNING').length;
      if (violations > 0) map[cat] = (map[cat] || 0) + violations;
    });
    const entries = Object.entries(map).map(([category, count]) => ({ category, count }));
    if (entries.length === 0) {
      return [
        { category: 'FOOD & FMCG', count: 5 },
        { category: 'ELECTRONICS', count: 3 },
        { category: 'PHARMA', count: 2 },
        { category: 'GENERAL', count: 2 }
      ];
    }
    return entries;
  },

  getTopViolations(): { name: string; count: number }[] {
    const all = loadAll();
    const map: Record<string, number> = {};
    all.forEach(insp => {
      insp.result.findings
        .filter(f => f.severity === 'CRITICAL' || f.severity === 'WARNING')
        .forEach(f => {
          map[f.title] = (map[f.title] || 0) + 1;
        });
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  },
};
