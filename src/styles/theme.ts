import { invoke } from '@tauri-apps/api/core';

export type ThemeMode = 'auto' | 'light' | 'dark';
export type AccentMode = 'forum' | 'custom';
export function readableAccentHex(hex: string): string {
    const value = hex.replace('#', '').trim();
    if (!/^[0-9a-f]{6}$/i.test(value)) return '#3b82f6';
    let r = parseInt(value.slice(0, 2), 16), g = parseInt(value.slice(2, 4), 16), b = parseInt(value.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < 50) { const lift = value.toLowerCase() === '000000' ? 105 : 70; r = Math.min(255, r + lift); g = Math.min(255, g + lift); b = Math.min(255, b + lift); }
    return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}
export function applyAccentColor(hex: string): void {
    const value = readableAccentHex(hex).slice(1);
    const r = parseInt(value.slice(0, 2), 16), g = parseInt(value.slice(2, 4), 16), b = parseInt(value.slice(4, 6), 16);
    document.documentElement.style.setProperty('--primary-color', `${r}, ${g}, ${b}`);
}

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
