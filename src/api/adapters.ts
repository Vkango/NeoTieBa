import type { StablePost, StableUser, ThreadPage, UserPostPage, UserProfile } from '@/types/client';

function stringValue(value: unknown, fallback = ''): string {
    if (value === null || value === undefined) {
        return fallback;
    }
    return String(value);
}

function numberValue(value: unknown, fallback = 0): number {
    const result = Number(value);
    return Number.isFinite(result) ? result : fallback;
}

export function normalizeUser(raw: any): StableUser {
    return {
        id: stringValue(raw?.id ?? raw?.uid ?? raw?.user_id),
        name: stringValue(raw?.name ?? raw?.userName ?? raw?.user_name),
        name_show: stringValue(raw?.name_show),
        avatar: stringValue(raw?.portrait ?? raw?.avatar),
        level: raw?.level_id ?? raw?.level_id ? numberValue(raw.level_id ?? raw.level_id) : undefined,
        ip_address: raw?.ip_address,
    };
}

export function normalizePost(raw: any, userMap = new Map<string, StableUser>()): StablePost {
    const author_id = stringValue(raw?.author_id);
    const agreeNum = numberValue(raw?.agree?.agree_num);
    const disagreeNum = numberValue(raw?.agree?.disagree_num ?? raw?.disagree_num);

    return {
        id: stringValue(raw?.id ?? raw?.pid ?? raw?.post_id),
        tid: raw?.tid !== undefined ? stringValue(raw.tid) : raw?.thread_id !== undefined ? stringValue(raw.thread_id) : undefined,
        author_id: author_id || stringValue(raw?.user_id),
        author: userMap.get(author_id),
        title: raw?.title ? stringValue(raw.title) : undefined,
        content: Array.isArray(raw?.content)
            ? raw.content
            : Array.isArray(raw?.rich_abstract)
                ? raw.rich_abstract
                : [],
        created_at: numberValue(raw?.time ?? raw?.last_time_int ?? raw?.create_time),
        floor: raw?.floor ? numberValue(raw.floor) : undefined,
        reply_num: numberValue(raw?.sub_post_number ?? raw?.reply_num),
        agree_count: agreeNum - disagreeNum,
    };
}

export function normalizeThreadPage(raw: any, tid: string | number): ThreadPage {
    const data = raw?.data ?? {};
    const usersRaw = data.user_list ?? [];
    const postsRaw = data.post_list ?? [];
    const users: StableUser[] = Array.isArray(usersRaw)
        ? usersRaw.map((user: any) => normalizeUser(user))
        : [];
    const userMap = new Map<string, StableUser>(users.map((user): [string, StableUser] => [user.id, user]));
    const posts = Array.isArray(postsRaw)
        ? postsRaw.map((post: any) => normalizePost(post, userMap))
        : [];

    return {
        tid: stringValue(tid),
        title: stringValue(data.thread?.title),
        forum_name: stringValue(data.forum?.name),
        forum_avatar: stringValue(data.forum?.avatar),
        posts,
        users,
        has_more: Boolean(data.page?.has_more),
    };
}

export function normalizeUserProfile(raw: any, user_id: string | number): UserProfile {
    const user = raw?.data?.user ?? raw?.user ?? {};
    return {
        id: stringValue(user?.id ?? user?.uid ?? user_id),
        name: stringValue(user?.name ?? user?.userName ?? user?.user_name),
        name_show: stringValue(user?.name_show),
        avatar: stringValue(user?.portrait ?? user?.avatar),
        raw,
    };
}

export function normalizeUserPostPage(raw: any, user_id: string | number): UserPostPage {
    const list = raw?.data?.post_list ?? raw?.post_list ?? [];
    return {
        user_id: stringValue(user_id),
        posts: Array.isArray(list) ? list.map((post: any) => normalizePost(post)) : [],
        has_more: Boolean(raw?.data?.page?.has_more ?? raw?.has_more),
        raw,
    };
}
