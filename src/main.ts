import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import Vant from 'vant';
import VueI18n from './language'
import 'vant/lib/index.css';
import '@/assets/main.css'
import '@/assets/resetVant.less'

    createApp(App).use(router).use(Vant).use(store).use(VueI18n).mount('#app')
