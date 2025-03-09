import { invoke } from "@tauri-apps/api/core";
export async function read_file(relativePath) {
    try {
        const data = await invoke('read_file', { relativePath });
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}