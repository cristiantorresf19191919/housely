'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { THEME_STORAGE_KEY as STORAGE_KEY } from './boot';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: (origin?: { x: number; y: number }) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  // Hydrate from the attribute the inline script already set on <html>.
  useEffect(() => {
    const initial =
      (document.documentElement.getAttribute('data-theme') as Theme | null) ??
      'light';
    setThemeState(initial);
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // best-effort
    }
    setThemeState(next);
  }, []);

  const setTheme = useCallback((next: Theme) => applyTheme(next), [applyTheme]);

  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';

      const docWithVT = document as Document & {
        startViewTransition?: (cb: () => void) => unknown;
      };
      const supportsVT =
        typeof docWithVT.startViewTransition === 'function';
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (supportsVT && origin) {
        document.documentElement.style.setProperty(
          '--ripple-x',
          `${origin.x}px`
        );
        document.documentElement.style.setProperty(
          '--ripple-y',
          `${origin.y}px`
        );
      }

      // Mount the sweeping ink-line overlay alongside the view transition
      // so the pixel flicker and the "wet ink" line travel in sync.
      let sweep: HTMLDivElement | null = null;
      if (!reduceMotion) {
        sweep = document.createElement('div');
        sweep.className = 'theme-paperwhite-sweep';
        sweep.setAttribute('aria-hidden', 'true');
        document.body.appendChild(sweep);
        // Clean up just after the 900ms keyframes finish.
        window.setTimeout(() => {
          sweep?.remove();
        }, 950);
      }

      if (supportsVT && docWithVT.startViewTransition && !reduceMotion) {
        docWithVT.startViewTransition(() => applyTheme(next));
      } else {
        applyTheme(next);
      }
    },
    [theme, applyTheme]
  );

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

