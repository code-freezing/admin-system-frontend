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
import { hasAuthSession } from './utils/auth'

const app = createApp(App)

// 先安装 Pinia，后续路由恢复和页面里的 store 都依赖它。
app.use(pinia)

// 刷新页面后，持久化的菜单数据还在，这里把动态路由重新挂回 router。
const menuStore = useMenu(pinia)
if (hasAuthSession()) {
  menuStore.addRouter()
}

app.use(router)
app.use(ElementPlus)
app.mount('#app')
