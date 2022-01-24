import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue } from "bootstrap-vue";
import i18n from "./i18n";

Vue.use(BootstrapVue);

import "bootstrap-vue/dist/bootstrap-vue.css";
import router from "./router/router";
import store from "./store/index.js";
import filters from "./filters/filters";

filters.create(Vue);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
