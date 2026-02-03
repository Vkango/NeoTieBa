import { load } from '@/core/proto-loader';
import { fetch_data_buffer } from '@/core/request';

export async function user_info_protobuf(userId: string | number, page = 1): Promise<any> {
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
        const base64String = await fetch_data_buffer('http://tiebac.baidu.com/c/u/user/profile?cmd=303012', buffer);
        const responseBuffer = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));

        const response = responseDecode(responseBuffer);
        return response;
    } catch (error) {
        console.error('Error in user_info_protobuf:', error);
        throw error;
    }
}
