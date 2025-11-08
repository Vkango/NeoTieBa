// HTTP API 与 Protobuf API
import CryptoJS from "crypto-js";
import { fetch_data_with_headers_command, fetchData, fetchData_post, fetchData_with_cookie } from './request.js'
import { user_info_protobuf } from "./api/user-info.js";
import { user_post_protobuf } from "./api/user-post.js";
export class tieBaAPI {
    /**
     * 构造函数
     */
    constructor() {
        this.apiUrl = "http://c.tieba.baidu.com/c/f/frs/page"; // 贴吧API地址
    }

    /**
     * 计算签名
     * @param {string} originalData - 原始数据
     * @returns {string} - 添加签名后的数据
     */

    calcSign(originalData) {
        // URL解码
        let proceed = decodeURIComponent(originalData);
        // 替换所有的"&"，并追加后缀
        proceed = proceed.replace(/&/g, "") + "tiebaclient!!!";
        // 使用MD5算法计算哈希值
        const hash = CryptoJS.MD5(proceed).toString();
        // 将哈希值转为大写，并拼接到原始数据中
        return originalData + "&sign=" + hash.toUpperCase();
    }
    /**
     * 获取用户信息 - 基于Protobuf协议
     * @param {number} userId - 用户ID
     * @param {number} page - 页码，默认为1
     * @returns {Promise<Object>} 用户信息响应
     */
    async user_info(userId, page = 1) {
        return await user_info_protobuf(userId, page);
    }

    /**
     * 获取用户发帖信息 - 基于Protobuf协议
     * @param {number} userId - 用户ID
     * @param {number} page - 页码，默认为1
     * @returns {Promise<Object>} 用户发帖响应
     */
    async user_post(userId, page = 1) {
        return await user_post_protobuf(userId, page);
    }

    async searchBar(keyword) {
        // 构造请求数据
        const data = `word=${encodeURIComponent(keyword)}`;

        const responseData = await fetchData_post('https://tiebac.baidu.com/mo/q/search/forum', this.calcSign(data));
        const result = await JSON.parse(responseData); // 解析JSON数据
        return result;
    }


    async searchUser(keyword) {
        // 构造请求数据
        const data = `word=${encodeURIComponent(keyword)}`;

        const responseData = await fetchData_post('https://tiebac.baidu.com/mo/q/search/user', this.calcSign(data));
        const result = await JSON.parse(responseData); // 解析JSON数据
        return result;
    }

    async searchThread(keyword, pn, st, tt = 1, rn = 20, fname = "", ct = 1, is_use_zonghe = 1, cv = "99.9.101") {
        // 构造请求数据
        const data = `word=${encodeURIComponent(keyword)}&pn=${pn}&st=${st}&tt=${tt}&rn=${rn}&fname=${encodeURIComponent(fname)}&ct=${ct}&is_use_zonghe=${is_use_zonghe}&cv=${cv}`;

        const responseData = await fetchData_post('https://tiebac.baidu.com/mo/q/search/thread', this.calcSign(data));
        const result = await JSON.parse(responseData); // 解析JSON数据
        return result;
    }
    /**
     * 浏览贴吧
     * @param {string} barName - 贴吧名称
     * @param {number} page - 页码
     * @returns {Promise} - 返回JSON数据
     */
    async browseBar(barName, page = 1) {
        // 构造请求数据
        const data = `_client_type=2&_client_version=8.6.8.0&kw=${encodeURIComponent(barName)}&pn=${page}&q_type=2&rn=50&with_group=1`;
        const responseData = await fetchData('http://c.tieba.baidu.com/c/f/frs/page?' + this.calcSign(data));
        const result = await JSON.parse(responseData); // 解析JSON数据
        return result;
    }

    async getHomeRecommend(bduss = '', stoken = '') {
        const responseData = await fetch_data_with_headers_command('http://tieba.baidu.com/mg/o/getRecommPage?load_type=1&eqid=&refer=tieba.baidu.com&page_thread_count=10', { 'Cookie': 'BDUSS=' + bduss + '; STOKEN=' + stoken, 'Host': 'tieba.baidu.com', 'Accept-Encoding': 'gzip, deflate, br, zstd' });
        const result = await JSON.parse(responseData.text);
        return result;
    }

    /**
     * 获取吧详细信息（包含扩展信息）
     * @param {string} forumId - 吧ID
     * @param {string} bduss - 用户BDUSS（可选）
     * @param {string} stoken - 用户STOKEN（可选）
     * @returns {Promise<Object>} 吧详细信息
     */
    async getForumDetail(forumId, bduss = '', stoken = '') {
        const data = `BDUSS=${bduss}&_client_type=2&_client_version=12.68.1.0&forum_id=${forumId}&is_newfrs=1&stoken=${stoken}`;
        const responseData = await fetchData_post('http://c.tieba.baidu.com/c/f/forum/getforumdetail', this.calcSign(data));
        const result = await JSON.parse(responseData);
        return result;
    }

    /**
     * 获取吧规详情
     * @param {string} forumId - 吧ID
     * @param {string} bduss - 用户BDUSS（可选）
     * @param {string} stoken - 用户STOKEN（可选）
     * @returns {Promise<Object>} 吧规详情
     */
    async getForumRule(forumId, bduss = '', stoken = '') {
        const data = `BDUSS=${bduss}&_client_type=2&_client_version=12.68.1.0&forum_id=${forumId}&stoken=${stoken}`;
        const responseData = await fetchData_post('http://c.tieba.baidu.com/c/f/forum/forumRuleDetail', this.calcSign(data));
        const result = await JSON.parse(responseData);
        return result;
    }

    /**
     * 获取签到信息
     * @param {string} forumId - 吧ID
     * @param {string} bduss - 用户BDUSS
     * @param {string} stoken - 用户STOKEN
     * @returns {Promise<Object>} 签到信息
     */
    async getUserSign(forumId, bduss, stoken) {
        const data = `BDUSS=${bduss}&_client_type=2&_client_version=12.68.1.0&forum_ids=${forumId}&from=frs&stoken=${stoken}`;
        const responseData = await fetchData_post('http://c.tieba.baidu.com/c/f/forum/getUserSign', this.calcSign(data));
        const result = await JSON.parse(responseData);
        return result;
    }

    /**
     * 获取用户在本吧的详细信息
     * @param {string} forumId - 吧ID
     * @param {string} bduss - 用户BDUSS
     * @param {string} stoken - 用户STOKEN
     * @returns {Promise<Object>} 用户在本吧的信息
     */
    async getUserForumLevelInfo(forumId, bduss, stoken) {
        const params = `_client_type=2&_client_version=12.68.1.0&BDUSS=${bduss}&stoken=${stoken}&forum_id=${forumId}&subapp_type=hybrid`;
        const responseData = await fetch_data_with_headers_command('https://c.tieba.baidu.com/c/f/forum/getUserForumLevelInfo?' + this.calcSign(params), { 'Subapp-Type': 'hybrid' });

        const result = await JSON.parse(responseData.text);
        return result;
    }

    /**
     * 获取吧务信息
     * @param {string} forumId - 吧ID
     * @returns {Promise<Object>} 吧务信息
     */
    async getBawuInfo(forumId) {
        const data = `_client_version=12.68.1.0&forum_id=${forumId}`;
        const responseData = await fetchData('http://c.tieba.baidu.com/c/f/forum/getBawuInfo?' + this.calcSign(data));
        const result = await JSON.parse(responseData);
        return result;
    }
    async FollowBar(cookie, page = 1) {
        const url = `https://tieba.baidu.com/mg/o/getForumHome?st=0&pn=${page}&rn=20&eqid=&refer=`;
        const response = await fetchData_with_cookie(url, cookie);
        const result = await JSON.parse(response); // 解析JSON数据
        return result;
    }

    async viewThread(id, page = 1) {
        // 构造请求数据
        const data = `_client_version=7.2.2&kz=${id}&net_type=1&pn=${page}`;
        const responseData = await fetchData('http://c.tieba.baidu.com/c/f/pb/page?' + this.calcSign(data));
        const result = await JSON.parse(responseData); // 解析JSON数据
        return result;
    }

    async userProfile(uid) {
        // 构造请求数据
        const data = `uid=${uid}`;
        const responseData = await fetchData('http://c.tieba.baidu.com/c/u/user/profile?' + this.calcSign(data));
        const result = await JSON.parse(responseData); // 解析JSON数据
        return result;
    }

    async userCard(id) {
        // 构造请求数据
        const responseData = await fetchData('https://tieba.baidu.com/home/get/panel?id=' + id);
        const result = await JSON.parse(responseData); // 解析JSON数据
        return result;
    }

    async Favourite(BDUSS, offset = 0) {
        // 构造请求数据
        const data = `${BDUSS}&offset=${offset}&rn=20`;

        const responseData = await fetchData_post('https://c.tieba.baidu.com/c/f/post/threadstore', this.calcSign(data));
        const result = await JSON.parse(responseData); // 解析JSON数据
        return result;
    }

    async followbar_list(bduss, stoken) {
        // 构造请求数据
        const data = `BDUSS=${bduss}&stoken=${stoken}`;

        const responseData = await fetchData_post('https://c.tieba.baidu.com/c/f/forum/getforumlist', this.calcSign(data));
        const result = await JSON.parse(responseData); // 解析JSON数据
        return result;
    }
    async myProfile(cookie) {

        const url = `https://tieba.baidu.com/mg/o/profile?format=json&eqid=&refer=`;
        const response = await fetchData_with_cookie(url, cookie);
        const result = await JSON.parse(response); // 解析JSON数据
        return result;
    }

    async get_self_id(cookie) {
        const url = `https://tieba.baidu.com/mo/q/sync`;
        const response = await fetchData_with_cookie(url, cookie);
        const result = await JSON.parse(response).data.user_id; // 解析JSON数据
        return result;
    }
    async getPersonalized(page = 1, loadType = 1) {

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

        const responseData = await fetchData_post(
            'https://c.tieba.baidu.com/c/f/excellent/personalized',
            this.calcSign(data)
        );

        return JSON.parse(responseData);
    }

    async get_reply_me(cookie, pn = 1) {
        const data = `BDUSS=${cookie}&pn=${pn}`;
        const responseData = await fetchData_post('https://c.tieba.baidu.com/c/u/feed/replyme', this.calcSign(data));
        const result = await JSON.parse(responseData); // 解析JSON数据
        return result;
    }

    async get_at_me(cookie, pn = 1) {
        const data = `BDUSS=${cookie}&pn=${pn}`;
        const responseData = await fetchData_post('https://c.tieba.baidu.com/c/u/feed/atme', this.calcSign(data));
        const result = await JSON.parse(responseData); // 解析JSON数据
        return result;
    }

    async viewSubPost(tid, pid, page = 1) {
        // 构造请求数据
        const data = `kz=${tid}&pid=${pid}&pn=${page}`;
        const responseData = await fetchData('http://c.tieba.baidu.com/c/f/pb/floor?' + this.calcSign(data));
        const result = await JSON.parse(responseData); // 解析JSON数据
        return result;
    }
}
