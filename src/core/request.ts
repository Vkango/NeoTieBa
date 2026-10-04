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

export async function fetchImage(url: string): Promise<string> {
    return invoke<string>('fetch_image_base64', { url, proxyUrl: resolveProxyUrl() });
}

export async function probeConnection(): Promise<number> {
    return invoke<number>('test_connection', { proxyUrl: resolveProxyUrl() });
}

export type RequestOptions = Pick<RequestSchema, 'headers' | 'cookie' | 'proxyUrl'>;
