import { createApp } from "vue";
import App from "./App.vue";
import { errorService } from "./error-service";

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
    errorService.handleError(err, info);
    console.error(err);
};

app.mount("#app");