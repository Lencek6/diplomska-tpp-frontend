import vuex from 'vuex';
import Vue from 'vue';
Vue.use(vuex);

// Modules
import settings from './modules/settings';


export default new vuex.Store({
    modules: {
        settings: settings,

    }
});
