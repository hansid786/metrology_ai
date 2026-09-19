import { ConsumerComplaint, ComplaintStatus } from '../types/complaint';
import { DEMO_COMPLAINTS } from '../data/demoComplaints';

const COMPLAINTS_KEY = 'metrologylens_consumer_complaints';
const SEEDED_KEY = 'metrologylens_complaints_seeded';

function loadAll(): ConsumerComplaint[] {
  try {
    if (!localStorage.getItem(SEEDED_KEY)) {
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(DEMO_COMPLAINTS));
      localStorage.setItem(SEEDED_KEY, 'true');
    }
    const stored = localStorage.getItem(COMPLAINTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveAll(complaints: ConsumerComplaint[]): void {
  try {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.error('Failed to save complaints:', e);
  }
}

export const complaintService = {
  getAll(): ConsumerComplaint[] {
    return loadAll();
  },

  get(id: string): ConsumerComplaint | null {
    return loadAll().find(c => c.id === id) || null;
  },

  fileComplaint(complaint: Omit<ConsumerComplaint, 'id' | 'status' | 'filedAt' | 'updatedAt'>): ConsumerComplaint {
    const all = loadAll();
    const newId = `GRV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const newRecord: ConsumerComplaint = {
      ...complaint,
      id: newId,
      status: 'PENDING_REVIEW',
      filedAt: now,
      updatedAt: now,
    };

    all.unshift(newRecord);
    saveAll(all);

    // Notify any listening components
    window.dispatchEvent(new CustomEvent('consumer-complaint-filed', { detail: newRecord }));

    return newRecord;
  },

  updateStatus(
    id: string,
    status: ComplaintStatus,
    officerName?: string,
    actionNotes?: string,
    noticeNumber?: string,
    resolutionSummary?: string
  ): ConsumerComplaint | null {
    const all = loadAll();
    const idx = all.findIndex(c => c.id === id);
    if (idx === -1) return null;

    all[idx] = {
      ...all[idx],
      status,
      assignedOfficer: officerName || all[idx].assignedOfficer,
      actionNotes: actionNotes || all[idx].actionNotes,
      noticeNumber: noticeNumber || all[idx].noticeNumber,
      resolutionSummary: resolutionSummary || all[idx].resolutionSummary,
      updatedAt: new Date().toISOString(),
    };

    saveAll(all);
    return all[idx];
  },

  getStats(): {
    total: number;
    pending: number;
    noticeIssued: number;
    resolved: number;
  } {
    const all = loadAll();
    return {
      total: all.length,
      pending: all.filter(c => c.status === 'PENDING_REVIEW' || c.status === 'OFFICER_ASSIGNED').length,
      noticeIssued: all.filter(c => c.status === 'NOTICE_ISSUED' || c.status === 'SEIZURE_ORDERED').length,
      resolved: all.filter(c => c.status === 'RESOLVED').length,
    };
  },

  delete(id: string): void {
    const all = loadAll().filter(c => c.id !== id);
    saveAll(all);
  }
};
