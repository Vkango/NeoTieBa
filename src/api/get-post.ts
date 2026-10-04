import { callProtoEndpoint, createCommon, type ProtoCallOptions } from '@/core/proto-client';

export async function get_post_proto(
    tid: string | number,
    pn = 1,
    rn = 30,
    sort = 0,
    onlyThreadAuthor = false,
    withComments = false,
    bduss = '',
    commentRn = 10,
    options: ProtoCallOptions = {}
): Promise<any> {
    try {
        const requestData: any = {
            data: {
                kz: tid,
                pn,
                rn: rn > 1 ? rn : 2,
                r: sort,
                lz: Number(onlyThreadAuthor),
                common: createCommon('12.79.1.0', { ...options, bduss, stoken: options.stoken }),
            },
        };
        if (withComments) {
            requestData.data.common.BDUSS = bduss || options.bduss || '';
            requestData.data.with_floor = 1;
            requestData.data.floor_sort_type = 1;
            requestData.data.floor_rn = commentRn;
        }
        return await callProtoEndpoint('threadPage', requestData, options);
    } catch (error) {
        console.error('Error in get_post_proto:', error);
        throw error;
    }
}
