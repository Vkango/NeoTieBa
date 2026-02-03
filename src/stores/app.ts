import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
    // 标签页管理
    const tabs = ref<Array<{
        key: string;
        title: string;
        icon: string;
        component?: string;
        props?: Record<string, any>;
    }>>([]);

    const activeTabKey = ref<string>('');

    // 通知相关
    const notifications = ref<Array<{
        id: string;
        title: string;
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
        timestamp: number;
    }>>([]);

    // 图片查看器
    const imageViewerVisible = ref(false);
    const imageViewerUrl = ref('');

    // Actions
    function addTab(tab: typeof tabs.value[0]) {
        const existingTab = tabs.value.find(t => t.key === tab.key);
        if (!existingTab) {
            tabs.value.push(tab);
        }
        activeTabKey.value = tab.key;
    }

    function removeTab(key: string) {
        const index = tabs.value.findIndex(t => t.key === key);
        if (index > -1) {
            tabs.value.splice(index, 1);
            // 如果删除的是当前标签，切换到前一个标签
            if (activeTabKey.value === key && tabs.value.length > 0) {
                activeTabKey.value = tabs.value[Math.max(0, index - 1)].key;
            }
        }
    }

    function setActiveTab(key: string) {
        if (tabs.value.some(t => t.key === key)) {
            activeTabKey.value = key;
        }
    }

    function updateTabInfo(key: string, info: Partial<typeof tabs.value[0]>) {
        const tab = tabs.value.find(t => t.key === key);
        if (tab) {
            Object.assign(tab, info);
        }
    }

    function addNotification(notification: Omit<typeof notifications.value[0], 'id' | 'timestamp'>) {
        const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        notifications.value.push({
            ...notification,
            id,
            timestamp: Date.now(),
        });

        setTimeout(() => {
            removeNotification(id);
        }, 5000);

        return id;
    }

    function removeNotification(id: string) {
        const index = notifications.value.findIndex(n => n.id === id);
        if (index > -1) {
            notifications.value.splice(index, 1);
        }
    }

    function openImageViewer(url: string) {
        imageViewerUrl.value = url;
        imageViewerVisible.value = true;
    }

    function closeImageViewer() {
        imageViewerVisible.value = false;
        imageViewerUrl.value = '';
    }

    return {
        // 状态
        tabs,
        activeTabKey,
        notifications,
        imageViewerVisible,
        imageViewerUrl,
        // Actions
        addTab,
        removeTab,
        setActiveTab,
        updateTabInfo,
        addNotification,
        removeNotification,
        openImageViewer,
        closeImageViewer,
    };
}, {
    persist: {
        storage: sessionStorage,
    },
});
