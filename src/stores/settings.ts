import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
    const showUserId = ref(false);
    const onlyAuthor = ref(false);
    const noImage = ref(false);
    const theme = ref<'auto' | 'light' | 'dark'>('auto');
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
                applyTheme(value);
                break;
        }
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

    function applyTheme(themeValue: string) {
        const root = document.documentElement;
        if (themeValue === 'dark') {
            root.classList.add('dark');
        } else if (themeValue === 'light') {
            root.classList.remove('dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }

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

    applyTheme(theme.value);

    return {
        // 显示设置
        showUserId,
        onlyAuthor,
        noImage,
        theme,
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
    };
}, {
    persist: {
        storage: localStorage,
    },
});
