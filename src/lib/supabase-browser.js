import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let client = null;

export function createClient() {
  if (client) return client;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url === 'your_supabase_url_here') {
    return null;
  }
  
  client = createSupabaseClient(url, key);
  return client;
}
