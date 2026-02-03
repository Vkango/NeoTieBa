import { createApp, reactive } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "@/App.vue";
import { errorService } from "@/core/error-service";
import { getCurrentWindow } from '@tauri-apps/api/window';
import { readText } from '@tauri-apps/plugin-clipboard-manager';
import pluginManager from '@/plugin/plugin-manager';
import { clipboardService } from "@/services/clipboard-service";
import "@/styles/global.css";

const appWindow = getCurrentWindow();
appWindow.onFocusChanged(async ({ payload: focused }) => {
    if (focused) {
        const text = await readText();
        if (text) {
            clipboardService.handle(text);
        }
    }
});

// 创建Pinia实例
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

// 使用Pinia
app.use(pinia);

app.config.errorHandler = (err, _instance, info) => {
    errorService.handleError(err, info as string);
    console.error(err);
};

const IsDrawerOpen = reactive({ state: false });
app.config.globalProperties.$IsDrawerOpen = IsDrawerOpen;
app.config.globalProperties.$pluginManager = pluginManager;
app.mount("#app");
