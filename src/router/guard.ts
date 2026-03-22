import router from './index'
import { hasAuthSession } from '@/utils/auth'

// 路由守卫只做登录态和页面标题控制，不把业务逻辑塞进来。
router.beforeEach((to, _from, next) => {
  const hasToken = hasAuthSession()
  const isLoginPage = to.name === 'login'

  if (!hasToken && !isLoginPage) {
    next({ name: 'login' })
    return
  }

  if (hasToken && isLoginPage) {
    next({ path: '/home' })
    return
  }

  const title = to.meta?.title
  if (typeof title === 'string' && title.trim() !== '') {
    document.title = title
  }

  next()
})
