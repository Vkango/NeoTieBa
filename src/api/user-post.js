import { load } from '../proto-loader.js';
import { fetch_data_buffer } from '../request.js';
export async function user_post_protobuf(userId, page = 1) {
    try {
        const { encode: requestEncode } = await load('UserPostReqIdl');
        const { decode: responseDecode } = await load('UserPostResIdl');
        const requestData = {
            data: {
                uid: userId,
                rn: 20,
                needContent: 1,
                pn: page,
                common: {
                    _clientType: 2,
                    _clientVersion: "8.9.8.5"
                }
            },
        };
        const buffer = requestEncode(requestData);
        const responseBuffer = new Uint8Array(
            await fetch_data_buffer('https://tiebac.baidu.com/c/u/feed/userpost?cmd=303002', buffer)
        );
        const response = responseDecode(responseBuffer);
        if (response.error && response.error.errorno) {
            throw new Error(`贴吧服务器错误: ${response.error.errorno} - ${response.error.errmsg}`);
        }
        return response.toJSON ? response.toJSON() : response;
    } catch (error) {
        console.error('Error in user_post_protobuf:', error);
        throw error;
    }
}