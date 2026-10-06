import { createApp } from 'vue';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';
import ShareCard from './ShareCard.vue';
import type { ShareCardData, ContentElement } from './types';
import { fetchImage } from '@/core/request';
import { normalizeMediaUrl } from '@/utils/settings-policy';
import { processContentElements } from '@/utils/helper';
import { useImageViewer, useSendToast } from '@/composables/useGlobalProvides';
import { useSettingsStore } from '@/stores/settings';
import { useOfflineMedia } from '@/composables/useOfflineMedia';

const PORTRAIT_BASE = 'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/';
const IMAGE_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzMzMiLz48L3N2Zz4=';

type MediaBlocks = { avatars: boolean; images: boolean; videos: boolean; audio: boolean };

export const shareAvatarUrl = (portrait?: string): string =>
    portrait ? PORTRAIT_BASE + portrait : '';

export const threadUrl = (tid: string | number, pid?: string | number): string =>
    `https://tieba.baidu.com/p/${tid}${pid ? `?pid=${pid}` : ''}`;

export const barUrl = (name: string): string =>
    `https://tieba.baidu.com/f?kw=${encodeURIComponent(name)}`;

export const userUrl = (id: string): string =>
    `https://tieba.baidu.com/home/main?id=${encodeURIComponent(id)}`;

export const stripHtml = (html?: string): string => (html || '').replace(/<[^>]*>/g, '').trim();

// 秒级时间戳 → 2026/10/6
export const formatCardDate = (seconds?: number | string): string => {
    const date = new Date(Number(seconds || 0) * 1000);
    if (!seconds || Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

// 图片转 data URL，规避 html-to-image 的跨域限制
async function toDataUrl(url?: string): Promise<string> {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    if (!/^https?:/i.test(url) || url.includes('archive.localhost')) return url;
    try {
        return await fetchImage(normalizeMediaUrl(url));
    } catch {
        return IMAGE_PLACEHOLDER;
    }
}

// 内容元素 → 卡片正文 HTML（复用 processContentElements，远程图片转 data URL）
async function contentToHtml(
    elements: ContentElement[] | undefined,
    blocked: MediaBlocks,
    resolveUrl: (url: string) => string
): Promise<string> {
    if (!elements || !elements.length) return '';
    const html = processContentElements(elements, false, blocked, resolveUrl);
    if (!html) return '';
    const host = document.createElement('div');
    host.innerHTML = html;
    host.querySelectorAll('button.at-button').forEach(node => node.replaceWith(document.createTextNode(node.textContent || '')));
    host.querySelectorAll('video, audio').forEach(node => node.remove());
    await Promise.all(Array.from(host.querySelectorAll('img')).map(async img => {
        img.removeAttribute('style');
        img.removeAttribute('data-full-src');
        img.removeAttribute('data-remote-src');
        const src = img.getAttribute('src') || '';
        if (!src || src.startsWith('data:') || !/^https?:/i.test(src) || src.includes('archive.localhost')) return;
        img.src = await toDataUrl(src);
    }));
    return host.innerHTML;
}

async function generateShareCard(
    data: ShareCardData,
    blocked: MediaBlocks,
    resolveUrl: (url: string) => string
): Promise<string> {
    const [qr, avatar, barAvatar, source, contentHtml] = await Promise.all([
        QRCode.toDataURL(data.qrUrl, {
            margin: 0,
            width: 288,
            errorCorrectionLevel: 'M',
            color: { dark: '#1a1a1a', light: '#ffffff' }
        }),
        toDataUrl(data.avatar),
        toDataUrl(data.barAvatar),
        (async () => {
            if (!data.source) return undefined;
            const [authorAvatar, barAvatar] = await Promise.all([
                toDataUrl(data.source.authorAvatar),
                toDataUrl(data.source.barAvatar)
            ]);
            return {
                ...data.source,
                authorAvatar: authorAvatar || undefined,
                barAvatar: barAvatar || undefined
            };
        })(),
        contentToHtml(data.contentElements, blocked, resolveUrl)
    ]);
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-9999px;top:0;';
    document.body.appendChild(host);
    const app = createApp(ShareCard, {
        data: {
            ...data,
            avatar: avatar || undefined,
            barAvatar: barAvatar || undefined,
            source,
            contentHtml: contentHtml || undefined
        },
        qr
    });
    try {
        app.mount(host);
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        const node = host.firstElementChild;
        if (!(node instanceof HTMLElement)) throw new Error('分享卡片渲染失败');
        return await toPng(node, { pixelRatio: 2, skipFonts: true, backgroundColor: '#ffffff', imagePlaceholder: IMAGE_PLACEHOLDER });
    } finally {
        app.unmount();
        host.remove();
    }
}

export function useShareCard(): (data: ShareCardData) => Promise<void> {
    const openImageViewer = useImageViewer();
    const sendToast = useSendToast();
    const settings = useSettingsStore();
    const offlineMedia = useOfflineMedia();
    return async (data: ShareCardData): Promise<void> => {
        try {
            const blocked: MediaBlocks = {
                avatars: settings.isMediaBlocked('avatars'),
                images: settings.isMediaBlocked('images'),
                videos: settings.isMediaBlocked('videos'),
                audio: settings.isMediaBlocked('audio')
            };
            openImageViewer(await generateShareCard(data, blocked, offlineMedia));
        } catch (error) {
            console.error('生成分享图片失败:', error);
            sendToast('生成分享图片失败', 2000);
        }
    };
}
