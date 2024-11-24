import "primevue/resources/themes/aura-light-green/theme.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import { createApp } from "vue";
import App from "../App.vue";
import PrimeVue from "primevue/config";
import router from "../utils/router";

const app = createApp(App);

app.use(PrimeVue);
app.use(router);
app.mount("#app");
