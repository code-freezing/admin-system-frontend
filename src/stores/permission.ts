/**
 * 模块说明：
 * 1. 权限上下文 store。
 * 2. 负责保存当前会话的角色、权限码和后端返回的菜单树。
 * 3. 路由守卫、按钮指令和侧边栏都会依赖这里。
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface MenuNode {
  name: string
  path: string
  component?: string
  meta?: {
    title?: string
    icon?: string
    permissionCode?: string
    [key: string]: unknown
  }
  children?: MenuNode[]
}

interface AccessProfile {
  user?: Record<string, unknown>
  roles: string[]
  permissionCodes: string[]
  menus: MenuNode[]
}

export const usePermission = defineStore(
  'permission',
  () => {
    const roles = ref<string[]>([])
    const permissionCodes = ref<string[]>([])
    const menuTree = ref<MenuNode[]>([])

    // 权限判断统一走 Set，避免模板和脚本层频繁线性扫描 permissionCodes。
    const permissionCodeSet = computed(() => new Set(permissionCodes.value))

    const setAccessProfile = (profile?: AccessProfile | null) => {
      roles.value = profile?.roles ?? []
      permissionCodes.value = profile?.permissionCodes ?? []
      menuTree.value = profile?.menus ?? []
    }

    const hasPermission = (code?: string) => {
      if (!code) {
        return false
      }

      return permissionCodeSet.value.has(code)
    }

    const hasAnyPermission = (codes: string[]) => codes.some((code) => hasPermission(code))

    const reset = () => {
      roles.value = []
      permissionCodes.value = []
      menuTree.value = []
    }

    return {
      roles,
      permissionCodes,
      menuTree,
      setAccessProfile,
      hasPermission,
      hasAnyPermission,
      reset,
    }
  },
  {
    persist: true,
  },
)
