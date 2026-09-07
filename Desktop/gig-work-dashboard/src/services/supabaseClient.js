import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

/**
 * Helper to sync data to Supabase table
 */
export async function syncToDatabase(table, payload) {
  if (!isSupabaseConfigured || !supabase) {
    return { success: true, localOnly: true, data: payload };
  }
  try {
    const { data, error } = await supabase.from(table).upsert(payload).select();
    if (error) throw error;
    return { success: true, localOnly: false, data };
  } catch (err) {
    console.warn([Supabase Sync Warning for ]:, err.message);
    return { success: false, error: err.message, localOnly: true, data: payload };
  }
}
