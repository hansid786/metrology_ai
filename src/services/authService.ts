import { AuthUser, DEMO_USERS, UserRole } from '../types/auth';

const AUTH_KEY = 'metrologylens_auth';

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
    return user;
  },

  loginAsRole(role: UserRole): AuthUser {
    const user = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
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
  },

  getCurrentUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
