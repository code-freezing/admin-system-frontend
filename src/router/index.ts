import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

// 这里只保留公共路由和主布局。
// 业务页路由在登录成功后由菜单数据动态注入到 menu 子路由下。
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    name: 'menu',
    path: '/menu',
    redirect: '/home',
    component: () => import('@/views/menu/index.vue'),
    children: [],
  },
  {
    name: '404',
    path: '/:catchAll(.*)',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
