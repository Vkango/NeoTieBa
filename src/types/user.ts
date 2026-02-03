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
    nameShow: string;
    name: string;
    intro: string;
    tbAge: string;
    postNum: number;
    totalAgreeNum: number;
    sex: number;
    ipAddress: string;
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
