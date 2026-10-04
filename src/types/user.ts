// 用户管理使用的User类型
export interface User {
    userId: string;
    username: string;
    bduss: string;
    stoken: string;
    current: boolean;
    user_name?: string;
    avatar?: string;
}

// 贴吧用户信息类型
export interface TiebaUser {
    user_name: string;
    portrait: string;
    name_show: string;
    name: string;
    intro: string;
    tb_age: string;
    post_num: number;
    total_agree_num: number;
    sex: number;
    ip_address: string;
}

export interface UserInfo {
    user: TiebaUser;
}

export interface ReplyItem {
    [key: string]: any;
}

export interface AtItem {
    [key: string]: any;
}
