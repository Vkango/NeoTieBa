import { invoke } from "@tauri-apps/api/core";

export async function fetchData(url) {
    try {
        const data = await invoke('fetch_data_command', { url });
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}