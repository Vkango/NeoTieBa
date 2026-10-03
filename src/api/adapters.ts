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
        id: stringValue(raw?.id ?? raw?.uid ?? raw?.userId),
        name: stringValue(raw?.name ?? raw?.userName ?? raw?.user_name),
        displayName: stringValue(raw?.nameShow ?? raw?.name_show ?? raw?.displayName ?? raw?.name ?? raw?.userName),
        avatar: stringValue(raw?.portrait ?? raw?.avatar),
        level: raw?.levelId ?? raw?.level_id ? numberValue(raw.levelId ?? raw.level_id) : undefined,
        ipAddress: raw?.ipAddress ?? raw?.ip_address,
    };
}

export function normalizePost(raw: any, userMap = new Map<string, StableUser>()): StablePost {
    const authorId = stringValue(raw?.authorId ?? raw?.author_id ?? raw?.userId ?? raw?.uid);
    const agreeNum = numberValue(raw?.agree?.agreeNum ?? raw?.agree_num);
    const disagreeNum = numberValue(raw?.agree?.disagreeNum ?? raw?.disagree_num);

    return {
        id: stringValue(raw?.id ?? raw?.pid),
        tid: raw?.tid ? stringValue(raw.tid) : undefined,
        authorId,
        author: userMap.get(authorId),
        title: raw?.title ? stringValue(raw.title) : undefined,
        content: Array.isArray(raw?.content)
            ? raw.content
            : Array.isArray(raw?.rich_abstract)
                ? raw.rich_abstract
                : [],
        createdAt: numberValue(raw?.time ?? raw?.last_time_int),
        floor: raw?.floor ? numberValue(raw.floor) : undefined,
        replyCount: numberValue(raw?.subPostNumber ?? raw?.reply_num),
        agreeCount: agreeNum - disagreeNum,
    };
}

export function normalizeThreadPage(raw: any, tid: string | number): ThreadPage {
    const data = raw?.data ?? {};
    const usersRaw = data.userList ?? data.user_list ?? [];
    const postsRaw = data.postList ?? data.post_list ?? [];
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
        forumName: stringValue(data.forum?.name),
        forumAvatar: stringValue(data.forum?.avatar),
        posts,
        users,
        hasMore: Boolean(data.page?.hasMore ?? data.page?.has_more),
    };
}

export function normalizeUserProfile(raw: any, userId: string | number): UserProfile {
    const user = raw?.data?.user ?? raw?.user ?? {};
    return {
        id: stringValue(user?.id ?? user?.uid ?? userId),
        name: stringValue(user?.name ?? user?.userName ?? user?.user_name),
        displayName: stringValue(user?.nameShow ?? user?.name_show ?? user?.name ?? user?.userName),
        avatar: stringValue(user?.portrait ?? user?.avatar),
        raw,
    };
}

export function normalizeUserPostPage(raw: any, userId: string | number): UserPostPage {
    const list = raw?.data?.postList ?? raw?.data?.post_list ?? raw?.post_list ?? [];
    return {
        userId: stringValue(userId),
        posts: Array.isArray(list) ? list.map((post: any) => normalizePost(post)) : [],
        hasMore: Boolean(raw?.data?.page?.hasMore ?? raw?.data?.page?.has_more ?? raw?.has_more),
        raw,
    };
}
