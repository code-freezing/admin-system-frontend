import { defineStore } from 'pinia'
import router from '@/router'
import { ref } from 'vue'

export const useMenu = defineStore(
  'menuInfo',
  () => {
    const menuData = ref<any[]>([])
    const addedRouteNames = ref<string[]>([])

    const loadComponent = (url: string) => {
      const modules = import.meta.glob('@/views/**/*.vue')
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

    const compilerMenu = (arr: any[]) => {
      if (!Array.isArray(arr) || arr.length === 0) {
        return
      }

      arr.forEach((item: any) => {
        if (item.children && item.children.length) {
          compilerMenu(item.children)
          return
        }

        if (router.hasRoute(item.name)) {
          return
        }

        const component = loadComponent(item.component)
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

    const setRouter = (arr: any[]) => {
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
