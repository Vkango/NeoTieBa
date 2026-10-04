export type ApiErrorKind = 'network' | 'business' | 'auth' | 'empty' | 'unknown';

export type ApiResult<T> =
    | { ok: true; data: T; hasMore?: boolean }
    | { ok: false; kind: ApiErrorKind; message: string; code?: string | number };

export interface PageState {
    loading: boolean;
    refreshing: boolean;
    error: string;
    has_more: boolean;
    page: number;
}

export interface StableUser {
    id: string;
    name: string;
    name_show: string;
    avatar: string;
    level?: number;
    ip_address?: string;
}

export interface StablePost {
    id: string;
    tid?: string;
    author_id: string;
    author?: StableUser;
    title?: string;
    content: unknown[];
    created_at: number;
    floor?: number;
    reply_num: number;
    agree_count: number;
}

export interface ThreadPage {
    tid: string;
    title: string;
    forum_name: string;
    forum_avatar: string;
    posts: StablePost[];
    users: StableUser[];
    has_more: boolean;
}

export interface BarPage {
    name: string;
    avatar: string;
    slogan: string;
    threads: StablePost[];
    pinned_threads: StablePost[];
    has_more: boolean;
}

export interface UserProfile {
    id: string;
    name: string;
    name_show: string;
    avatar: string;
    raw: unknown;
}

export interface UserPostPage {
    user_id: string;
    posts: StablePost[];
    has_more: boolean;
    raw: unknown;
}
