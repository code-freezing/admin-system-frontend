import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      name: 'menu',
      path: '/menu',
      component: () => import('@/views/menu/index.vue'),
      children: [
        {
          name: 'home',
          path: '/home',
          component: () => import('@/views/home/index.vue'),
        },
        {
          name: 'set',
          path: '/set',
          component: () => import('@/views/set/index.vue'),
        },
      ],
    },
  ],
})

export default router
