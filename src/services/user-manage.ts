import CryptoJS from 'crypto-js';
import { invoke } from '@tauri-apps/api/core';

const USER_FILE_NAME = 'data/user_rec.json';
const ENCRYPTION_KEY = 'neotieba-internal-secure-key-v1';   // TODO: 更安全的密钥管理方案

export interface User {
    userId: string;
    username: string;
    bduss: string;
    stoken: string;
    current: boolean;
    user_name?: string;
    avatar?: string;
}

// 简单的加密封装
function encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

// 简单的解密封装
function decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export async function getUserList(): Promise<User[]> {
    try {
        try {
            const content = await invoke<string>('read_file', { relativePath: USER_FILE_NAME });
            if (!content) return [];

            try {
                const decrypted = decrypt(content);
                if (!decrypted) {
                    const parsed = JSON.parse(content);
                    return Array.isArray(parsed) ? parsed : [];
                }
                const parsed = JSON.parse(decrypted);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                try {
                    const parsed = JSON.parse(content);
                    return Array.isArray(parsed) ? parsed : [];
                } catch (jsonErr) {
                    console.error('Failed to parse user list:', jsonErr);
                    return [];
                }
            }
        } catch (invokeError: any) {
            // 处理文件不存在的情况
            const errorMsg = String(invokeError);
            if (errorMsg.includes('cannot find') || errorMsg.includes('No such file') || errorMsg.includes('os error 3')) {
                console.log('User file does not exist yet, returning empty list.');
                return [];
            }
            // 其他错误重新抛出
            throw invokeError;
        }
    } catch (e: any) {
        console.error('Error reading user list:', e);
        return [];
    }
}

async function saveUserList(userList: User[]): Promise<void> {
    if (!Array.isArray(userList)) {
        throw new Error('Invalid user list: expected an array');
    }
    try {
        const jsonStr = JSON.stringify(userList, null, 2);
        const encrypted = encrypt(jsonStr);
        await invoke('write_file', { relativePath: USER_FILE_NAME, content: encrypted });
    } catch (e) {
        console.error('Failed to save user list:', e);
        throw e;
    }
}

export async function addUser(user: User): Promise<boolean> {
    user.current = false;
    let userList = await getUserList();
    userList = Array.isArray(userList) ? userList : [];

    if (userList.length === 0) {
        user.current = true;
    }

    const index = userList.findIndex(item => item.username === user.username);
    if (index !== -1) {
        user.current = userList[index].current;
        userList[index] = user;
        await saveUserList(userList);
        return true;
    } else {
        userList.push(user);
        await saveUserList(userList);
        return false;
    }
}

export async function removeUser(user: User): Promise<void> {
    const userList = (await getUserList()).filter(item => item.userId !== user.userId);
    await saveUserList(userList);
}

export async function getCurrentUserCookies(): Promise<string> {
    const user = await getCurrentUser();
    return `BDUSS=${user.bduss}; STOKEN=${user.stoken};`;
}

export async function getCurrentUserBduss(): Promise<string> {
    const user = await getCurrentUser();
    return user.bduss;
}

export async function getCurrentUser(): Promise<User> {
    const userList = await getUserList();
    const currentUser = userList.find(item => item.current === true);

    if (!currentUser) {
        throw new Error('没有用户登录');
    }

    return currentUser;
}

export async function setCurrentUser(username: string): Promise<void> {
    const userList = await getUserList();
    let found = false;

    userList.forEach(item => {
        if (item.username === username) {
            item.current = true;
            found = true;
        } else {
            item.current = false;
        }
    });

    if (!found) {
        throw new Error(`用户 ${username} 不存在`);
    }

    await saveUserList(userList);
}

export async function switchUser(user: User): Promise<void> {
    const userList = await getUserList();

    userList.forEach(item => {
        item.current = item.username === user.username;
    });

    await saveUserList(userList);
}
