import { createApp, reactive } from "vue";
import App from "./App.vue";
import { errorService } from "./error-service";

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
    errorService.handleError(err, info);
    console.error(err);
};
const IsDrawerOpen = reactive({ state: false });
app.config.globalProperties.$IsDrawerOpen = IsDrawerOpen;
app.mount("#app");