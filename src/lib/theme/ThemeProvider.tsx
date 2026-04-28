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

// Surface colours used by the fallback overlay (must match :root tokens
// in globals.css). Picked so the overlay reveals the new theme underneath
// without a colour pop the moment we swap the attribute.
const SURFACE_FOR: Record<Theme, string> = {
  light: '#F5EFE6',
  dark: '#0F0B08',
};

function readDurationMs(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--theme-transition-duration')
    .trim();
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return 720;
  return raw.endsWith('ms') ? n : n * 1000;
}

function distanceToFarthestCorner(x: number, y: number): number {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  // Hydrate from the attribute the inline boot script already set on <html>.
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
      const root = document.documentElement;

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (reduceMotion) {
        applyTheme(next);
        return;
      }

      // Origin = centre of the toggle if provided, otherwise viewport centre.
      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      const radius = Math.ceil(distanceToFarthestCorner(x, y));

      root.style.setProperty('--ripple-x', `${x}px`);
      root.style.setProperty('--ripple-y', `${y}px`);
      root.style.setProperty('--ripple-radius', `${radius}px`);

      const docWithVT = document as Document & {
        startViewTransition?: (cb: () => void | Promise<void>) => unknown;
      };

      if (typeof docWithVT.startViewTransition === 'function') {
        // Native path — the browser snapshots the page, applies the new
        // theme inside the callback, then ::view-transition-new(root)
        // animates the clip-path circle outward over the old snapshot.
        docWithVT.startViewTransition(() => applyTheme(next));
        return;
      }

      // ── Fallback (Firefox, older Safari) ──────────────────────────
      // Paint a fixed overlay in the target theme's surface colour and
      // animate its clip-path circle from the origin outward. When the
      // overlay fully covers the viewport we swap the theme attribute
      // and remove the overlay, revealing the new theme underneath.
      const overlay = document.createElement('div');
      overlay.className = 'theme-ink-fallback';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.style.setProperty('--ink-fallback-color', SURFACE_FOR[next]);
      document.body.appendChild(overlay);

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        applyTheme(next);
        overlay.remove();
      };
      overlay.addEventListener('animationend', finish, { once: true });
      // Belt + braces in case the animationend event is missed.
      window.setTimeout(finish, readDurationMs() + 80);
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
