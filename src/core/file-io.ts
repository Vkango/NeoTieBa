import { readTextFile, writeTextFile, BaseDirectory, exists } from '@tauri-apps/plugin-fs';

export async function read_file(relativePath: string): Promise<string> {
    try {
        const fileName = relativePath.split(/[\\/]/).pop() || 'data.json';
        const baseDir = BaseDirectory.AppLocalData;
        const fileExists = await exists(fileName, { baseDir });
        if (!fileExists) {
            return '';
        }

        const data = await readTextFile(fileName, { baseDir });
        return data;
    } catch (error) {
        console.error('Error reading file:', error);
        return '';
    }
}

export async function write_file(relativePath: string, content: string): Promise<void> {
    try {
        const fileName = relativePath.split(/[\\/]/).pop() || 'data.json';
        const baseDir = BaseDirectory.AppLocalData;

        await writeTextFile(fileName, content, { baseDir });
    } catch (error) {
        console.error('Error writing file:', error);
        throw error;
    }
}
