import { load } from '../proto-loader.js';
import { fetch_data_buffer } from '../request.js';
export async function user_info_protobuf(userId, page = 1) {
    try {
        const { encode: requestEncode } = await load('ProfileReqIdl');
        const { decode: responseDecode } = await load('ProfileResIdl');
        const requestData = {
            data: {
                uid: userId,
                needPostCount: 1,
                page: page,
                pn: page,
                common: {
                    _clientType: 2,
                    _clientVersion: "12.79.1.0"
                }
            }
        };

        const buffer = requestEncode(requestData);
        // 3. 发请求
        const responseBuffer = new Uint8Array(
            await fetch_data_buffer('http://tiebac.baidu.com/c/u/user/profile?cmd=303012', buffer)
        );
        // 4. 解包
        const response = responseDecode(responseBuffer);
        return response.toJSON ? response.toJSON() : response;
    } catch (error) {
        console.error('Error in user_info_protobuf:', error);
        throw error;
    }
}