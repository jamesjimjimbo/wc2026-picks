import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isConfigured = url && key && url !== 'your_supabase_url_here';

// Workaround for Supabase navigator.locks deadlock bug
// https://github.com/supabase/supabase-js/issues/1594
const noOpLock = async (_name, _acquireTimeout, fn) => await fn();

// AUTH CLIENT — only used for signIn, signUp, signOut, onAuthStateChange
let authClient = null;
export function getAuthClient() {
  if (!isConfigured) return null;
  if (authClient) return authClient;
  authClient = createSupabaseClient(url, key, {
    auth: {
      storageKey: 'wc2026-auth',
      lock: noOpLock,
      autoRefreshToken: true,
      persistSession: true,
    },
  });
  return authClient;
}

// DB CLIENT — used for all database queries (from/select/insert/upsert/delete/rpc)
// This is a separate instance so it never gets blocked by auth locks
let dbClient = null;
export function getDbClient() {
  if (!isConfigured) return null;
  if (dbClient) return dbClient;
  dbClient = createSupabaseClient(url, key, {
    auth: {
      storageKey: 'wc2026-auth', // shares the same session storage
      lock: noOpLock,
      autoRefreshToken: false, // only the auth client refreshes tokens
      persistSession: true,
    },
  });
  return dbClient;
}

// Helper: wrap any promise in a timeout so it can never hang
export function withTimeout(promise, ms = 8000, label = 'operation') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}
