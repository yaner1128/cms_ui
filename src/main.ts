import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import './mock'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/assets/font/iconfont.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.config.globalProperties.$axios = axios
app.use(ElementPlus)
app.mount('#app')
