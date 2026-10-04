import { getActivePinia } from 'pinia';
import { useSettingsStore } from '@/stores/settings';
import { validateProxy } from '@/utils/settings-policy';
import { invoke } from '@tauri-apps/api/core';

export interface RequestOptions {
    headers?: Record<string, string>;
    cookie?: string;
    proxyUrl?: string;
}

export interface FetchWithHeadersResponse {
    text: string;
    headers?: Record<string, string>;
}

export function resolveProxyUrl(proxyUrl?: string): string | undefined {
    if (proxyUrl !== undefined) return validateProxy(true, proxyUrl);
    if (!getActivePinia()) return undefined;
    const settings = useSettingsStore();
    return validateProxy(settings.useProxy, settings.proxyUrl);
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
            proxyUrl: resolveProxyUrl(options.proxyUrl),
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
            proxyUrl: resolveProxyUrl(options.proxyUrl),
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
            proxyUrl: resolveProxyUrl(options.proxyUrl),
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
            proxyUrl: resolveProxyUrl(options.proxyUrl),
        });
    } catch (error) {
        throw new Error(`Header request failed: ${toErrorMessage(error)}`);
    }
}

export async function fetchData(url: string, options: RequestOptions = {}): Promise<string> {
    return fetchText(url, options);
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

export async function fetchImage(url: string): Promise<string> {
 return invoke<string>('fetch_image_base64', { url, proxyUrl: resolveProxyUrl() });
}

export async function probeConnection(): Promise<number> { return invoke<number>('test_connection', { proxyUrl: resolveProxyUrl() }); }
