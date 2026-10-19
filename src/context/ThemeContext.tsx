import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type AppTheme = 'auto' | 'dark' | 'light' | 'navy' | 'onyx';
export type TelegramColorScheme = 'dark' | 'light';
export type TelegramPlatform = 'ios' | 'base';

export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  bottom_bar_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
  section_separator_color?: string;
}

interface ThemeContextType {
  theme: AppTheme;
  colorScheme: TelegramColorScheme;
  isDark: boolean;
  isOnyx: boolean;
  platform: TelegramPlatform;
  themeParams: TelegramThemeParams;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

const DEFAULT_DARK_PARAMS: TelegramThemeParams = {
  bg_color: '#0e1621',
  secondary_bg_color: '#17212b',
  section_bg_color: '#17212b',
  header_bg_color: '#17212b',
  bottom_bar_bg_color: '#17212b',
  text_color: '#ffffff',
  hint_color: '#7d8b99',
  link_color: '#2ea6ff',
  button_color: '#2ea6ff',
  button_text_color: '#ffffff',
  subtitle_text_color: '#82868a',
  destructive_text_color: '#ff595a',
  section_separator_color: 'rgba(255, 255, 255, 0.08)',
  accent_text_color: '#2ea6ff'
};

const DEFAULT_LIGHT_PARAMS: TelegramThemeParams = {
  bg_color: '#f0f2f5',
  secondary_bg_color: '#ffffff',
  section_bg_color: '#ffffff',
  header_bg_color: '#ffffff',
  bottom_bar_bg_color: '#ffffff',
  text_color: '#000000',
  hint_color: '#8e8e93',
  link_color: '#2481cc',
  button_color: '#2481cc',
  button_text_color: '#ffffff',
  subtitle_text_color: '#707579',
  destructive_text_color: '#e53935',
  section_separator_color: 'rgba(0, 0, 0, 0.08)',
  accent_text_color: '#2481cc'
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'auto',
  colorScheme: 'dark',
  isDark: true,
  isOnyx: true,
  platform: 'base',
  themeParams: DEFAULT_DARK_PARAMS,
  setTheme: () => {},
  toggleTheme: () => {}
});

function getTelegramWebApp() {
  if (typeof window !== 'undefined') {
    return (window as any).Telegram?.WebApp;
  }
  return undefined;
}

function detectPlatform(): TelegramPlatform {
  if (typeof window === 'undefined') return 'base';
  const tg = getTelegramWebApp();
  if (tg?.platform === 'ios') return 'ios';
  const ua = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod|macintosh/.test(ua) && 'ontouchend' in document) {
    return 'ios';
  }
  return 'base';
}

function getSystemColorScheme(): TelegramColorScheme {
  if (typeof window === 'undefined') return 'dark';
  const tg = getTelegramWebApp();
  if (tg?.colorScheme === 'dark' || tg?.colorScheme === 'light') {
    return tg.colorScheme;
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('telegram_theme_preference') || localStorage.getItem('app_theme');
      if (saved === 'light' || saved === 'dark' || saved === 'auto' || saved === 'navy' || saved === 'onyx') {
        return saved as AppTheme;
      }
    } catch {}
    return 'auto';
  });

  const [systemScheme, setSystemScheme] = useState<TelegramColorScheme>(getSystemColorScheme);
  const [platform] = useState<TelegramPlatform>(detectPlatform);

  const activeColorScheme: TelegramColorScheme = useMemo(() => {
    if (theme === 'light') return 'light';
    if (theme === 'dark' || theme === 'onyx' || theme === 'navy') return 'dark';
    return systemScheme;
  }, [theme, systemScheme]);

  const isDark = activeColorScheme === 'dark';

  const tgThemeParams = useMemo<TelegramThemeParams>(() => {
    const tg = getTelegramWebApp();
    const liveParams = tg?.themeParams || {};
    const defaults = isDark ? DEFAULT_DARK_PARAMS : DEFAULT_LIGHT_PARAMS;

    if (!isDark) {
      const bg = liveParams.secondary_bg_color && liveParams.secondary_bg_color !== '#ffffff' ? liveParams.secondary_bg_color : defaults.bg_color;
      const sec = '#ffffff';

      return {
        bg_color: bg,
        text_color: liveParams.text_color || defaults.text_color,
        hint_color: liveParams.hint_color || defaults.hint_color,
        link_color: liveParams.link_color || defaults.link_color,
        button_color: liveParams.button_color || defaults.button_color,
        button_text_color: liveParams.button_text_color || defaults.button_text_color,
        secondary_bg_color: sec,
        header_bg_color: liveParams.header_bg_color || sec,
        bottom_bar_bg_color: liveParams.bottom_bar_bg_color || sec,
        accent_text_color: liveParams.accent_text_color || liveParams.link_color || defaults.accent_text_color,
        section_bg_color: liveParams.section_bg_color || sec,
        section_header_text_color: liveParams.section_header_text_color || defaults.section_header_text_color,
        subtitle_text_color: liveParams.subtitle_text_color || defaults.subtitle_text_color,
        destructive_text_color: liveParams.destructive_text_color || defaults.destructive_text_color,
        section_separator_color: liveParams.section_separator_color || defaults.section_separator_color,
      };
    }

    return {
      bg_color: liveParams.bg_color || defaults.bg_color,
      text_color: liveParams.text_color || defaults.text_color,
      hint_color: liveParams.hint_color || defaults.hint_color,
      link_color: liveParams.link_color || defaults.link_color,
      button_color: liveParams.button_color || defaults.button_color,
      button_text_color: liveParams.button_text_color || defaults.button_text_color,
      secondary_bg_color: liveParams.secondary_bg_color || defaults.secondary_bg_color,
      header_bg_color: liveParams.header_bg_color || liveParams.secondary_bg_color || defaults.header_bg_color,
      bottom_bar_bg_color: liveParams.bottom_bar_bg_color || liveParams.secondary_bg_color || defaults.bottom_bar_bg_color,
      accent_text_color: liveParams.accent_text_color || liveParams.link_color || defaults.accent_text_color,
      section_bg_color: liveParams.section_bg_color || liveParams.secondary_bg_color || defaults.section_bg_color,
      section_header_text_color: liveParams.section_header_text_color || liveParams.hint_color || defaults.section_header_text_color,
      subtitle_text_color: liveParams.subtitle_text_color || defaults.subtitle_text_color,
      destructive_text_color: liveParams.destructive_text_color || defaults.destructive_text_color,
      section_separator_color: liveParams.section_separator_color || defaults.section_separator_color,
    };
  }, [isDark]);

  const applyThemeToDOM = useCallback(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', activeColorScheme);
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);

    body.setAttribute('data-theme', activeColorScheme);
    body.classList.toggle('dark', isDark);
    body.classList.toggle('light', !isDark);
    body.classList.toggle('theme-onyx', isDark);
    body.classList.toggle('theme-navy', false);

    // Telegram Theme Variables
    const p = tgThemeParams;
    const setVar = (name: string, val?: string) => {
      if (val) {
        root.style.setProperty(name, val);
      }
    };

    setVar('--tg-theme-bg-color', p.bg_color);
    setVar('--tg-theme-text-color', p.text_color);
    setVar('--tg-theme-hint-color', p.hint_color);
    setVar('--tg-theme-link-color', p.link_color);
    setVar('--tg-theme-button-color', p.button_color);
    setVar('--tg-theme-button-text-color', p.button_text_color);
    setVar('--tg-theme-secondary-bg-color', p.secondary_bg_color);
    setVar('--tg-theme-header-bg-color', p.header_bg_color);
    setVar('--tg-theme-bottom-bar-bg-color', p.bottom_bar_bg_color);
    setVar('--tg-theme-accent-text-color', p.accent_text_color);
    setVar('--tg-theme-section-bg-color', p.section_bg_color);
    setVar('--tg-theme-subtitle-text-color', p.subtitle_text_color);
    setVar('--tg-theme-destructive-text-color', p.destructive_text_color);
    setVar('--tg-theme-section-separator-color', p.section_separator_color);

    // Standardized app shorthands
    setVar('--tg-bg-color', p.bg_color);
    setVar('--tg-secondary-bg-color', p.secondary_bg_color);
    setVar('--tg-section-bg-color', p.section_bg_color);
    setVar('--tg-header-bg-color', p.header_bg_color);
    setVar('--tg-bottom-bar-bg-color', p.bottom_bar_bg_color);
    setVar('--tg-text-color', p.text_color);
    setVar('--tg-hint-color', p.hint_color);
    setVar('--tg-link-color', p.link_color);
    setVar('--tg-button-color', p.button_color);
    setVar('--tg-button-text-color', p.button_text_color);
    setVar('--tg-subtitle-text-color', p.subtitle_text_color);
    setVar('--tg-destructive-text-color', p.destructive_text_color);
    setVar('--tg-section-separator-color', p.section_separator_color);
    setVar('--tg-card-border', p.section_separator_color);

    // @telegram-apps/telegram-ui UI Library Overrides
    setVar('--tgui--bg_color', p.bg_color);
    setVar('--tgui--secondary_bg_color', p.secondary_bg_color);
    setVar('--tgui--section_bg_color', p.section_bg_color);
    setVar('--tgui--header_bg_color', p.header_bg_color);
    setVar('--tgui--bottom_bar_bg_color', p.bottom_bar_bg_color);
    setVar('--tgui--text_color', p.text_color);
    setVar('--tgui--hint_color', p.hint_color);
    setVar('--tgui--link_color', p.link_color);
    setVar('--tgui--button_color', p.button_color);
    setVar('--tgui--button_text_color', p.button_text_color);
    setVar('--tgui--subtitle_text_color', p.subtitle_text_color);
    setVar('--tgui--destructive_text_color', p.destructive_text_color);
    setVar('--tgui--separator_color', p.section_separator_color);

    // Synchronize with Telegram SDK methods
    const tg = getTelegramWebApp();
    if (tg) {
      try {
        if (typeof tg.setHeaderColor === 'function') {
          tg.setHeaderColor(p.header_bg_color || (isDark ? 'secondary_bg_color' : 'bg_color'));
        }
        if (typeof tg.setBackgroundColor === 'function') {
          tg.setBackgroundColor(p.bg_color || 'bg_color');
        }
        if (typeof tg.setBottomBarColor === 'function') {
          tg.setBottomBarColor(p.bottom_bar_bg_color || 'bottom_bar_bg_color');
        }
      } catch (err) {
        console.warn('Failed to call Telegram WebApp color methods:', err);
      }
    }
  }, [activeColorScheme, isDark, tgThemeParams]);

  useEffect(() => {
    applyThemeToDOM();
  }, [applyThemeToDOM]);

  // Listen to live Telegram themeChanged event and system preference
  useEffect(() => {
    const tg = getTelegramWebApp();
    const handleTgThemeChange = () => {
      const scheme = getSystemColorScheme();
      setSystemScheme(scheme);
    };

    if (tg && typeof tg.onEvent === 'function') {
      tg.onEvent('themeChanged', handleTgThemeChange);
    }

    const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const handleMqlChange = (e: MediaQueryListEvent) => {
      setSystemScheme(e.matches ? 'dark' : 'light');
    };

    if (mql) {
      mql.addEventListener('change', handleMqlChange);
    }

    return () => {
      if (tg && typeof tg.offEvent === 'function') {
        tg.offEvent('themeChanged', handleTgThemeChange);
      }
      if (mql) {
        mql.removeEventListener('change', handleMqlChange);
      }
    };
  }, []);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('telegram_theme_preference', newTheme);
      localStorage.setItem('app_theme', newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme: activeColorScheme,
        isDark,
        isOnyx: isDark,
        platform,
        themeParams: tgThemeParams,
        setTheme,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
