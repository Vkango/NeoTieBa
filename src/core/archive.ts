import { invoke } from '@tauri-apps/api/core';

export interface ThreadArchiveMeta {
    tid: string;
    title: string;
    forumId: number;
    forumName: string;
    forumAvatar: string;
    authorId: string;
    authorName: string;
    totalPage: number;
    savedPages: number[];
    savedPagesLz: number[];
    savedFloors: string[];
    onlyAuthor: boolean;
    hasSubposts: boolean;
    mediaCount: number;
    mediaBytes: number;
    createdAt: number;
    updatedAt: number;
}

export interface ArchiveSummary extends ThreadArchiveMeta {
    fileSize: number;
    pageCount: number;
    pageCountLz: number;
    floorCount: number;
}

export interface ThreadSaveOptions {
    onlyAuthor: boolean;
    saveImages: boolean;
    saveVideoAudio: boolean;
    saveSubposts: boolean;
    saveAvatars: boolean;
    pageRange?: string;
    maxMediaBytes?: number;
}

export interface ThreadSaveProgress {
    tid: string;
    phase: 'pages' | 'floors' | 'media' | 'done' | 'error' | 'cancelled';
    done: number;
    total: number;
    message: string;
}

// ---------------------------------------------------------------------------
// SHA-1 (synchronous, used for deterministic archive media member names that
// mirror the Rust worker's sha1_hex over the source URL).
// ---------------------------------------------------------------------------

export function sha1Hex(text: string): string {
    const bytes = new TextEncoder().encode(text);
    const ml = bytes.length;
    const total = (((ml + 8) >> 6) + 1) << 6;
    const words = new Uint32Array(total >> 2);
    for (let i = 0; i < ml; i++) {
        words[i >> 2] |= bytes[i] << (24 - ((i & 3) << 3));
    }
    words[ml >> 2] |= 0x80 << (24 - ((ml & 3) << 3));
    words[words.length - 1] = ml << 3;

    let h0 = 0x67452301;
    let h1 = 0xefcdab89;
    let h2 = 0x98badcfe;
    let h3 = 0x10325476;
    let h4 = 0xc3d2e1f0;
    const w = new Uint32Array(80);
    const rotl = (value: number, bits: number) => ((value << bits) | (value >>> (32 - bits))) >>> 0;

    for (let block = 0; block < words.length; block += 16) {
        for (let i = 0; i < 16; i++) w[i] = words[block + i];
        // SHA-1's message schedule rotates LEFT by 1 (matching Rust sha1 / node crypto).
        for (let i = 16; i < 80; i++) w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
        let a = h0;
        let b = h1;
        let c = h2;
        let d = h3;
        let e = h4;
        for (let i = 0; i < 80; i++) {
            let f: number;
            let k: number;
            if (i < 20) {
                f = (b & c) | (~b & d);
                k = 0x5a827999;
            } else if (i < 40) {
                f = b ^ c ^ d;
                k = 0x6ed9eba1;
            } else if (i < 60) {
                f = (b & c) | (b & d) | (c & d);
                k = 0x8f1bbcdc;
            } else {
                f = b ^ c ^ d;
                k = 0xca62c1d6;
            }
            const temp = (rotl(a, 5) + f + e + k + w[i]) >>> 0;
            e = d;
            d = c;
            c = rotl(b, 30);
            b = a;
            a = temp;
        }
        h0 = (h0 + a) >>> 0;
        h1 = (h1 + b) >>> 0;
        h2 = (h2 + c) >>> 0;
        h3 = (h3 + d) >>> 0;
        h4 = (h4 + e) >>> 0;
    }
    return [h0, h1, h2, h3, h4].map(value => value.toString(16).padStart(8, '0')).join('');
}

// WebView2 exposes custom schemes as http://{scheme}.localhost/ URLs; other
// platforms pass the scheme through untouched.
const IS_WINDOWS = typeof navigator !== 'undefined' && navigator.userAgent.includes('Windows');

export function archiveMediaUrl(tid: string | number, url: string): string {
    const hash = sha1Hex(url);
    return IS_WINDOWS
        ? `http://archive.localhost/${tid}/media/${hash}`
        : `archive://${tid}/media/${hash}`;
}

// ---------------------------------------------------------------------------
// Command wrappers
// ---------------------------------------------------------------------------

export function archiveReadMeta(tid: string | number): Promise<ArchiveSummary | null> {
    return invoke<ArchiveSummary | null>('archive_read_meta', { tid: String(tid) });
}

export function archiveReadPage(
    tid: string | number,
    page: number,
    onlyAuthor: boolean
): Promise<string> {
    return invoke<string>('archive_read_page', { tid: String(tid), page, onlyAuthor });
}

export function archiveList(): Promise<ArchiveSummary[]> {
    return invoke<ArchiveSummary[]>('archive_list');
}

export function archiveDelete(tid: string | number): Promise<void> {
    return invoke<void>('archive_delete', { tid: String(tid) });
}

export function threadSaveStart(
    tid: string | number,
    options: ThreadSaveOptions,
    bduss: string,
    stoken: string,
    proxyUrl?: string
): Promise<void> {
    return invoke<void>('thread_save_start', {
        tid: String(tid),
        options: { maxMediaBytes: 100 * 1024 * 1024, ...options },
        bduss: bduss || null,
        stoken: stoken || null,
        proxyUrl: proxyUrl || null,
    });
}

export function threadSaveCancel(tid: string | number): Promise<void> {
    return invoke<void>('thread_save_cancel', { tid: String(tid) });
}

export function threadSaveStatus(tid: string | number): Promise<boolean> {
    return invoke<boolean>('thread_save_status', { tid: String(tid) });
}

/// Offline counterpart of `tieBaAPI.viewSubPost`: reads an archived floor
/// response and reshapes it into the same contract the online call returns.
export async function archiveViewSubPost(
    tid: string | number,
    pid: string | number,
    page: number
): Promise<Record<string, any>> {
    const raw = JSON.parse(await invoke<string>('archive_read_floor', {
        tid: String(tid),
        pid: String(pid),
        pn: page,
    }));
    const data = raw?.data ?? raw;
    const subpostList: any[] = data.subpost_list ?? [];
    return {
        ...data,
        subpost_list: subpostList.map((item: any) => item?.author ? {
            ...item,
            author: {
                ...item.author,
                name_show: item.author.name_show ?? '',
            },
        } : item),
        subpost_num: data.subpost_num ?? subpostList.length,
    };
}
