import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types/user';
import { getUserList, getCurrentUser, setCurrentUser } from '@/services/user-manage';
import { addUser as addUserService, removeUser as removeUserService } from '@/services/user-manage';
export const useUserStore = defineStore('user', () => {
    // 状态
    const users = ref<User[]>([]);
    const currentUser = ref<User | null>(null);
    const isLoading = ref(false);

    // 计算属性
    const isLoggedIn = computed(() => currentUser.value !== null);
    const userCount = computed(() => users.value.length);

    // Actions
    async function loadUsers() {
        isLoading.value = true;
        try {
            users.value = await getUserList();
            // 尝试获取当前用户
            try {
                currentUser.value = await getCurrentUser();
            } catch {
                currentUser.value = null;
            }
        } catch (error) {
            console.error('加载用户列表失败:', error);
            users.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    async function addUser(user: User): Promise<boolean> {
        try {
            const isUpdate = await addUserService(user);
            await loadUsers();
            return isUpdate;
        } catch (error) {
            console.error('添加用户失败:', error);
            throw error;
        }
    }

    async function removeUser(user: User): Promise<void> {
        try {
            await removeUserService(user);
            await loadUsers();
        } catch (error) {
            console.error('删除用户失败:', error);
            throw error;
        }
    }

    async function switchUser(username: string) {
        try {
            await setCurrentUser(username);
            await loadUsers();
        } catch (error) {
            console.error('切换用户失败:', error);
            throw error;
        }
    }

    return {
        // 状态
        users,
        currentUser,
        isLoading,
        // 计算属性
        isLoggedIn,
        userCount,
        // Actions
        loadUsers,
        addUser,
        removeUser,
        switchUser,
    };
}, {
    persist: {
        storage: localStorage,
    },
});
