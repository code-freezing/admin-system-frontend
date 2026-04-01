import { createRouter, createWebHashHistory } from 'vue-router'

// 静态路由只保留公共页和后台壳子，业务页统一在登录后动态注入到 menu 下。
const routes = [
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
    name: '403',
    path: '/403',
    component: () => import('@/views/403/index.vue'),
    meta: {
      title: '403',
    },
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

// 创建前端路由实例，统一收口静态路由和动态路由配置。
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
