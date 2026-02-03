import { defineStore } from 'pinia';
import { tieBaAPI } from '@/api/tieba-api';

export const useApiStore = defineStore('api', () => {
    let apiInstance: tieBaAPI | null = null;
    function getApi(): tieBaAPI {
        if (!apiInstance) {
            apiInstance = new tieBaAPI();
        }
        return apiInstance;
    }
    function resetApi(): void {
        apiInstance = null;
    }

    return {
        getApi,
        resetApi,
    };
});
