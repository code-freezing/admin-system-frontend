import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import 'virtual:svg-icons-register'
import pinia from './stores'
import { useMenu } from './stores/menu'
import '@/assets/css/common.scss'
import './router/guard'

const app = createApp(App)

// 先装载状态管理，后续 store 和页面都依赖它。
app.use(pinia)

// 刷新后如果本地还有 token，就把菜单路由重新注入回来。
const menuStore = useMenu(pinia)
if (localStorage.getItem('token')) {
  menuStore.addRouter()
}

app.use(router)
app.use(ElementPlus)
app.mount('#app')
