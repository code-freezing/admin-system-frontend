import router from './index'

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (!token && to.name !== 'login') {
    next({ name: 'login' })
    return
  }

  if (token && to.name === 'login') {
    next({ path: '/home' })
    return
  }

  if (typeof to.meta?.title === 'string' && to.meta.title.length > 0) {
    document.title = to.meta.title
  }

  next()
})
