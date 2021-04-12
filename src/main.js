import Vue from 'vue'
import App from './App.vue'
import 'es6-promise/auto'
import router from './router'
import firebase from 'firebase'
import VueRouter from 'vue-router'

Vue.config.productionTip = false
Vue.use(VueRouter)
const firebaseConfig = {
    apiKey: "AIzaSyB5vvNFaspidg8vDjDwmry1DC6fnzDRGpY",
    authDomain: "app-chat-firebase-4ae04.firebaseapp.com",
    projectId: "app-chat-firebase-4ae04",
    storageBucket: "app-chat-firebase-4ae04.appspot.com",
    messagingSenderId: "1017539669956",
    appId: "1:1017539669956:web:bcc7c2f0d823e42bae3e91"
};
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(() => new Vue({
    router,
    render: h => h(App),
}).$mount('#app'))