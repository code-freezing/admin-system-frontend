import { storeToRefs } from 'pinia'
import { usePermission as usePermissionStore } from '@/stores/permission'

// 提供权限，让调用方通过统一入口复用这段逻辑。
export const usePermission = () => {
  // 组合式函数只暴露权限层真正常用的读能力，页面不直接碰 store 内部细节。
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
