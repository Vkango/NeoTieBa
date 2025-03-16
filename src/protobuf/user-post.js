import { fetch_data_buffer } from "../request.js";

export async function user_post_protobuf(userId, page = 1) {
    try {
        const UserPostRequestModule = await import("../protos/userPost/UserPostRequest.js");
        const CommonRequest = UserPostRequestModule.tieba.CommonRequest;
        const UserPostRequest = UserPostRequestModule.tieba.userPost.UserPostRequest;
        const UserPostRequestData = UserPostRequestModule.tieba.userPost.UserPostRequestData;
        const commonReq = CommonRequest.create({
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
        const UserPostResIdlModule = await import("../protos/userPost/UserPostResponse.js");
        const UserPostResponse = UserPostResIdlModule.tieba.userPost.UserPostResponse;
        const response = UserPostResponse.decode(responseBuffer);
        return response.toJSON();
    } catch (error) {
        console.error("获取用户发帖失败:", error);
        throw new Error("获取用户发帖失败");
    }
}