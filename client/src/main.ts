import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios, { AxiosStatic } from "axios";
// import http from "./api/http-common";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { PluginOptions } from "vue-toastification/dist/types/src/types";

const options: PluginOptions = {
  draggable: false,
  position: POSITION.TOP_RIGHT,
  timeout: 2000,
};

Vue.use(Toast, options);

Vue.prototype.$axios = axios;

declare module "vue/types/vue" {
  interface Vue {
    $axios: AxiosStatic;
  }
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
