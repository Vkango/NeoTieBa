import { invoke } from "@tauri-apps/api/core";

export async function fetchData(url) {
    try {
        const data = await invoke('fetch_data_command', { url });
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function fetch_data_buffer(url, buffer) {
    try {
        const data = await invoke('fetch_data_buffer', { url, buffer, proxy_url: "http://127.0.0.1:8888", fileName: "file" });
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function fetchData_post(url, body) {
    try {
        const data = await invoke('fetch_data_post', { url, body });
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function fetchData_with_cookie(url, cookie) {
    try {
        const data = await invoke('fetch_data_with_cookie', { url, cookie });
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function fetch_data_with_headers_command(url, headers) {
    try {
        const data = await invoke('fetch_data_with_headers_command', { url, headersJson: JSON.stringify(headers) });
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}