import { operationLog } from '@/api/log'

const buildOperationContent = (
  module: string,
  operation_object: string,
  operation_status?: string,
) => {
  if (module.includes('管理员')) {
    return `对管理员“${operation_object}”进行了删除操作`
  }

  if (module.includes('产品')) {
    return `对产品“${operation_object}”进行了审核操作，审核结果为“${operation_status ?? ''}”`
  }

  return `对${module}“${operation_object}”进行了操作`
}

// 统一把页面里的操作行为转换成日志文案，避免每个页面自己拼字符串。
export const tracking = async (
  module: string,
  operation_person: string,
  operation_object: string,
  operation_level: string,
  operation_status?: string,
) => {
  const operation_content = buildOperationContent(module, operation_object, operation_status)
  await operationLog(operation_person, operation_content, operation_level)
}
