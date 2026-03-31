/**
 * 模块说明：
 * 1. 操作日志埋点工具。
 * 2. 把页面里的操作行为转换成统一的日志文案，再调用日志接口落库。
 * 3. 这样能避免每个页面手写重复的日志拼接逻辑。
 */

import { operationLog } from '@/api/log'

const buildOperationContent = (module: string, operation_object: string, operation_status?: string) => {
  if (module.includes('删除用户')) {
    return `删除了用户“${operation_object}”`
  }

  if (module.includes('管理员')) {
    return `对管理员“${operation_object}”进行了操作`
  }

  if (module.includes('产品')) {
    return `对产品“${operation_object}”进行了审核操作，审核结果为“${operation_status ?? ''}”`
  }

  return `对${module}“${operation_object}”进行了操作`
}

const normalizeOperationLevel = (value: string) => {
  const normalized = value.trim().toLowerCase()

  if (normalized === 'high' || normalized === 'error' || value === '高级' || value === '错误') {
    return '高级'
  }

  if (normalized === 'medium' || normalized === 'warn' || value === '中级' || value === '警告') {
    return '中级'
  }

  return '一般'
}

export const tracking = async (
  module: string,
  operation_person: string,
  operation_object: string,
  operation_level: string,
  operation_status?: string,
) => {
  // 页面层只传操作语义，这里统一收敛成最终日志文案并调用日志接口落库。
  const operation_content = buildOperationContent(module, operation_object, operation_status)
  await operationLog(operation_person, operation_content, normalizeOperationLevel(operation_level))
}
