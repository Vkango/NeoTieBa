import CryptoJS from 'crypto-js';

export interface FollowedForum {
    forum_id: string;
    forum_name: string;
    avatar: string;
    user_level: number;
    user_level_name: string;
    is_sign_in: boolean;
}

export function createFollowedForumsForm(bduss: string, stoken: string): string {
    if (!bduss.trim()) throw new Error('请先登录后再查看关注的吧');
    // getforumlist returns an empty list without the client metadata, even
    // when valid credentials and a successful error_code are present.
    const fields = {
        BDUSS: bduss,
        _client_type: '2',
        _client_version: '12.68.1.0',
        stoken,
    };
    const signInput = Object.entries(fields).map(([key, value]) => `${key}=${value}`).join('');
    const form = new URLSearchParams(fields);
    form.set('sign', CryptoJS.MD5(signInput + 'tiebaclient!!!').toString().toUpperCase());
    return form.toString();
}

export function normalizeFollowedForums(response: any): FollowedForum[] {
    for (const code of [response?.error_code, response?.error?.errno]) {
        if (code !== undefined && code !== null && String(code) !== '0') {
            throw new Error(String(response.error_msg || response.error?.usermsg
                || response.error?.errmsg || `获取关注的吧失败（${code}）`));
        }
    }
    if (!Array.isArray(response?.forum_info)) {
        throw new Error('接口未返回关注的吧列表，请重试');
    }
    return response.forum_info.map((forum: any) => ({
        forum_id: String(forum.forum_id ?? ''),
        forum_name: String(forum.forum_name ?? ''),
        avatar: String(forum.avatar ?? ''),
        user_level: Number(forum.user_level) || 0,
        user_level_name: String(forum.user_level_name ?? ''),
        is_sign_in: forum.is_sign_in === true || String(forum.is_sign_in) === '1',
    }));
}
