import { load } from '@/core/proto-loader';
import { fetch_data_buffer } from '@/core/request';

export async function get_post_proto(
    tid: string | number,
    pn = 1,
    rn = 30,
    sort = 0,
    onlyThreadAuthor = false,
    withComments = false,
    bduss = '',
    commentRn = 10
): Promise<any> {
    try {
        const { encode: requestEncode } = await load('PbPageReqIdl');
        const { decode: responseDecode } = await load('PbPageResIdl');

        const requestData: any = {
            data: {
                kz: tid,
                pn: pn,
                rn: rn > 1 ? rn : 2,
                r: sort,
                lz: Number(onlyThreadAuthor),
                common: {
                    _clientType: 2,
                    _clientVersion: "12.79.1.0"
                }
            }
        };

        if (withComments) {
            requestData.data.common.BDUSS = bduss;
            requestData.data.with_floor = 1;
            requestData.data.floor_sort_type = 1;
            requestData.data.floor_rn = commentRn;
        }

        const buffer = requestEncode(requestData);
        const base64String = await fetch_data_buffer('http://tiebac.baidu.com/c/f/pb/page?cmd=302001', buffer);
        const responseBuffer = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));

        const response = responseDecode(responseBuffer);
        return response;
    } catch (error) {
        console.error('Error in get_post_proto:', error);
        throw error;
    }
}
