import { callProtoEndpoint, createCommon, type ProtoCallOptions } from '@/core/proto-client';

export async function user_info_protobuf(
    userId: string | number,
    page = 1,
    options: ProtoCallOptions = {}
): Promise<any> {
    try {
        const requestData = {
            data: {
                uid: userId,
                needPostCount: 1,
                page: page,
                pn: page,
                common: createCommon('12.79.1.0', options)
            }
        };

        return await callProtoEndpoint('userProfile', requestData, options);
    } catch (error) {
        console.error('Error in user_info_protobuf:', error);
        throw error;
    }
}
