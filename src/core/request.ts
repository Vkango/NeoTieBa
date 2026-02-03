import { invoke } from "@tauri-apps/api/core";

export async function fetchData(url: string): Promise<string> {
    try {
        const data = await invoke<string>('fetch_data_command', { url });
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function fetch_data_buffer(url: string, buffer: Uint8Array): Promise<string> {
    try {
        const data = await invoke<string>('fetch_data_buffer_base64', {
            url,
            buffer,
            proxy_url: "http://127.0.0.1:8888",
            fileName: "file"
        });
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function fetchDataPost(url: string, body: string): Promise<string> {
    try {
        const data = await invoke<string>('fetch_data_post', { url, body });
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function fetchData_with_cookie(url: string, cookie: string): Promise<string> {
    try {
        const data = await invoke<string>('fetch_data_with_cookie', { url, cookie });
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export interface FetchWithHeadersResponse {
    text: string;
    headers?: Record<string, string>;
}

export async function fetch_data_with_headers_command(
    url: string,
    headers: Record<string, string>
): Promise<FetchWithHeadersResponse> {
    try {
        const data = await invoke<FetchWithHeadersResponse>('fetch_data_with_headers_command', {
            url,
            headersJson: JSON.stringify(headers)
        });
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
