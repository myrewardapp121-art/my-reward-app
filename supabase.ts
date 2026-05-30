import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Verify that the keys are actual configured values rather than placeholder templates
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project') &&
  !supabaseAnonKey.includes('your-supabase-anon-key');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Graceful notice log
if (isSupabaseConfigured) {
  console.log('✅ Supabase integrated successfully.');
} else {
  console.warn('⚠️ Supabase URL or Anon Key is missing. Using local secure storage for testing/preview.');
}
