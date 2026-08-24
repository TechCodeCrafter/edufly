import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, cloudEnabled } from '../lib/supabaseClient';
import { safeStorage } from './storage';

const RETURN_PATH_KEY = 'edufly.auth.returnPath';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  cloudEnabled: boolean;
  // True for exactly one render after a real sign-in completes (Google
  // redirect finished, or any other sign-in call resolves). False when a
  // session is merely restored on page load. Lets the rest of the app show
  // a one-time welcome moment without re-showing it on every refresh.
  justSignedIn: boolean;
  clearJustSignedIn: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(cloudEnabled);
  const [justSignedIn, setJustSignedIn] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setLoading(false);
      // SIGNED_IN fires for a genuine new sign-in (including the OAuth
      // redirect landing back here). INITIAL_SESSION fires when a
      // previously-persisted session is simply restored on page load, so we
      // deliberately don't treat that as "just signed in".
      if (event === 'SIGNED_IN') {
        setJustSignedIn(true);

        // Restore the route the learner was on before the Google redirect,
        // and strip the ?code=... (and any other auth query params)
        // Google/Supabase appended so the address bar is clean. A popstate
        // event tells React Router about the URL we just swapped in.
        const returnPath = safeStorage.get(RETURN_PATH_KEY);
        safeStorage.remove(RETURN_PATH_KEY);
        const cleanPath = returnPath && returnPath.startsWith('/') ? returnPath : window.location.pathname;
        window.history.replaceState(window.history.state, '', cleanPath);
        window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const clearJustSignedIn = useCallback(() => setJustSignedIn(false), []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) return;
    // Remember exactly where the learner clicked "sign in" so we can send
    // them back after the round trip. We redirect to the site root (the
    // URL already on Supabase's allow-list) rather than the current deep
    // path, then restore the saved path once the session lands.
    safeStorage.set(RETURN_PATH_KEY, window.location.pathname);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const value: AuthCtx = {
    user: session?.user ?? null,
    loading,
    cloudEnabled,
    justSignedIn,
    clearJustSignedIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
