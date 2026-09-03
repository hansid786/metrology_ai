export type UserRole = 'INSPECTOR' | 'SUPERVISOR' | 'ADMIN' | 'CITIZEN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  zone: string;
  inspectorId: string;
  avatarInitials: string;
}

export const DEMO_USERS: AuthUser[] = [
  {
    id: 'usr-001',
    name: 'Officer Ravi Kumar',
    email: 'ravi.kumar@metrologylens.gov.in',
    role: 'INSPECTOR',
    designation: 'Legal Metrology Officer (Grade II)',
    zone: 'NCT of Delhi, Zone-IV',
    inspectorId: 'LMO-DEL-2024-0042',
    avatarInitials: 'RK',
  },
  {
    id: 'usr-002',
    name: 'Supervisor Priya Nair',
    email: 'priya.nair@metrologylens.gov.in',
    role: 'SUPERVISOR',
    designation: 'Controller of Legal Metrology',
    zone: 'NCT of Delhi',
    inspectorId: 'CLM-DEL-2024-0008',
    avatarInitials: 'PN',
  },
  {
    id: 'usr-citizen',
    name: 'Citizen Consumer',
    email: 'consumer@public.in',
    role: 'CITIZEN',
    designation: 'Consumer / Citizen (Jago Grahak Jago)',
    zone: 'Public Verification Access',
    inspectorId: 'CITIZEN-VERIFIED',
    avatarInitials: 'CC',
  },
  {
    id: 'usr-003',
    name: 'Admin Portal',
    email: 'admin@metrologylens.gov.in',
    role: 'ADMIN',
    designation: 'System Administrator',
    zone: 'National Portal',
    inspectorId: 'ADM-0001',
    avatarInitials: 'AP',
  },
];
