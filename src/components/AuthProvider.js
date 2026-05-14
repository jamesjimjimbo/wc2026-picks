'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) {
      console.log('[AUTH] No supabase client');
      setLoading(false);
      return;
    }

    let mounted = true;
    console.log('[AUTH] Starting init...');

    async function init() {
      try {
        console.log('[AUTH] Calling getSession...');
        const { data, error } = await supabase.auth.getSession();
        console.log('[AUTH] getSession returned:', { session: !!data?.session, error });

        if (!mounted) return;

        if (error || !data?.session?.user) {
          console.log('[AUTH] No valid session, showing login');
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        console.log('[AUTH] Session valid, user:', data.session.user.email);
        setUser(data.session.user);

        console.log('[AUTH] Fetching profile...');
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        console.log('[AUTH] Profile result:', { profileData, profileErr });

        if (!mounted) return;

        setProfile(profileData || null);
        setLoading(false);
        console.log('[AUTH] Init complete');

      } catch (e) {
        console.error('[AUTH] Init error:', e);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH] State change:', event, !!session);
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (mounted) {
            setProfile(profileData || null);
            setLoading(false);
          }
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signUp(email, password, displayName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    return { data, error };
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signUp, signIn, signOut,
      supabase,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
