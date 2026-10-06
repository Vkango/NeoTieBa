import type { ContentElement } from '@/types/common';

export interface ShareCardData {
    title: string;
    subtitle?: string;
    avatar?: string;
    meta?: string;
    inline?: boolean;
    barName?: string;
    barAvatar?: string;
    content?: string;
    contentElements?: ContentElement[];
    contentHtml?: string;
    stats?: { label: string; value: string | number }[];
    source?: { title?: string; author?: string; authorAvatar?: string; barName?: string; barAvatar?: string };
    qrUrl: string;
}

export type { ContentElement };
