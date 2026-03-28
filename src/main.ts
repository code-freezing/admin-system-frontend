/**
 * 模块说明：
 * 1. 前端启动入口。
 * 2. 负责创建 Vue 应用、安装 Pinia 和路由，并在刷新后恢复动态路由。
 * 3. 这里保持“只做初始化、不写业务”的职责边界。
 */

import { createApp } from 'vue'
import App from './App.vue'
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
const menuStore = useMenu(pinia)
const permissionStore = usePermission(pinia)
const userStore = useUserInfo(pinia)

// 先安装 Pinia，后续路由恢复和页面里的 store 都依赖它。
app.use(pinia)

// 刷新时优先用持久化菜单恢复动态路由，避免页面等待 authProfile 才能解析当前路由。
if (hasAuthSession() && permissionStore.menuTree.length > 0) {
  menuStore.setRouter(permissionStore.menuTree)
}

const bootstrapSession = async () => {
  if (!hasAuthSession()) {
    return
  }

  const currentPath = router.currentRoute.value.fullPath

  try {
    const profile = await authProfile()
    permissionStore.setAccessProfile(profile.data)
    userStore.applyProfile(profile.data.user ?? {})
    menuStore.setRouter(permissionStore.menuTree)

    const targetRoute = router.resolve(currentPath)
    if (!targetRoute.matched.length || targetRoute.name === '404') {
      await router.replace('/home')
      return
    }

    if (router.currentRoute.value.fullPath !== currentPath) {
      await router.replace(currentPath)
    }
  } catch {
    // 会话校验失败时交给 axios 拦截器统一做退出处理，这里不重复兜底。
  }
}

app.use(router)
registerPermissionDirective(app)
app.mount('#app')

void bootstrapSession()
