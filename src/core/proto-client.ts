import { getProtoEndpoint, type ProtoEndpointId } from '@/api/proto-endpoints';
import { load } from '@/core/proto-loader';
import { postProtobuf, type RequestOptions } from '@/core/request';

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
    const endpoint = getProtoEndpoint(endpointId);
    const started = performance.now();
    const [{ encode }, { decode }] = await Promise.all([
        load<TRequest>(endpoint.requestMessage),
        load<TResponse>(endpoint.responseMessage),
    ]);
    const loaded = performance.now();
    const requestBuffer = encode(requestData);
    const encoded = performance.now();
    const responseBase64 = await postProtobuf(endpoint.url, requestBuffer, {
        ...options,
        fileName: options.fileName ?? endpoint.fileName,
    });
    const received = performance.now();
    const responseBuffer = base64ToBytes(responseBase64);
    const converted = performance.now();
    const response = decode(responseBuffer);
    if (import.meta.env.DEV) {
        console.debug(`[protobuf] ${endpointId}`, {
            schemaMs: loaded - started,
            encodeMs: encoded - loaded,
            requestMs: received - encoded,
            base64Ms: converted - received,
            decodeAndObjectMs: performance.now() - converted,
            responseBytes: responseBuffer.length,
        });
    }
    return response;
}

function base64ToBytes(value: string): Uint8Array {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}
