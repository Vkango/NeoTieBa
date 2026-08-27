import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { applyTheme as applyThemeMode, onSystemThemeChange, persistTheme } from '@/styles/theme';

function guessMime(path: string): string {
    const lower = path.toLowerCase();
    const dot = lower.lastIndexOf('.');
    if (dot === -1) return 'image/jpeg';
    const ext = lower.slice(dot);
    const map: Record<string, string> = {
        '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
        '.webp': 'image/webp', '.bmp': 'image/bmp', '.gif': 'image/gif', '.avif': 'image/avif',
    };
    return map[ext] || 'image/jpeg';
}

export type WallpaperEffect = 'image' | 'acrylic' | 'mica' | 'solid';
export const WALLPAPER_EFFECT_OPTIONS: Array<{ label: string; value: WallpaperEffect }> = [
    { label: '图片', value: 'image' },
    { label: 'Acrylic（亚克力）', value: 'acrylic' },
    { label: 'Mica', value: 'mica' },
    { label: '纯色', value: 'solid' },
];

export const useSettingsStore = defineStore('settings', () => {
    const showUserId = ref(false);
    const onlyAuthor = ref(false);
    const noImage = ref(false);
    const theme = ref<'auto' | 'light' | 'dark'>('auto');
    const wallpaperPath = ref<string>('');
    const wallpaperUrl = ref<string>('');
    const wallpaperAccent = ref(0);
    const wallpaperBlur = ref(0);
    const wallpaperEffect = ref<WallpaperEffect>('image');
    const wallpaperSolidColor = ref('#1e1f20');
    const useProxy = ref(false);
    const proxyUrl = ref('');
    const enableAutoSign = ref(false);
    const blockList = ref<string[]>([]);
    function updateDisplaySetting(key: string, value: any) {
        switch (key) {
            case 'show_user_id':
                showUserId.value = value;
                break;
            case 'only_author':
                onlyAuthor.value = value;
                break;
            case 'no_image':
                noImage.value = value;
                break;
            case 'theme':
                theme.value = value;
                break;
            case 'wallpaper_path':
                wallpaperPath.value = value;
                break;
            case 'wallpaper_accent':
                wallpaperAccent.value = Math.max(0, Math.min(100, Number(value) || 0));
                break;
            case 'wallpaper_blur':
                wallpaperBlur.value = Math.max(0, Math.min(200, Number(value) || 0));
                break;
            case 'wallpaper_effect':
                setWallpaperEffect(value as WallpaperEffect);
                break;
            case 'wallpaper_solid_color':
                wallpaperSolidColor.value = String(value);
                break;
        }
    }

    function applyWallpaperEffect(effect: WallpaperEffect): void {
        if (effect === 'solid' || effect === 'image') {
            return;
        }
        void invoke('set_wallpaper_effect', { effect }).catch((error) => {
            console.error('应用窗口特效失败:', error);
        });
    }

    function setWallpaperEffect(effect: WallpaperEffect): void {
        if (wallpaperEffect.value === effect) {
            return;
        }
        wallpaperEffect.value = effect;
        if (effect !== 'image' && wallpaperUrl.value) {
            removeWallpaper();
        }
        applyWallpaperEffect(effect);
    }

    async function loadWallpaperUrl(): Promise<void> {
        if (!wallpaperPath.value) {
            wallpaperUrl.value = '';
            return;
        }

        if (wallpaperUrl.value.startsWith('blob:')) {
            URL.revokeObjectURL(wallpaperUrl.value);
        }
        try {
            const bytes: number[] = await invoke('read_file_bytes', { path: wallpaperPath.value });
            const blob = new Blob([new Uint8Array(bytes)], { type: guessMime(wallpaperPath.value) });
            wallpaperUrl.value = URL.createObjectURL(blob);
        } catch (error) {
            console.error('读取壁纸文件失败:', error);
            wallpaperUrl.value = '';
        }
    }

    function initWallpaper(): void {
        void loadWallpaperUrl();
    }

    async function pickWallpaper(): Promise<string> {
        let selected: string | string[] | null = null;
        try {
            selected = await open({
                multiple: false,
                directory: false,
                title: '选择壁纸图片',
                filters: [
                    { name: '图片', extensions: ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif', 'avif'] },
                ],
            });
        } catch (error) {
            throw new Error(`打开壁纸选择对话框失败: ${error instanceof Error ? error.message : String(error)}`);
        }

        if (!selected || (Array.isArray(selected) && selected.length === 0)) {
            return '';
        }

        const filePath = Array.isArray(selected) ? selected[0] : selected;
        const fileName = filePath.split(/[\\/]/).pop() || 'wallpaper.jpg';
        const ext = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')) : '.jpg';
        const destination = `wallpaper_${Date.now()}${ext}`;

        try {
            const realPath: string = await invoke('copy_file_to_install_dir', { src: filePath, fileName: destination });
            wallpaperPath.value = realPath;
            setWallpaperEffect('image');
        } catch (error) {
            throw new Error(`复制壁纸文件失败: ${error instanceof Error ? error.message : String(error)}`);
        }

        await loadWallpaperUrl();
        return wallpaperPath.value;
    }

    function removeWallpaper(): void {
        wallpaperPath.value = '';
        if (wallpaperUrl.value.startsWith('blob:')) {
            URL.revokeObjectURL(wallpaperUrl.value);
        }
        wallpaperUrl.value = '';
        wallpaperAccent.value = 0;
    }

    function updateNetworkSetting(key: string, value: any) {
        switch (key) {
            case 'use_proxy':
                useProxy.value = value;
                break;
            case 'proxy_url':
                proxyUrl.value = value;
                break;
        }
    }

    let systemThemeUnsubscribe: (() => void) | null = null;

    function applyTheme(themeValue: string) {
        applyThemeMode(themeValue as 'auto' | 'light' | 'dark');
        persistTheme(themeValue as 'auto' | 'light' | 'dark');
        if (systemThemeUnsubscribe) {
            systemThemeUnsubscribe();
            systemThemeUnsubscribe = null;
        }
        if (themeValue === 'auto') {
            systemThemeUnsubscribe = onSystemThemeChange(() => {
                if (theme.value === 'auto') {
                    applyTheme('auto');
                }
            });
        }
    }

    watch(theme, (value) => {
        applyTheme(value);
    }, { flush: 'sync' });

    function addToBlockList(item: string) {
        if (!blockList.value.includes(item)) {
            blockList.value.push(item);
        }
    }

    function removeFromBlockList(item: string) {
        const index = blockList.value.indexOf(item);
        if (index > -1) {
            blockList.value.splice(index, 1);
        }
    }

    return {
        // 显示设置
        showUserId,
        onlyAuthor,
        noImage,
        theme,
        // 壁纸设置
        wallpaperPath,
        wallpaperUrl,
        wallpaperAccent,
        wallpaperBlur,
        wallpaperEffect,
        wallpaperSolidColor,
        // 网络设置
        useProxy,
        proxyUrl,
        // 插件设置
        enableAutoSign,
        blockList,
        // Actions
        updateDisplaySetting,
        updateNetworkSetting,
        addToBlockList,
        removeFromBlockList,
        applyTheme,
        applyWallpaperEffect,
        setWallpaperEffect,
        pickWallpaper,
        removeWallpaper,
        initWallpaper,
        loadWallpaperUrl,
    };
}, {
    persist: {
        storage: localStorage,

        pick: [
            'showUserId', 'onlyAuthor', 'noImage', 'theme',
            'wallpaperPath', 'wallpaperAccent', 'wallpaperBlur', 'wallpaperEffect', 'wallpaperSolidColor',
            'useProxy', 'proxyUrl', 'enableAutoSign', 'blockList',
        ],
    },
});
