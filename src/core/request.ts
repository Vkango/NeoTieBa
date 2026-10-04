import { getActivePinia } from 'pinia';
import { useSettingsStore } from '@/stores/settings';
import { validateProxy } from '@/utils/settings-policy';
import { invoke } from '@tauri-apps/api/core';

export interface RequestSchema {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    cookie?: string;
    body?: string;
    proxyUrl?: string;
}

export interface ResponseSchema {
    status: number;
    text: string;
    headers: Record<string, string>;
}

export function resolveProxyUrl(proxyUrl?: string): string | undefined {
    if (proxyUrl !== undefined) return validateProxy(true, proxyUrl);
    if (!getActivePinia()) return undefined;
    const settings = useSettingsStore();
    return validateProxy(settings.useProxy, settings.proxyUrl);
}

export async function httpRequest(schema: RequestSchema): Promise<ResponseSchema> {
    return invoke<ResponseSchema>('http_request_command', {
        request: { ...schema, proxyUrl: resolveProxyUrl(schema.proxyUrl) },
    });
}

export class RequestError extends Error {
    constructor(message: string, public readonly status?: number) {
        super(message);
        this.name = 'RequestError';
    }
}

export async function httpJson<T = any>(schema: RequestSchema): Promise<T> {
    const response = await httpRequest(schema);
    const preview = response.text.slice(0, 200);
    if (response.status < 200 || response.status >= 300) {
        throw new RequestError(`HTTP ${response.status}: ${preview}`, response.status);
    }
    try {
        return JSON.parse(response.text) as T;
    } catch {
        throw new RequestError(`无效的 JSON 响应（HTTP ${response.status}）: ${preview}`, response.status);
    }
}

export async function fetchImage(url: string): Promise<string> {
    return invoke<string>('fetch_image_base64', { url, proxyUrl: resolveProxyUrl() });
}

export async function probeConnection(): Promise<number> {
    return invoke<number>('test_connection', { proxyUrl: resolveProxyUrl() });
}

export type RequestOptions = Pick<RequestSchema, 'headers' | 'cookie' | 'proxyUrl'>;
