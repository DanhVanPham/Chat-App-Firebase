import Vue from 'vue'
import App from './App.vue'
import 'es6-promise/auto'
import router from './router'
import VueRouter from 'vue-router'
import Toasted from 'vue-toasted';

Vue.use(Toasted)
Vue.config.productionTip = false
Vue.use(VueRouter)

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')