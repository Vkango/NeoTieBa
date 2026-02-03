import CryptoJS from "crypto-js";
import {
    fetch_data_with_headers_command,
    fetchData,
    fetchDataPost,
    fetchData_with_cookie
} from '@/core/request';
import { user_info_protobuf } from "@/api/user-info";
import { user_post_protobuf } from "@/api/user-post";
import { get_post_proto } from "@/api/get-post";

export class tieBaAPI {
    constructor() {
        // API configuration could be added here if needed
    }

    async get_post(
        tid: string | number,
        pn = 1,
        rn = 30,
        sort = 0,
        onlyThreadAuthor = false,
        withComments = false,
        bduss = '',
        commentRn = 10
    ): Promise<any> {
        return await get_post_proto(tid, pn, rn, sort, onlyThreadAuthor, withComments, bduss, commentRn);
    }

    calcSign(originalData: string): string {
        let proceed = decodeURIComponent(originalData);
        proceed = proceed.replace(/&/g, "") + "tiebaclient!!!";
        const hash = CryptoJS.MD5(proceed).toString();
        return originalData + "&sign=" + hash.toUpperCase();
    }

    async user_info(userId: string | number, page = 1): Promise<any> {
        return await user_info_protobuf(userId, page);
    }

    async user_post(userId: string | number, page = 1): Promise<any> {
        return await user_post_protobuf(userId, page);
    }

    async getUserInfo(bduss: string, stoken: string): Promise<any> {
        try {
            const cookie = `BDUSS=${bduss}; STOKEN=${stoken};`;
            const responseData = await fetchData_with_cookie(
                'https://tieba.baidu.com/f/user/json_userinfo',
                cookie
            );
            return JSON.parse(responseData);
        } catch (error) {
            console.error('Error getting user info with cookie:', error);
            throw error;
        }
    }

    async searchThreadInBar(barName: string, keyword: string, pn: number): Promise<any> {
        const url = `http://tieba.baidu.com/mo/q/search/thread?st=5&tt=1&ct=2&cv=12.91.1.0&fname=${encodeURIComponent(barName)}&word=${encodeURIComponent(keyword)}&pn=${pn}&rn=20`;
        const responseData = await fetchData(url);
        return JSON.parse(responseData);
    }

    async searchPostInBar(barName: string, keyword: string, pn: number): Promise<any> {
        const url = `http://tieba.baidu.com/mo/q/search/thread?st=5&tt=3&ct=2&cv=12.91.1.0&fname=${encodeURIComponent(barName)}&word=${encodeURIComponent(keyword)}&pn=${pn}&rn=20`;
        const responseData = await fetchData(url);
        return JSON.parse(responseData);
    }

    async searchBar(keyword: string): Promise<any> {
        const data = `word=${encodeURIComponent(keyword)}`;
        const responseData = await fetchDataPost(
            'https://tiebac.baidu.com/mo/q/search/forum',
            this.calcSign(data)
        );
        return JSON.parse(responseData);
    }

    async searchUser(keyword: string): Promise<any> {
        const data = `word=${encodeURIComponent(keyword)}`;
        const responseData = await fetchDataPost(
            'https://tiebac.baidu.com/mo/q/search/user',
            this.calcSign(data)
        );
        return JSON.parse(responseData);
    }

    async searchThread(
        keyword: string,
        pn: string | number,
        st: string | number,
        tt: string | number = 1,
        rn: string | number = 20,
        fname = "",
        ct: string | number = 1,
        is_use_zonghe: string | number = 1,
        cv = "99.9.101"
    ): Promise<any> {
        const data = `word=${encodeURIComponent(keyword)}&pn=${pn}&st=${st}&tt=${tt}&rn=${rn}&fname=${encodeURIComponent(fname)}&ct=${ct}&is_use_zonghe=${is_use_zonghe}&cv=${cv}`;
        const responseData = await fetchDataPost(
            'https://tiebac.baidu.com/mo/q/search/thread',
            this.calcSign(data)
        );
        return JSON.parse(responseData);
    }

    async browseBar(barName: string, page = 1): Promise<any> {
        const data = `_client_type=2&_client_version=8.6.8.0&kw=${encodeURIComponent(barName)}&pn=${page}&q_type=2&rn=50&with_group=1`;
        const responseData = await fetchData('http://c.tieba.baidu.com/c/f/frs/page?' + this.calcSign(data));
        return JSON.parse(responseData);
    }

    async getHomeRecommend(bduss = '', stoken = ''): Promise<any> {
        const responseData = await fetch_data_with_headers_command(
            'http://tieba.baidu.com/mg/o/getRecommPage?load_type=1&eqid=&refer=tieba.baidu.com&page_thread_count=10',
            {
                'Cookie': `BDUSS=${bduss}; STOKEN=${stoken}`,
                'Host': 'tieba.baidu.com',
                'Accept-Encoding': 'gzip, deflate, br, zstd'
            }
        );
        return JSON.parse(responseData.text);
    }

    async getForumDetail(forumId: string, bduss = '', stoken = ''): Promise<any> {
        const data = `BDUSS=${bduss}&_client_type=2&_client_version=12.68.1.0&forum_id=${forumId}&is_newfrs=1&stoken=${stoken}`;
        const responseData = await fetchDataPost(
            'http://c.tieba.baidu.com/c/f/forum/getforumdetail',
            this.calcSign(data)
        );
        return JSON.parse(responseData);
    }

    async getForumRule(forumId: string, bduss = '', stoken = ''): Promise<any> {
        const data = `BDUSS=${bduss}&_client_type=2&_client_version=12.68.1.0&forum_id=${forumId}&stoken=${stoken}`;
        const responseData = await fetchDataPost(
            'http://c.tieba.baidu.com/c/f/forum/forumRuleDetail',
            this.calcSign(data)
        );
        return JSON.parse(responseData);
    }

    async getUserSign(forumId: string, bduss: string, stoken: string): Promise<any> {
        const data = `BDUSS=${bduss}&_client_type=2&_client_version=12.68.1.0&forum_ids=${forumId}&from=frs&stoken=${stoken}`;
        const responseData = await fetchDataPost(
            'http://c.tieba.baidu.com/c/f/forum/getUserSign',
            this.calcSign(data)
        );
        return JSON.parse(responseData);
    }

    async getUserForumLevelInfo(forumId: string, bduss: string, stoken: string): Promise<any> {
        const params = `_client_type=2&_client_version=12.68.1.0&BDUSS=${bduss}&stoken=${stoken}&forum_id=${forumId}&subapp_type=hybrid`;
        const responseData = await fetch_data_with_headers_command(
            'https://c.tieba.baidu.com/c/f/forum/getUserForumLevelInfo?' + this.calcSign(params),
            { 'Subapp-Type': 'hybrid' }
        );
        return JSON.parse(responseData.text);
    }

    async getBawuInfo(forumId: string): Promise<any> {
        const data = `_client_version=12.68.1.0&forum_id=${forumId}`;
        const responseData = await fetchData(
            'http://c.tieba.baidu.com/c/f/forum/getBawuInfo?' + this.calcSign(data)
        );
        return JSON.parse(responseData);
    }

    async FollowBar(cookie: string, page = 1): Promise<any> {
        const url = `https://tieba.baidu.com/mg/o/getForumHome?st=0&pn=${page}&rn=20&eqid=&refer=`;
        const response = await fetchData_with_cookie(url, cookie);
        return JSON.parse(response);
    }

    async viewThread(id: string | number, page = 1): Promise<any> {
        const data = `_client_version=7.2.2&kz=${id}&net_type=1&pn=${page}`;
        const responseData = await fetchData('http://c.tieba.baidu.com/c/f/pb/page?' + this.calcSign(data));
        return JSON.parse(responseData);
    }

    async userProfile(uid: string | number): Promise<any> {
        const data = `uid=${uid}`;
        const responseData = await fetchData('http://c.tieba.baidu.com/c/u/user/profile?' + this.calcSign(data));
        return JSON.parse(responseData);
    }

    async userCard(id: string | number): Promise<any> {
        const responseData = await fetchData('https://tieba.baidu.com/home/get/panel?id=' + id);
        return JSON.parse(responseData);
    }

    async Favourite(BDUSS: string, offset = 0): Promise<any> {
        const data = `${BDUSS}&offset=${offset}&rn=20`;
        const responseData = await fetchDataPost(
            'https://c.tieba.baidu.com/c/f/post/threadstore',
            this.calcSign(data)
        );
        return JSON.parse(responseData);
    }

    async followbar_list(bduss: string, stoken: string): Promise<any> {
        const data = `BDUSS=${bduss}&stoken=${stoken}`;
        const responseData = await fetchDataPost(
            'https://c.tieba.baidu.com/c/f/forum/getforumlist',
            this.calcSign(data)
        );
        return JSON.parse(responseData);
    }

    async myProfile(cookie: string): Promise<any> {
        const url = `https://tieba.baidu.com/mg/o/profile?format=json&eqid=&refer=`;
        const response = await fetchData_with_cookie(url, cookie);
        return JSON.parse(response);
    }

    async get_self_id(cookie: string): Promise<string> {
        const url = `https://tieba.baidu.com/mo/q/sync`;
        const response = await fetchData_with_cookie(url, cookie);
        return JSON.parse(response).data.user_id;
    }

    async getPersonalized(page = 1, loadType = 1): Promise<any> {
        const data = [
            `load_type=${loadType}`,
            `pn=${page}`,
            `_client_version=11.10.8.6`,
            'need_tags=0',
            'page_thread_count=15',
            'pre_ad_thread_count=0',
            'sug_count=0',
            'tag_code=0',
            'q_type=1',
            'need_forumlist=0',
            'new_net_type=1',
            'new_install=0',
            `request_time=${Date.now()}`,
            'invoke_source=',
            'scr_dip=2',
            'scr_h=1920',
            'scr_w=1080'
        ].join('&');

        const responseData = await fetchDataPost(
            'https://c.tieba.baidu.com/c/f/excellent/personalized',
            this.calcSign(data)
        );
        return JSON.parse(responseData);
    }

    async get_reply_me(cookie: string, pn = 1): Promise<any> {
        const data = `BDUSS=${cookie}&pn=${pn}`;
        const responseData = await fetchDataPost(
            'https://c.tieba.baidu.com/c/u/feed/replyme',
            this.calcSign(data)
        );
        return JSON.parse(responseData);
    }

    async get_at_me(cookie: string, pn = 1): Promise<any> {
        const data = `BDUSS=${cookie}&pn=${pn}`;
        const responseData = await fetchDataPost(
            'https://c.tieba.baidu.com/c/u/feed/atme',
            this.calcSign(data)
        );
        return JSON.parse(responseData);
    }

    async viewSubPost(tid: string | number, pid: string | number, page = 1): Promise<any> {
        const data = `kz=${tid}&pid=${pid}&pn=${page}`;
        const responseData = await fetchData('http://c.tieba.baidu.com/c/f/pb/floor?' + this.calcSign(data));
        return JSON.parse(responseData);
    }
}
