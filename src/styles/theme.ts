import { invoke } from '@tauri-apps/api/core';

export type ThemeMode = 'auto' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'neotieba-theme';

function isDarkMode(mode: ThemeMode): boolean {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyTheme(mode: ThemeMode): void {
    const dark = isDarkMode(mode);
    document.documentElement.classList.toggle('dark', dark);
    void invoke('set_window_dark_mode', { dark }).catch(() => {
    });
}

export function persistTheme(mode: ThemeMode): void {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
    }
}

function normalize(value: unknown): ThemeMode | null {
    if (value === 'light' || value === 'dark' || value === 'auto') {
        return value;
    }
    return null;
}

export function getStoredTheme(): ThemeMode {
    try {
        const direct = normalize(localStorage.getItem(THEME_STORAGE_KEY));
        if (direct) return direct;

        const raw = localStorage.getItem('settings');
        if (raw) {
            const parsed = JSON.parse(raw) as { theme?: unknown; settings?: { theme?: unknown } };
            const fromState = normalize(parsed?.theme ?? parsed?.settings?.theme);
            if (fromState) return fromState;
        }
    } catch {
    }
    return 'auto';
}

let mediaQuery: MediaQueryList | null = null;

export function onSystemThemeChange(handler: (isDark: boolean) => void): () => void {
    if (!mediaQuery) {
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    }
    const listener = (event: MediaQueryListEvent): void => handler(event.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery?.removeEventListener('change', listener);
}
