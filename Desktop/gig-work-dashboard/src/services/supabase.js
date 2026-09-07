// Supabase Client Initializer with Environment Variable Support
// Allows plug-and-play connection to any hosted Supabase instance

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL.startsWith('https://') &&
  !SUPABASE_URL.includes('your-project')
);

let supabaseClient = null;

export const getSupabase = () => {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseClient) {
    // Dynamic import to support environments where supabase credentials are added later
    try {
      const { createClient } = require('@supabase/supabase-js');
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn('Supabase client initialization skipped: credentials not provided or library dynamically handled.');
    }
  }
  return supabaseClient;
};
