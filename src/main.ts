import { createApp } from 'vue'
import router from './router'
import '@/router/permission'
import '@/styles/index.scss'
import App from './App.vue'
import pinia from '@/stores/index'
import i18n from './i18n/index'

import ElementPlus from 'element-plus'
import vue3SeamlessScroll from 'vue3-seamless-scroll'
import 'element-plus/dist/index.css'
import 'swiper/css'

//rem适配
import 'amfe-flexible'
createApp(App)
    .use(ElementPlus)
    .use(vue3SeamlessScroll)
    .use(pinia)
    .use(router)
    .use(i18n)
    .mount('#app')
