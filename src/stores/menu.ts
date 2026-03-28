/**
 * 模块说明：
 * 1. 动态菜单 store。
 * 2. 缓存后端返回的菜单结构，并负责把菜单转换成真正的前端路由。
 * 3. 这是“后端控制菜单、前端动态挂路由”方案的核心。
 */

import { defineStore } from 'pinia'
import router from '@/router'
import type { Component } from 'vue'
import { ref } from 'vue'
import type { MenuNode } from './permission'

type RouteLoader = (() => Promise<{ default: Component }>) | undefined

export const useMenu = defineStore(
  'menuInfo',
  () => {
    // menuData 负责保留后端返回的菜单原始结构。
    // addedRouteNames 只记录动态注入过的最终路由名，方便退出时回收。
    const menuData = ref<MenuNode[]>([])
    const addedRouteNames = ref<string[]>([])

    const loadComponent = (url: string): RouteLoader => {
      // Vite 会在构建时把这里匹配到的页面组件做成一个映射表。
      // 后端只要返回类似 "product/product_manage_list/index" 这样的路径，
      // 前端就能在运行时按字符串把它还原成真正的页面组件。
      const modules = import.meta.glob<{ default: Component }>('@/views/**/*.vue')
      return modules[`/src/views/${url}.vue`]
    }

    const clearRouter = () => {
      // 动态路由必须只移除自己注入过的部分，不能误删静态路由。
      // 因此这里不遍历整个 router，而是只处理 addedRouteNames 中记录过的名称。
      addedRouteNames.value.forEach((name) => {
        if (router.hasRoute(name)) {
          router.removeRoute(name)
        }
      })
      addedRouteNames.value = []
    }

    // 递归扫描菜单，把后端给出的组件路径映射成真正的前端路由组件。
    const compilerMenu = (arr: MenuNode[]) => {
      if (!Array.isArray(arr) || arr.length === 0) {
        return
      }

      arr.forEach((item) => {
        if (Array.isArray(item.children) && item.children.length > 0) {
          // 当前节点只是菜单分组时，不注册页面，继续向下处理真正的叶子节点。
          compilerMenu(item.children)
          return
        }

        if (router.hasRoute(item.name)) {
          // 刷新恢复、重复登录等场景都可能再次执行注入，先跳过已存在的路由。
          return
        }

        const component = loadComponent(item.component ?? '')
        if (!component) {
          // 后端返回了无效组件路径时，不让页面直接报错，而是跳过该项。
          // 这样至少不会影响整个后台壳子启动，排查时也更容易定位到菜单配置问题。
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
      // 每次以最新菜单覆盖旧菜单，避免用户角色变化后保留上一次的路由残留。
      clearRouter()
      menuData.value = Array.isArray(arr) ? arr : []
      compilerMenu(menuData.value)
    }

    // addRouter 主要用于页面刷新后，依据持久化的 menuData 重新注入动态路由。
    const addRouter = () => {
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
