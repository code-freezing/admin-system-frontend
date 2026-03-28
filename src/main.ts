/**
 * 模块说明：
 * 1. 前端启动入口。
 * 2. 负责创建 Vue 应用、安装 Pinia、路由和 Element Plus，并在刷新后恢复动态路由。
 * 3. 这里保持“只做初始化、不写业务”的职责边界。
 */

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import 'virtual:svg-icons-register'
import pinia from './stores'
import { useMenu } from './stores/menu'
import { usePermission } from './stores/permission'
import { useUserInfo } from './stores/userinfor'
import '@/assets/css/common.scss'
import './router/guard'
import { hasAuthSession } from './utils/auth'
import { authProfile } from './api/login'
import { registerPermissionDirective } from './directives/permission'

const app = createApp(App)

// 先安装 Pinia，后续路由恢复和页面里的 store 都依赖它。
app.use(pinia)

const bootstrapSession = async () => {
  const menuStore = useMenu(pinia)
  const permissionStore = usePermission(pinia)
  const userStore = useUserInfo(pinia)

  if (!hasAuthSession()) {
    return
  }

  if (permissionStore.menuTree.length === 0) {
    const profile = (await authProfile()) as any
    permissionStore.setAccessProfile(profile)
    userStore.applyProfile(profile?.user ?? {})
  }

  menuStore.setRouter(permissionStore.menuTree)
}

await bootstrapSession()

app.use(router)
app.use(ElementPlus)
registerPermissionDirective(app)
app.mount('#app')
