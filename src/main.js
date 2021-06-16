import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from "./store";

import {BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import UUID from "vue-uuid";

Vue.use(UUID);

Vue.use(BootstrapVue)

Vue.use(IconsPlugin)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
  router: router,
}).$mount('#app')
