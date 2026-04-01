import pinia from '@/stores'
import { usePermission } from '@/stores/permission'

// 更新当前状态，保持页面状态和实际数据一致。
const updateElementVisibility = (el, binding) => {
  const permissionStore = usePermission(pinia)
  const codes = (Array.isArray(binding.value) ? binding.value : [binding.value]).filter(Boolean)
  const visible = permissionStore.hasAnyPermission(codes)

  el.style.display = visible ? '' : 'none'
}

// 处理权限，把当前账号或能力注册到系统里。
export const registerPermissionDirective = (app) => {
  app.directive('permission', {
    // mounted 和 updated 都走同一套判断，保证权限数据刷新后模板显隐能及时同步。
    mounted(el, binding) {
      updateElementVisibility(el, binding)
    },
    updated(el, binding) {
      updateElementVisibility(el, binding)
    },
  })
}
