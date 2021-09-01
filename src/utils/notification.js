import Vue from 'vue';

export default {

    show(text, type, title){
        Vue.notify({
            group: 'main',
            title: title || '',
            text: text || '',
            type: type || 'danger',
            position: 'top-right'
        })
    }

}