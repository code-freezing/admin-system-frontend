/**
 * 模块说明：
 * 1. 全局路由守卫。
 * 2. 集中处理登录拦截、登录页重定向和页面标题同步。
 * 3. 守卫只做导航级规则，不承载业务接口调用。
 */

import router from './index'
import { hasAuthSession } from '@/utils/auth'
import pinia from '@/stores'
import { usePermission } from '@/stores/permission'

// 路由守卫只处理登录态和标题，不把复杂业务逻辑塞进来。
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

  const permissionCode = typeof to.meta?.permissionCode === 'string' ? to.meta.permissionCode : ''
  if (hasToken && !isForbiddenPage && permissionCode && !permissionStore.hasPermission(permissionCode)) {
    next({ name: '403' })
    return
  }

  const title = to.meta?.title
  if (typeof title === 'string' && title.trim() !== '') {
    document.title = title
  }

  next()
})
