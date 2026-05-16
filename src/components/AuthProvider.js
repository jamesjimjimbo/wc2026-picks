'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getAuthClient, getDbClient, withTimeout } from '@/lib/supabase-browser';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const authClient = getAuthClient();
  const dbClient = getDbClient();

  useEffect(() => {
    mountedRef.current = true;

    if (!authClient || !dbClient) {
      setLoading(false);
      return;
    }

    // HARD DEADLINE: no matter what happens, stop showing the loading screen after 6s
    const hardTimeout = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn('[AUTH] Hard timeout reached — forcing load complete');
        setLoading(false);
      }
    }, 6000);

    // Listen for auth state changes — this is the ONLY way we detect sessions
    const { data: { subscription } } = authClient.auth.onAuthStateChange(
      (event, session) => {
        if (!mountedRef.current) return;

        if (session?.user) {
          setUser(session.user);

          // Fetch profile using the DB client (not auth client) with a timeout
          withTimeout(
            dbClient.from('profiles').select('*').eq('id', session.user.id).single(),
            5000,
            'profile fetch'
          )
            .then(({ data }) => {
              if (mountedRef.current) {
                setProfile(data || null);
                setLoading(false);
              }
            })
            .catch((err) => {
              console.warn('[AUTH] Profile fetch failed:', err.message);
              if (mountedRef.current) {
                setProfile(null);
                setLoading(false);
              }
            });
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mountedRef.current = false;
      clearTimeout(hardTimeout);
      subscription.unsubscribe();
    };
  }, []);

  async function signUp(email, password, displayName) {
    try {
      return await withTimeout(
        authClient.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } },
        }),
        10000,
        'signUp'
      );
    } catch (e) {
      return { data: null, error: { message: e.message } };
    }
  }

  async function signIn(email, password) {
    try {
      return await withTimeout(
        authClient.auth.signInWithPassword({ email, password }),
        10000,
        'signIn'
      );
    } catch (e) {
      return { data: null, error: { message: e.message } };
    }
  }

  async function signOut() {
    try {
      await withTimeout(authClient.auth.signOut(), 5000, 'signOut');
    } catch (e) {
      // Force clear even if signOut hangs
      console.warn('[AUTH] signOut timed out, clearing locally');
      try { localStorage.removeItem('wc2026-auth'); } catch (_) {}
    }
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signUp, signIn, signOut,
      supabase: dbClient, // components use the DB client for all queries
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
