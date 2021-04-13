import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../views/Login.vue'
import SignupPage from '../views/Register.vue'
import ChatPage from '../views/Chat.vue'
import Users from '../views/User.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/signupPage',
        name: 'signupPage',
        component: SignupPage
    },
    {
        path: '/chatPage/:id',
        name: 'chatPage',
        component: ChatPage,
    },
    {
        path: '/users',
        name: 'users',
        component: Users,
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router