import { inject, type Component } from 'vue';

/**
 * 全局provide/inject类型安全封装
 * 避免在组件中直接使用inject导致undefined问题
 */

// Toast提示
export function useSendToast(): (title: string, duration?: number) => void {
    const sendToast = inject<(title: string, duration?: number) => void>('sendToast');

    return (title: string, duration = 3000): void => {
        if (sendToast) {
            sendToast(title, duration);
        } else {
            console.warn('[useSendToast] Toast service not available:', title);
        }
    };
}

// 通知系统
export function useSendNotification(): (
    title: string,
    source: string,
    component: Component,
    clickHandler: (() => void) | null,
    props?: Record<string, unknown>,
    duration?: number
) => Promise<void> {
    const sendNotification = inject<(
        title: string,
        source: string,
        component: Component,
        clickHandler: (() => void) | null,
        props?: Record<string, unknown>,
        duration?: number
    ) => Promise<void>>('sendNotification');

    return async (
        title: string,
        source: string,
        component: Component,
        clickHandler: (() => void) | null,
        props: Record<string, unknown> = {},
        duration = 5000
    ): Promise<void> => {
        if (sendNotification) {
            await sendNotification(title, source, component, clickHandler, props, duration);
        } else {
            console.warn('[useSendNotification] Notification service not available:', title);
        }
    };
}

// 图片查看器
export function useImageViewer(): (url: string) => void {
    const openImageViewer = inject<(url: string) => void>('openImageViewer');

    return (url: string): void => {
        if (openImageViewer) {
            openImageViewer(url);
        } else {
            console.warn('[useImageViewer] ImageViewer service not available');
        }
    };
}

// 删除Tab
export function useDeleteTab(): (key: string | number) => void {
    const deleteTab = inject<(key: string | number) => void>('deleteTab');

    return (key: string | number): void => {
        if (deleteTab) {
            deleteTab(key);
        } else {
            console.warn('[useDeleteTab] DeleteTab service not available');
        }
    };
}
