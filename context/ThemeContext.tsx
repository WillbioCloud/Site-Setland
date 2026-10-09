import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ThemeEra } from '../types';

export type SiteTheme = ThemeEra | 'default';

export const THEME_STORAGE_KEY = 'setland:era';
export const THEME_CHANNEL_NAME = 'setland_theme_channel';

const themes: SiteTheme[] = ['default', 'glacial', 'medieval', 'futuristic'];

/** Mirrors the per-era --theme-bg token so the browser chrome matches the atmosphere. */
const themeColors: Record<SiteTheme, string> = {
  default: '#0c0a09',
  glacial: '#050e18',
  medieval: '#100c08',
  futuristic: '#060810',
};

/** Length of the colour cross-fade applied when the visitor changes atmosphere. */
const SWITCH_TRANSITION_MS = 700;

interface ThemeContextType {
  currentTheme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
  isChristmasMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const isSiteTheme = (value: unknown): value is SiteTheme => themes.includes(value as SiteTheme);

const readStoredTheme = (): SiteTheme => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isSiteTheme(stored) ? stored : 'default';
  } catch {
    return 'default';
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<SiteTheme>(readStoredTheme);
  // Mirrors the committed theme so listeners can ignore echoes of the value already applied.
  const currentRef = useRef<SiteTheme>(currentTheme);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const hasAppliedRef = useRef(false);
  const transitionTimerRef = useRef<number | undefined>(undefined);

  // Cross-tab sync. BroadcastChannel delivers instantly; the `storage` event covers browsers
  // without it. Both paths converge on the same value, so whichever arrives first wins.
  useEffect(() => {
    const adopt = (theme: unknown) => {
      if (!isSiteTheme(theme) || theme === currentRef.current) return;
      currentRef.current = theme;
      setCurrentTheme(theme);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) adopt(event.newValue);
    };

    const channel =
      typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(THEME_CHANNEL_NAME);
    if (channel) {
      channel.onmessage = (event: MessageEvent<{ theme?: unknown }>) => adopt(event.data?.theme);
    }
    channelRef.current = channel;
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      channel?.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = currentTheme;
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', themeColors[currentTheme]);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch {
      /* Private browsing may block storage. */
    }

    // Skip the cross-fade on first paint; only real switches animate, and only when motion is allowed.
    if (!hasAppliedRef.current) {
      hasAppliedRef.current = true;
      return;
    }
    root.classList.add('is-theme-switching');
    window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = window.setTimeout(
      () => root.classList.remove('is-theme-switching'),
      SWITCH_TRANSITION_MS,
    );
  }, [currentTheme]);

  useEffect(() => () => window.clearTimeout(transitionTimerRef.current), []);

  const setTheme = useCallback((theme: SiteTheme) => {
    if (!isSiteTheme(theme) || theme === currentRef.current) return;
    currentRef.current = theme;
    setCurrentTheme(theme);
    try {
      channelRef.current?.postMessage({ theme });
    } catch {
      /* The channel may already be closed during teardown. */
    }
  }, []);

  const value = useMemo<ThemeContextType>(
    () => ({
      currentTheme,
      setTheme,
      isChristmasMode: new Date().getMonth() === 11,
    }),
    [currentTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
