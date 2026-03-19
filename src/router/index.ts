import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

// 这里先只放登录、布局壳和兜底页，业务路由登录后由菜单动态注入。
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
