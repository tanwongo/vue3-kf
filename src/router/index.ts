import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from '@/views/home.vue'
import Vuex from '@/views/vuex.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: Home
    },
    {
        path: "/home",
        name: "home",
        component: Home
    }, {
        path: "/axios",
        name: "Axios",
        component:()=> import('@/views/axios.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router