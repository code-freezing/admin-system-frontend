/**
 * 模块说明：
 * 1. 日志接口封装。
 * 2. 同时服务登录日志、操作日志页面，以及前端埋点工具 tracking。
 * 3. 把日志接口集中在这里，便于后续统一调整字段。
 */

import { post } from './request'

// 登录日志和操作日志共用同一套请求模式。
export const loginLog = (account: string, name: string, email: string) => {
  return post('/llog/loginLog', { account, name, email })
}

export const operationLog = (
  operation_person: string,
  operation_content: string,
  operation_level: string,
) => {
  return post('/olog/operationLog', { operation_person, operation_content, operation_level })
}

export const loginLogList = () => {
  return post('/llog/loginLogList')
}

export const operationLogList = () => {
  return post('/olog/operationLogList')
}

export const searchLoginLogList = (account: string) => {
  return post('/llog/searchLoginLogList', { account })
}

export const searchOperationLogList = (operation_person: string) => {
  return post('/olog/searchOperationLogList', { operation_person })
}

export const loginLogListLength = () => {
  return post('/llog/loginLogListLength')
}

export const operationLogListLength = () => {
  return post('/olog/operationLogListLength')
}

export const returnLoginListData = (pager: number) => {
  return post('/llog/returnLoginListData', { pager })
}

export const returnOperationListData = (pager: number) => {
  return post('/olog/returnOperationListData', { pager })
}

export const clearLoginLogList = () => {
  return post('/llog/clearLoginLogList')
}

export const clearOperationLogList = () => {
  return post('/olog/clearOperationLogList')
}
