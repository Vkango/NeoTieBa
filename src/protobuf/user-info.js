import { fetch_data_buffer } from "../request.js";
export async function user_info_protobuf(userId, page = 1) {
    let ProfileRequestModule = null;
    let ProfileResIdlModule = null;

    try {
        ProfileRequestModule = await import("../protos/profile/ProfileRequest.js?t=" + Date.now());
        ProfileResIdlModule = await import("../protos/profile/ProfileResIdl.js?t=" + Date.now());
        const CommonRequest = ProfileRequestModule.tieba.CommonRequest;
        const ProfileRequestData = ProfileRequestModule.tieba.profile.ProfileRequestData;
        const ProfileRequest = ProfileRequestModule.tieba.profile.ProfileRequest;
        const ProfileResIdl = ProfileResIdlModule.ProfileResIdl;
        const commonReq = CommonRequest.create({
            _clientType: 2,
            _clientVersion: "12.79.1.0",
        });

        const profileRequestData = ProfileRequestData.create({
            uid: userId,
            needPostCount: 1,
            page: page,
            common: commonReq,
        });

        const profileRequest = ProfileRequest.create({
            data: profileRequestData,
        });
        const encodedData = ProfileRequest.encode(profileRequest).finish();
        const responseBuffer = new Uint8Array(await fetch_data_buffer(
            'http://tiebac.baidu.com/c/u/user/profile?cmd=303012',
            encodedData
        ));
        const response = ProfileResIdl.decode(responseBuffer);
        return response.toJSON();
    } catch (error) {
        console.error("用户信息获取失败:", error);
        throw new Error("无法获取用户信息数据: " + error.message);
    } finally {
        ProfileRequestModule = null;
        ProfileResIdlModule = null;
    }
}