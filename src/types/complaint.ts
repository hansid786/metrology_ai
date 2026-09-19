import { ProductCategory } from './inspection';

export type ComplaintStatus =
  | 'PENDING_REVIEW'
  | 'OFFICER_ASSIGNED'
  | 'NOTICE_ISSUED'
  | 'SEIZURE_ORDERED'
  | 'RESOLVED'
  | 'DISMISSED';

export type DiscrepancyCategory =
  | 'OVERCHARGING_MRP'
  | 'MISSING_USP'
  | 'EXPIRY_DEFECT'
  | 'NET_QTY_SHORTAGE'
  | 'DECEPTIVE_PACKAGING'
  | 'MISSING_MANDATORY_DECLARATIONS'
  | 'OTHER';

export interface ConsumerComplaint {
  id: string;
  inspectionId?: string;
  complainantName: string;
  complainantPhone: string;
  complainantEmail?: string;
  complainantLocation: string;
  storeName: string;
  storeAddress: string;
  productName: string;
  productCategory: ProductCategory;
  mrpAmount?: number;
  chargedAmount?: number;
  discrepancyType: DiscrepancyCategory;
  description: string;
  proofImageUrl?: string;
  status: ComplaintStatus;
  assignedOfficer?: string;
  noticeNumber?: string;
  actionNotes?: string;
  resolutionSummary?: string;
  filedAt: string;
  updatedAt: string;
}
