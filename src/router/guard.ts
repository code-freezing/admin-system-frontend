import router from './index'
import { hasAuthSession } from '@/utils/auth'
import pinia from '@/stores'
import { usePermission } from '@/stores/permission'
import { toStringData } from '@/http/response'

// 路由守卫只处理登录态、页面权限和标题，不在这里混入接口请求。
router.beforeEach((to, _from, next) => {
  const hasToken = hasAuthSession()
  const isLoginPage = to.name === 'login'
  const isForbiddenPage = to.name === '403'
  const permissionStore = usePermission(pinia)

  if (!hasToken && !isLoginPage) {
    next({ name: 'login' })
    return
  }

  if (hasToken && isLoginPage) {
    next({ path: '/home' })
    return
  }

  // 路由级权限只认 meta.permissionCode，具体权限集合来自 authProfile 恢复的 store。
  const permissionCode = toStringData(to.meta?.permissionCode)
  if (hasToken && !isForbiddenPage && permissionCode && !permissionStore.hasPermission(permissionCode)) {
    next({ name: '403' })
    return
  }

  const title = toStringData(to.meta?.title).trim()
  if (title) {
    document.title = title
  }

  next()
})
