// Safe storage wrapper. localStorage can throw in sandboxed iframes or private
// mode, so we fall back to an in-memory map and never crash the app.
let memory: Record<string, string> = {};
let usable = false;

try {
  const k = '__edufly_probe__';
  window.localStorage.setItem(k, '1');
  window.localStorage.removeItem(k);
  usable = true;
} catch {
  usable = false;
}

export const safeStorage = {
  get(key: string): string | null {
    try {
      return usable ? window.localStorage.getItem(key) : memory[key] ?? null;
    } catch {
      return memory[key] ?? null;
    }
  },
  set(key: string, value: string) {
    try {
      if (usable) window.localStorage.setItem(key, value);
      else memory[key] = value;
    } catch {
      memory[key] = value;
    }
  },
  remove(key: string) {
    try {
      if (usable) window.localStorage.removeItem(key);
      delete memory[key];
    } catch {
      delete memory[key];
    }
  },
};
