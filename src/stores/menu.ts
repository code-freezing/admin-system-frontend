import { defineStore } from 'pinia'
import router from '@/router'
import { ref } from 'vue'

// 预加载 views 目录，动态路由会按组件路径直接取对应页面。
const viewModules = import.meta.glob('@/views/**/*.vue')

export const useMenu = defineStore(
  'menuInfo',
  () => {
    // 记录菜单数据，方便后续逻辑统一读取和更新。
    const menuData = ref([])
    // 记录路由，方便后续逻辑统一读取和更新。
    const addedRouteNames = ref([])

    // 加载组件，让后续逻辑直接复用准备好的数据。
    const loadComponent = (url) => viewModules[`/src/views/${url}.vue`]

    // 清理路由，防止旧状态残留到下一次流程。
    const clearRouter = () => {
      addedRouteNames.value.forEach((name) => {
        if (router.hasRoute(name)) {
          router.removeRoute(name)
        }
      })
      addedRouteNames.value = []
    }

    const compilerMenu = (arr = []) => {
      if (!arr.length) {
        return
      }

      arr.forEach((item) => {
        if (item.children?.length) {
          compilerMenu(item.children)
          return
        }

        if (router.hasRoute(item.name)) {
          return
        }

        const component = loadComponent(item.component || '')
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

    const setRouter = (arr = []) => {
      clearRouter()
      menuData.value = arr
      compilerMenu(menuData.value)
    }

    // 添加路由，把新结果并入当前状态。
    const addRouter = () => {
      compilerMenu(menuData.value)
    }

    // 重置当前状态，把当前流程恢复到干净初始状态。
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
