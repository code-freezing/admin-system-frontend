/**
 * 模块说明：
 * 1. 按钮级权限指令。
 * 2. 用于在模板中按权限码控制元素显隐。
 * 3. 当前实现以 display:none 为主，足够覆盖后台按钮权限场景。
 */

import type { App, DirectiveBinding } from 'vue'
import pinia from '@/stores'
import { usePermission } from '@/stores/permission'

const updateElementVisibility = (el: HTMLElement, binding: DirectiveBinding<string | string[]>) => {
  const permissionStore = usePermission(pinia)
  const rawValue = binding.value
  const codes = Array.isArray(rawValue) ? rawValue : [rawValue]
  const visible = permissionStore.hasAnyPermission(codes.filter(Boolean) as string[])

  el.style.display = visible ? '' : 'none'
}

export const registerPermissionDirective = (app: App) => {
  app.directive('permission', {
    mounted(el, binding) {
      updateElementVisibility(el as HTMLElement, binding)
    },
    updated(el, binding) {
      updateElementVisibility(el as HTMLElement, binding)
    },
  })
}
