import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from '@/views/Home.vue'
import Vuex from '@/views/vuex.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: Home
    },
    {
        path: "/Home",
        name: "Home",
        component: Home
    }, {
        path: "/MyQuestion",
        name: "MyQuestion",
        component:()=> import('@/views/MyQuestion.vue')
    },{
        path: "/QuestionRequest/:id/:typeid",
        name: "QuestionRequest",
        props: true,
        component:()=> import('@/views/QuestionRequest.vue')
    },
    {
        path: "/SubmitQuestion/:id/:typeid/:isreply",
        name: "SubmitQuestion",
        props: true,
        component:()=> import('@/views/SubmitQuestion.vue')
    },
    {
        path: "/operationQuestionnaire",
        name: "operationQuestionnaire",
        component:()=> import('@/Questionnaire/operationQuestionnaire.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router