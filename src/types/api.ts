import type { TiebaUser, ReplyItem, AtItem } from '@/types/user';

export interface ApiResponse<T = any> {
    error_code?: string;
    error_msg?: string;
    data?: T;
    [key: string]: any;
}

export interface UserInfoResponse {
    data: {
        user: TiebaUser;
    };
}

export interface ReplyListResponse {
    reply_list: ReplyItem[];
}

export interface AtListResponse {
    at_list: AtItem[];
}

export interface PostResponse {
    post_list: any[];
    has_more: boolean;
    page: {
        current_page: number;
        total_page: number;
    };
}

export interface ThreadInfo {
    id: string;
    title: string;
    author: TiebaUser;
    reply_num: number;
    [key: string]: any;
}

export interface ForumDetailResponse {
    error_code: string;
    forum_info?: {
        avatar_origin?: string;
        slogan?: string;
        content?: { text: string }[];
        [key: string]: any;
    };
    [key: string]: any;
}

export interface UserSignResponse {
    error_code: number | string;
    data?: {
        forum?: {
            sign_in_info: {
                user_info: {
                    is_sign_in: number;
                    cout_total_sign_num: string;
                    cont_sign_num: string;
                    [key: string]: any;
                };
                [key: string]: any;
            };
            [key: string]: any;
        }[];
    };
    [key: string]: any;
}

export interface UserForumLevelInfoResponse {
    error_code: number | string;
    data?: {
        user_forum_info: {
            is_follow: string;
            level_id: string;
            level_name?: string;
            cur_score: string;
            levelup_score: string;
            follow_days: string;
            thread_num: string;
            day_post_num: string;
            [key: string]: any;
        };
    };
    [key: string]: any;
}

export interface RuleContent {
    title: string;
    content?: string[];
    content_list?: { content: string[] }[];
}

export interface ForumRuleResponse {
    error_code: string;
    forum_rule_id?: string;
    title?: string;
    preface?: string;
    rules?: RuleContent[];
    default_rules?: RuleContent[];
    new_rules?: RuleContent[];
    [key: string]: any;
}

export interface BawuInfoMember {
    id: string | number;
    name: string;
    name_show?: string;
    portrait: string;
    level_id?: number;
    [key: string]: any;
}

export interface BawuInfoResponse {
    error_code: string;
    admin?: BawuInfoMember[];
    manager?: BawuInfoMember[];
    assist?: BawuInfoMember[];
    [key: string]: any;
}

