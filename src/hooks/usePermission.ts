/**
 * 模块说明：
 * 1. 权限组合式函数。
 * 2. 统一提供按钮、页面和脚本层使用的权限判断方法。
 * 3. 避免页面重复直接读取 store 细节。
 */

import { storeToRefs } from 'pinia'
import { usePermission as usePermissionStore } from '@/stores/permission'

export const usePermission = () => {
  const permissionStore = usePermissionStore()
  const { roles, permissionCodes, menuTree } = storeToRefs(permissionStore)

  return {
    roles,
    permissionCodes,
    menuTree,
    hasPermission: permissionStore.hasPermission,
    hasAnyPermission: permissionStore.hasAnyPermission,
  }
}
