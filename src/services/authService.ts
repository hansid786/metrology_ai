import { AuthUser, DEMO_USERS, UserRole } from '../types/auth';
import { getSupabase, isSupabaseConfigured } from './supabaseClient';

const AUTH_KEY = 'metrologylens_auth';
const AUTH_SOURCE_KEY = 'metrologylens_auth_source';

function isDemoAuthEnabled(): boolean {
  // Always allow demo auth for SIH hackathon.
  // In a real production deployment, set VITE_ALLOW_DEMO_AUTH=false and configure Supabase.
  return Boolean(
    (import.meta as any).env?.DEV ||
    (import.meta as any).env?.VITE_ALLOW_DEMO_AUTH === 'true' ||
    !(import.meta as any).env?.VITE_SUPABASE_URL
  );
}

export const authService = {
  login(email: string, password: string): AuthUser | null {
    if (!isDemoAuthEnabled()) return null;
    const credMap: Record<string, string> = {
      'ravi.kumar@metrologylens.gov.in': 'inspector123',
      'priya.nair@metrologylens.gov.in': 'supervisor123',
      'admin@metrologylens.gov.in': 'admin123',
    };
    if (credMap[email.toLowerCase()] !== password) return null;
    const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_SOURCE_KEY, 'demo');
    return user;
  },

  async loginWithSupabase(email: string, password: string): Promise<AuthUser | null> {
    const supabase = getSupabase();
    if (!supabase) return this.login(email, password);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) return null;
    const knownUser = DEMO_USERS.find(user => user.email.toLowerCase() === email.trim().toLowerCase());
    const user: AuthUser = knownUser || {
      id: data.user.id,
      email: data.user.email || email.trim(),
      name: data.user.user_metadata?.full_name || data.user.email || email.trim(),
      role: 'INSPECTOR',
      designation: 'Legal Metrology Officer',
      zone: 'Unassigned Zone',
      inspectorId: `SUPABASE-${data.user.id.slice(0, 8)}`,
      avatarInitials: (data.user.email || 'LM').slice(0, 2).toUpperCase(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_SOURCE_KEY, 'supabase');
    return user;
  },

  loginAsRole(role: UserRole): AuthUser {
    if (!isDemoAuthEnabled() && role !== 'CITIZEN') {
      throw new Error('Demo authentication is disabled in production. Configure Supabase Auth.');
    }
    const user = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_SOURCE_KEY, 'demo');
    return user;
  },

  loginAsDemo(role: UserRole): AuthUser {
    return this.loginAsRole(role);
  },

  loginAsCitizen(): AuthUser {
    return this.loginAsRole('CITIZEN');
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_SOURCE_KEY);
    if (isSupabaseConfigured()) void getSupabase()?.auth.signOut();
  },

  isDemoAuthEnabled,

  async hasValidSupabaseSession(): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { data } = await supabase.auth.getSession();
    return Boolean(data.session);
  },

  getCurrentUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      const source = localStorage.getItem(AUTH_SOURCE_KEY);
      if (source === 'demo' && !isDemoAuthEnabled()) return null;
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
