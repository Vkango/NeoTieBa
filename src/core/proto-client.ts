import type { ProtoEndpointId } from '@/api/proto-endpoints';
import type { RequestOptions } from '@/core/request';
import { invoke } from '@tauri-apps/api/core';

export interface ProtoCallOptions extends RequestOptions {
    bduss?: string;
    stoken?: string;
}

export function createCommon(clientVersion: string, options: ProtoCallOptions = {}): Record<string, unknown> {
    const common: Record<string, unknown> = {
        _clientType: 2,
        _clientVersion: clientVersion,
    };

    if (options.bduss) {
        common.BDUSS = options.bduss;
    }

    if (options.stoken) {
        common.stoken = options.stoken;
    }

    return common;
}

export async function callProtoEndpoint<TRequest extends object, TResponse>(
    endpointId: ProtoEndpointId,
    requestData: TRequest,
    options: ProtoCallOptions = {}
): Promise<TResponse> {
    return await invoke<TResponse>('protobuf_call', { endpoint: endpointId, request: requestData, proxyUrl: options.proxyUrl });
}
