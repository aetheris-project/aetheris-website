"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import type { ReactNode } from "react";

export type ThemeName = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

const STORAGE_KEY = "aetheris-theme";

interface ThemeContextValue {
  theme: ThemeName;
  resolved: ResolvedTheme;
  setTheme: (theme: ThemeName) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemResolved(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function readStoredTheme(): ThemeName {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light" || stored === "system") return stored;
  } catch {
    // localStorage unavailable (private mode / SSR guard) - fall through.
  }
  return "dark";
}

/**
 * ThemeProvider
 *
 * Applies the effective theme (dark / light / system) to the document root as
 * [data-theme], which activates the CSS token blocks in globals.css. The
 * choice is persisted to localStorage and reacts to system preference changes
 * while in "system" mode. A tiny inline script in the root layout applies the
 * stored theme before first paint to prevent a flash of the wrong theme.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("dark");
  const [resolved, setResolved] = useState<ResolvedTheme>("dark");
  const hydratedRef = useRef(false);

  // Hydrate the stored preference after mount and apply it immediately, so
  // the sync effect below never runs against the SSR-defaulted state.
  useEffect(() => {
    const stored = readStoredTheme();
    setThemeState(stored);
    const next = stored === "system" ? systemResolved() : stored;
    document.documentElement.setAttribute("data-theme", next);
    setResolved(next);
    hydratedRef.current = true;
  }, []);

  // Keep the document root and media query listener in sync. Skipped on the
  // very first run (hydration already applied the stored theme); the state
  // update from the mount effect re-runs this effect with the real value.
  useEffect(() => {
    if (!hydratedRef.current) return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const apply = () => {
      const next: ResolvedTheme = theme === "system" ? (media.matches ? "light" : "dark") : theme;
      document.documentElement.setAttribute("data-theme", next);
      setResolved(next);
    };
    apply();
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Non-fatal: theme simply won't persist.
    }
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((current) => {
      if (current === "system") return systemResolved() === "light" ? "dark" : "light";
      return current === "dark" ? "light" : "dark";
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolved, setTheme, toggle }),
    [theme, resolved, setTheme, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
