import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import "./assets/css/main.css";
import '@/config/datatable-config.js';


const appInstance = createApp(App);
appInstance.use(store);
appInstance.use(router);
appInstance.use(ArgonDashboard);
appInstance.mount("#app");
appInstance.use(VueSweetalert2, { confirmButtonColor: '#F5A85B', cancelButtonColor: '#a5a5a5' });
appInstance.component('v-select', vSelect);
