import { fetch_data_buffer } from "../request.js";
export async function user_post_protobuf(userId, page = 1) {
    let UserPostRequestModule = null;
    let UserPostResIdlModule = null;
    try {
        UserPostRequestModule = await import("../protos/userPost/UserPostRequest.js?t=" + Date.now());
        const CommonRequest = UserPostRequestModule.tieba.CommonRequest;
        const UserPostRequest = UserPostRequestModule.tieba.userPost.UserPostRequest;
        const UserPostRequestData = UserPostRequestModule.tieba.userPost.UserPostRequestData;
        const commonReq = CommonRequest.create({
            _clientType: 2,
            _clientVersion: "8.9.8.5",
        });
        const userPostRequestData = UserPostRequestData.create({
            uid: userId,
            rn: 20,
            needContent: 1,
            pn: page,
            common: commonReq,
        });
        const userPostRequest = UserPostRequest.create({
            data: userPostRequestData,
        });
        const encodedData = UserPostRequest.encode(userPostRequest).finish();
        const responseBuffer = new Uint8Array(await fetch_data_buffer(
            'https://tiebac.baidu.com/c/u/feed/userpost?cmd=303002',
            encodedData
        ));
        UserPostResIdlModule = await import("../protos/userPost/UserPostResponse.js?t=" + Date.now()); // 防止缓存
        const UserPostResponse = UserPostResIdlModule.tieba.userPost.UserPostResponse;
        const response = UserPostResponse.decode(responseBuffer);
        if (response.error && response.error.errorno) {
            throw new Error(`贴吧服务器错误: ${response.error.errorno} - ${response.error.errmsg}`);
        }
        return response.toJSON();
    } catch (error) {
        console.error("获取用户发帖失败:", error);
        throw new Error("获取用户发帖失败: " + error.message);
    } finally {
        UserPostRequestModule = null;
        UserPostResIdlModule = null;
    }
}