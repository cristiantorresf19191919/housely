import type { Metadata } from 'next';
import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { themeBootScript } from '@/lib/theme/boot';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
});

const sans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Housely — Stays curated like art.',
  description:
    'A hand-picked register of private residences. Reserve in seconds. Pay the keys at the door.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          // Hardcoded constant from our own module — no user input. Required to
          // set the theme attribute before paint to prevent flash of wrong theme.
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
          suppressHydrationWarning
        />
      </head>
      <body>
        {/* Theme-transition filter — referenced from globals.css so the
            View Transition pseudo-elements can break the circular front
            into an organic, ink-on-paper bleed. Hidden, always present. */}
        <svg
          aria-hidden
          width="0"
          height="0"
          style={{ position: 'absolute', width: 0, height: 0 }}
        >
          <defs>
            <filter
              id="theme-ink-bleed"
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012"
                numOctaves="3"
                seed="7"
              />
              <feDisplacementMap in="SourceGraphic" scale="22" />
            </filter>
          </defs>
        </svg>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
