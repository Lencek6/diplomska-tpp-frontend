import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import axios from 'axios';
import VueAxios from "vue-axios";
import VueNotification from "vue-notification";

// Notifications
Vue.use(VueNotification);

// State management
import store from "./vuex/store";

// Axios
Vue.use(VueAxios, axios);

// Import Bootstrap an BootstrapVue CSS files (order is important)
import './assets/_custom.scss';

import 'bootstrap-vue/dist/bootstrap-vue.css'


// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
