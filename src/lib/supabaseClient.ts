import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Cloud sync (Google login + saved progress) is an enhancement, not a
// requirement. If the env vars are missing, we ship a null client so the
// rest of the app keeps working on localStorage alone rather than crashing
// at import time.
export const cloudEnabled = Boolean(url && anonKey);

// supabase-js persists the auth session to localStorage by default, which
// can throw in a sandboxed preview iframe. Wrap it the same way the rest of
// the app wraps storage, so a blocked localStorage degrades to memory
// instead of crashing the client.
let memory: Record<string, string> = {};
const safeAuthStorage = {
  getItem(key: string) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memory[key] ?? null;
    }
  },
  setItem(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      memory[key] = value;
    }
  },
  removeItem(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      delete memory[key];
    }
  },
};

export const supabase = cloudEnabled
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: safeAuthStorage,
      },
    })
  : null;
