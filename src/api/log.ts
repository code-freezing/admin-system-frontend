import { post } from './request'

// 登录日志和操作日志共用同一套请求模式。
export const loginLog = (account: number, name: string, email: string) => {
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

export const searchLoginLogList = (account: number) => {
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
