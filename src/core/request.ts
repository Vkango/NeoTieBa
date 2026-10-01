import { invoke } from '@tauri-apps/api/core';

export interface RequestOptions {
    headers?: Record<string, string>;
    cookie?: string;
    proxyUrl?: string;
    fileName?: string;
}

export interface FetchWithHeadersResponse {
    text: string;
    headers?: Record<string, string>;
}

function normalizeProxyUrl(proxyUrl?: string): string | undefined {
    const value = proxyUrl?.trim();
    return value ? value : undefined;
}

function toErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}

export async function fetchText(url: string, options: RequestOptions = {}): Promise<string> {
    try {
        return await invoke<string>('fetch_data_command', {
            url,
            proxyUrl: normalizeProxyUrl(options.proxyUrl),
        });
    } catch (error) {
        throw new Error(`Request failed: ${toErrorMessage(error)}`);
    }
}

export async function postText(url: string, body: string, options: RequestOptions = {}): Promise<string> {
    try {
        return await invoke<string>('fetch_data_post', {
            url,
            body,
            headers: options.headers,
            cookie: options.cookie,
            proxyUrl: normalizeProxyUrl(options.proxyUrl),
        });
    } catch (error) {
        throw new Error(`Post request failed: ${toErrorMessage(error)}`);
    }
}

export async function fetchTextWithCookie(url: string, cookie: string, options: RequestOptions = {}): Promise<string> {
    try {
        return await invoke<string>('fetch_data_with_cookie', {
            url,
            cookie,
            proxyUrl: normalizeProxyUrl(options.proxyUrl),
        });
    } catch (error) {
        throw new Error(`Cookie request failed: ${toErrorMessage(error)}`);
    }
}

export async function fetchTextWithHeaders(
    url: string,
    headers: Record<string, string>,
    options: RequestOptions = {}
): Promise<FetchWithHeadersResponse> {
    try {
        return await invoke<FetchWithHeadersResponse>('fetch_data_with_headers_command', {
            url,
            headersJson: JSON.stringify(headers),
            proxyUrl: normalizeProxyUrl(options.proxyUrl),
        });
    } catch (error) {
        throw new Error(`Header request failed: ${toErrorMessage(error)}`);
    }
}

export async function postProtobuf(url: string, buffer: Uint8Array, options: RequestOptions = {}): Promise<string> {
    try {
        return await invoke<string>('fetch_data_buffer_base64', {
            url,
            buffer,
            proxyUrl: normalizeProxyUrl(options.proxyUrl),
            fileName: options.fileName ?? 'file',
        });
    } catch (error) {
        throw new Error(`Protobuf request failed: ${toErrorMessage(error)}`);
    }
}

export async function fetchData(url: string, options: RequestOptions = {}): Promise<string> {
    return fetchText(url, options);
}

export async function fetch_data_buffer(
    url: string,
    buffer: Uint8Array,
    options: RequestOptions = {}
): Promise<string> {
    return postProtobuf(url, buffer, options);
}

export async function fetchDataPost(url: string, body: string, options: RequestOptions = {}): Promise<string> {
    return postText(url, body, options);
}

export async function fetchData_with_cookie(
    url: string,
    cookie: string,
    options: RequestOptions = {}
): Promise<string> {
    return fetchTextWithCookie(url, cookie, options);
}

export async function fetch_data_with_headers_command(
    url: string,
    headers: Record<string, string>,
    options: RequestOptions = {}
): Promise<FetchWithHeadersResponse> {
    return fetchTextWithHeaders(url, headers, options);
}
