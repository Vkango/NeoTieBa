import { write_file, read_file } from "./file-io"

export async function getUserList() {
    try {
        const data = await read_file(import.meta.env.PROD ? './users.json' : '../users.json');
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

const saveUserList = async (userList) => {
    if (!Array.isArray(userList)) {
        throw new Error('Invalid user list: expected an array');
    }

    await write_file(
        import.meta.env.PROD ? './users.json' : '../users.json',
        JSON.stringify(userList, null, 2)
    );
}



export async function add_user(user) {
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

export async function remove_user(user) {
    const userList = (await getUserList()).filter(item => item.userId !== user.userId);
    saveUserList(userList);
}

export async function get_current_user_cookies() {
    const user = await get_current_user();
    return `BDUSS=${user.bduss}; STOKEN=${user.stoken};`;
}

export async function get_current_user_bduss() {
    const user = await get_current_user();
    return user.bduss;
}

export async function get_current_user() {
    const userList = await getUserList();
    const currentUser = userList.find(item => item.current === true);

    if (!currentUser) {
        throw new Error('没有用户登录');
    }

    return currentUser;
}

export async function set_current_user(username) {
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