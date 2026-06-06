'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getAuthClient, getDbClient, withTimeout } from '@/lib/supabase-browser';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const mountedRef = useRef(true);

  const authClient = getAuthClient();
  const dbClient = getDbClient();

  useEffect(() => {
    mountedRef.current = true;

    if (!authClient || !dbClient) {
      setLoading(false);
      return;
    }

    // HARD DEADLINE: loading screen disappears after 6s no matter what
    const hardTimeout = setTimeout(() => {
      if (mountedRef.current && loading) {
        setLoading(false);
      }
    }, 6000);

    const { data: { subscription } } = authClient.auth.onAuthStateChange(
      (event, session) => {
        if (!mountedRef.current) return;

        // Detect password recovery flow
        if (event === 'PASSWORD_RECOVERY') {
          setPasswordRecovery(true);
          setUser(session?.user || null);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);

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
            .catch(() => {
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
      try { localStorage.removeItem('wc2026-auth'); } catch (_) {}
    }
    setUser(null);
    setProfile(null);
  }

  async function resetPassword(email) {
    try {
      const { error } = await withTimeout(
        authClient.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}`,
        }),
        10000,
        'resetPassword'
      );
      return { error };
    } catch (e) {
      return { error: { message: e.message } };
    }
  }

  async function updatePassword(newPassword) {
    try {
      const { error } = await withTimeout(
        authClient.auth.updateUser({ password: newPassword }),
        10000,
        'updatePassword'
      );
      if (!error) setPasswordRecovery(false);
      return { error };
    } catch (e) {
      return { error: { message: e.message } };
    }
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      passwordRecovery,
      signUp, signIn, signOut,
      resetPassword, updatePassword,
      supabase: dbClient,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
