import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.SUPABASE_URL as string) || '';
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY as string) || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Hadoota] Supabase credentials not found. Cross-device sync will not work.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
