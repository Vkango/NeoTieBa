import { invoke } from "@tauri-apps/api/core";
export async function read_file(relativePath) {
    try {
        const data = await invoke('read_file', { relativePath });
        return data;
    } catch (error) {
        return '';

    }
}

export async function write_file(relativePath, content) {
    try {
        const data = await invoke('write_file', { relativePath, content });
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}