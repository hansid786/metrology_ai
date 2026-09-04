import { AuthUser, DEMO_USERS, UserRole } from '../types/auth';
import { getSupabase, isSupabaseConfigured } from './supabaseClient';

const AUTH_KEY = 'metrologylens_auth';
const AUTH_SOURCE_KEY = 'metrologylens_auth_source';

// Demo auth is ALWAYS enabled when Supabase is not configured (SIH hackathon mode).
// To disable demo auth in production: set VITE_PRODUCTION_AUTH=true AND configure Supabase.
function isDemoAuthEnabled(): boolean {
  const productionAuthEnabled = (import.meta as any).env?.VITE_PRODUCTION_AUTH === 'true';
  if (!productionAuthEnabled) return true;          // not locked down → always allow demo
  if (!isSupabaseConfigured()) return true;         // no Supabase → must allow demo
  return false;
}

export const authService = {
  login(email: string, password: string): AuthUser | null {
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
    // No Supabase configured → fall back to demo credentials
    if (!supabase) return this.login(email, password);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) {
      // Supabase failed → try demo fallback
      return this.login(email, password);
    }
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

  isDemoSession(): boolean {
    return localStorage.getItem(AUTH_SOURCE_KEY) === 'demo';
  },

  async hasValidSupabaseSession(): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { data } = await supabase.auth.getSession();
    return Boolean(data.session);
  },

  getCurrentUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
