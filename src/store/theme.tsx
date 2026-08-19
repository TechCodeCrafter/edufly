import { createContext, useContext, useEffect, useState } from 'react';
import { safeStorage } from './storage';

type Theme = 'light' | 'dark';
const KEY = 'edufly.theme';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = safeStorage.get(KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light'; // content defaults to light per the hybrid spec
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-content-theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    safeStorage.set(KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
