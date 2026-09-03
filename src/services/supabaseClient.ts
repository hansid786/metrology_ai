import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite env or local storage
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || localStorage.getItem('supabase_url') || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabase_anon_key') || '';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const currentUrl = (import.meta as any).env?.VITE_SUPABASE_URL || localStorage.getItem('supabase_url') || '';
  const currentKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || localStorage.getItem('supabase_anon_key') || '';

  if (currentUrl && currentKey) {
    try {
      supabaseInstance = createClient(currentUrl, currentKey, {
        auth: { persistSession: true }
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('[MetrologyLens] Supabase client init note:', err);
      return null;
    }
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null;
}

export function updateSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    if (url && anonKey) {
      localStorage.setItem('supabase_url', url.trim());
      localStorage.setItem('supabase_anon_key', anonKey.trim());
      supabaseInstance = createClient(url.trim(), anonKey.trim());
      return true;
    } else {
      localStorage.removeItem('supabase_url');
      localStorage.removeItem('supabase_anon_key');
      supabaseInstance = null;
      return true;
    }
  } catch {
    return false;
  }
}
