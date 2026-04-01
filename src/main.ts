import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'virtual:svg-icons-register'
import '@/assets/css/common.scss'
import 'element-plus/es/components/message/style/css'
import pinia from './stores'
import { useMenu } from './stores/menu'
import { usePermission } from './stores/permission'
import { useUserInfo } from './stores/userinfor'
import './router/guard'
import { hasAuthSession } from './utils/auth'
import { authProfile } from './api/login'
import { registerPermissionDirective } from './directives/permission'

// 创建 Vue 应用实例，后续插件、路由和指令都会挂到这里。
const app = createApp(App)

// 先安装 pinia，确保持久化 store 在首次创建时就拿到插件能力。
app.use(pinia)

const menuStore = useMenu(pinia)
const permissionStore = usePermission(pinia)
const userStore = useUserInfo(pinia)

// 恢复路由，保证刷新或重进页面后还能接上原来的流程。
const restorePersistedRoutes = () => {
  // 刷新会清空内存中的动态路由，这里先用本地菜单恢复一次首屏匹配能力。
  if (!hasAuthSession() || !permissionStore.menuTree.length) {
    return
  }

  menuStore.setRouter(permissionStore.menuTree)
}

// 同步会话资料，避免本地状态和服务端结果出现偏差。
const syncSessionProfile = async () => {
  // 启动后再用服务端最新权限覆盖本地缓存，避免角色变更后沿用旧菜单。
  const profile = await authProfile()
  permissionStore.setAccessProfile(profile.data)
  userStore.applyProfile(profile.data.user)
  menuStore.setRouter(permissionStore.menuTree)
}

// 恢复当前状态路由，保证刷新或重进页面后还能接上原来的流程。
const restoreCurrentRoute = async () => {
  // 等待首轮路由解析完成后再读当前地址，避免启动中间态把页面误判成首页。
  await router.isReady()
  const currentPath = router.currentRoute.value.fullPath

  const targetRoute = router.resolve(currentPath)
  if (!targetRoute.matched.length || targetRoute.name === '404') {
    await router.replace('/home')
    return
  }

  // 动态路由重建后强制重新匹配当前地址，避免 router-view 继续复用旧结果。
  await router.replace(currentPath)
}

// 初始化会话，让模块在启动时具备完整运行条件。
const bootstrapSession = async () => {
  if (!hasAuthSession()) {
    return
  }

  await syncSessionProfile()
  await restoreCurrentRoute()
}

restorePersistedRoutes()

app.use(router)
registerPermissionDirective(app)
app.mount('#app')

void bootstrapSession()
