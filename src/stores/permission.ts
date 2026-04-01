import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const usePermission = defineStore(
  'permission',
  () => {
    // 记录角色，方便后续逻辑统一读取和更新。
    const roles = ref([])
    // 记录权限编码，方便后续逻辑统一读取和更新。
    const permissionCodes = ref([])
    // 记录菜单树结构，方便后续逻辑统一读取和更新。
    const menuTree = ref([])

    // 基于现有状态派生权限编码，避免同一份结果在多个地方重复计算。
    const permissionCodeSet = computed(() => new Set(permissionCodes.value))

    // 更新访问控制资料，避免状态分散在多个位置维护。
    const setAccessProfile = (profile) => {
      roles.value = profile?.roles || []
      permissionCodes.value = profile?.permissionCodes || []
      menuTree.value = profile?.menus || []
    }

    // 处理权限，把当前模块的关键逻辑集中在这里。
    const hasPermission = (code) => {
      if (!code) {
        return false
      }

      return permissionCodeSet.value.has(code)
    }

    const hasAnyPermission = (codes = []) => codes.some((code) => hasPermission(code))

    // 重置当前状态，把当前流程恢复到干净初始状态。
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
