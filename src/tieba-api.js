import CryptoJS from "crypto-js";
class tieBaAPI {
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
     * 浏览贴吧
     * @param {string} barName - 贴吧名称
     * @param {number} page - 页码
     * @returns {Promise} - 返回JSON数据
     */
    async browseBar(barName, page = 1) {
        try {
            // 构造请求数据
            const data = `_client_type=2&_client_version=8.6.8.0&kw=${encodeURIComponent(barName)}&pn=${page}&q_type=2&rn=50&with_group=1`;
            const signedData = this.calcSign(data); // 添加签名
            const params = new URLSearchParams(signedData);

            // 发送POST请求
            const response = await fetch(this.apiUrl, {
                method: "POST",
                body: params,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json(); // 解析JSON数据
            return result;
        } catch (error) {
            console.error("请求失败:", error);
            throw new Error("无法获取贴吧数据，请检查网络或API链接的合法性");
        }
    }
}
export { tieBaAPI }; // 导出tieBaAPI类