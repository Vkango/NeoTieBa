import { load } from '../proto-loader.js';
import { fetch_data_buffer } from '../request.js';
export async function get_post_proto(tid, pn = 1, rn = 30, sort = 0, onlyThreadAuthor = false,
    withComments = false, bduss = '', commentRn = 10) {
    try {
        const { encode: requestEncode } = await load('PbPageReqIdl');
        const { decode: responseDecode } = await load('PbPageResIdl');
        const requestData = {
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
        const responseBuffer = new Uint8Array(
            await fetch_data_buffer('http://tiebac.baidu.com/c/f/pb/page?cmd=302001', buffer)
        );
        const response = responseDecode(responseBuffer);
        return response.toJSON ? response.toJSON() : response;
    } catch (error) {
        console.error('Error in get_post_proto:', error);
        throw error;
    }
}