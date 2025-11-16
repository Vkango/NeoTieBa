import { createApp, reactive } from "vue";
import App from "./App.vue";
import { errorService } from "./error-service";
import { getCurrentWindow } from '@tauri-apps/api/window'
import { readText } from '@tauri-apps/plugin-clipboard-manager'
import pluginManager from './pluginmanager.js';
import { clipboardService } from "./clipboard-service.js";
const appWindow = getCurrentWindow()
appWindow.onFocusChanged(async ({ payload: focused }) => {
    if (focused) {
        const text = await readText()
        clipboardService.handle(text);
    }
})

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
    errorService.handleError(err, info);
    console.error(err);
};
const IsDrawerOpen = reactive({ state: false });
app.config.globalProperties.$IsDrawerOpen = IsDrawerOpen;
app.config.globalProperties.$pluginManager = pluginManager;
app.mount("#app");