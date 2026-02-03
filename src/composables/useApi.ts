/**
 * API Composable
 * 提供统一的 API 访问方式
 */

import { useApiStore } from '@/stores';
import type { tieBaAPI } from '@/api/tieba-api';

/**
 * 获取 API 实例的 composable
 * @returns tieBaAPI 实例
 */
export function useApi(): tieBaAPI {
    const apiStore = useApiStore();
    return apiStore.getApi();
}
