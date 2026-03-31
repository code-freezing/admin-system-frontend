import { defineStore } from 'pinia'
import router from '@/router'
import type { Component } from 'vue'
import { ref } from 'vue'
import type { MenuNode } from './permission'

type RouteLoader = (() => Promise<{ default: Component }>) | undefined
const viewModules = import.meta.glob<{ default: Component }>('@/views/**/*.vue')

export const useMenu = defineStore(
  'menuInfo',
  () => {
    // menuData 保存后端返回的原始菜单，addedRouteNames 只记录本次注入过的动态路由。
    const menuData = ref<MenuNode[]>([])
    const addedRouteNames = ref<string[]>([])

    const loadComponent = (url: string): RouteLoader => {
      // 后端返回 views 下的相对路径后，这里把它映射成真正的页面组件。
      return viewModules[`/src/views/${url}.vue`]
    }

    const clearRouter = () => {
      // 这里只回收当前 store 注入过的动态路由，避免误删静态路由。
      addedRouteNames.value.forEach((name) => {
        if (router.hasRoute(name)) {
          router.removeRoute(name)
        }
      })
      addedRouteNames.value = []
    }

    // 递归扫描菜单，把后端给出的组件路径映射成真正的前端路由组件。
    const compilerMenu = (arr: MenuNode[]) => {
      if (arr.length === 0) {
        return
      }

      arr.forEach((item) => {
        if (item.children?.length) {
          // 有子节点的菜单只做分组容器，真正的页面路由继续向下递归。
          compilerMenu(item.children)
          return
        }

        if (router.hasRoute(item.name)) {
          // 刷新恢复和重复登录都会走到这里，已存在的路由不重复注入。
          return
        }

        const component = loadComponent(item.component ?? '')
        if (!component) {
          return
        }

        router.addRoute('menu', {
          name: item.name,
          path: item.path,
          meta: item.meta,
          component,
        })
        addedRouteNames.value.push(item.name)
      })
    }

    const setRouter = (arr: MenuNode[]) => {
      clearRouter()
      menuData.value = arr
      compilerMenu(menuData.value)
    }

    const addRouter = () => {
      // addRouter 只基于当前缓存菜单重建路由，不改动 menuData 本身。
      compilerMenu(menuData.value)
    }

    const reset = () => {
      clearRouter()
      menuData.value = []
    }

    return {
      addRouter,
      clearRouter,
      menuData,
      reset,
      setRouter,
    }
  },
  {
    persist: true,
  },
)
