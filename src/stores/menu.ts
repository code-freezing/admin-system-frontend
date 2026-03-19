import { defineStore } from 'pinia'
import router from '@/router'
import type { Component } from 'vue'
import { ref } from 'vue'

interface MenuNode {
  name: string
  path: string
  component?: string
  meta?: Record<string, unknown>
  children?: MenuNode[]
}

type RouteLoader = (() => Promise<{ default: Component }>) | undefined

export const useMenu = defineStore(
  'menuInfo',
  () => {
    const menuData = ref<MenuNode[]>([])
    const addedRouteNames = ref<string[]>([])

    const loadComponent = (url: string): RouteLoader => {
      const modules = import.meta.glob<{ default: Component }>('@/views/**/*.vue')
      return modules[`/src/views/${url}.vue`]
    }

    const clearRouter = () => {
      addedRouteNames.value.forEach((name) => {
        if (router.hasRoute(name)) {
          router.removeRoute(name)
        }
      })
      addedRouteNames.value = []
    }

    const compilerMenu = (arr: MenuNode[]) => {
      if (!Array.isArray(arr) || arr.length === 0) {
        return
      }

      arr.forEach((item) => {
        if (Array.isArray(item.children) && item.children.length > 0) {
          compilerMenu(item.children)
          return
        }

        if (router.hasRoute(item.name)) {
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
      menuData.value = Array.isArray(arr) ? arr : []
      compilerMenu(menuData.value)
    }

    const addRouter = () => {
      compilerMenu(menuData.value)
    }

    return {
      addRouter,
      clearRouter,
      menuData,
      setRouter,
    }
  },
  {
    persist: true,
  },
)
