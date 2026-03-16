import { createApp } from 'vue'
import App from './App.vue'
// 导入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 导入路由
import router from './router'
// svg图标
import 'virtual:svg-icons-register'
// 导入pinia
import pinia from './stores'
// 引入全局样式
import '@/assets/css/common.scss'
// 引入全局前置守卫
import './guardian'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
