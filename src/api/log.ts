/**
 * 模块说明：
 * 1. 日志接口封装。
 * 2. 同时服务登录日志、操作日志页面，以及前端埋点工具 tracking。
 * 3. 把日志接口集中在这里，便于后续统一调整字段。
 */

import { post } from './request'
import { toApiResult, toArray, toLengthData, type ApiResult } from '@/http/response'

export interface LogRow {
  id?: number
  account?: string
  name?: string
  email?: string
  login_time?: string
  operation_person?: string
  operation_content?: string
  operation_level?: string
  operation_time?: string
  [key: string]: unknown
}

// 登录日志和操作日志共用同一套请求模式。
export const loginLog = (account: string, name: string, email: string) => {
  return post<ApiResult<null>>('/llog/loginLog', { account, name, email }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const operationLog = (
  operation_person: string,
  operation_content: string,
  operation_level: string,
) => {
  return post<ApiResult<null>>('/olog/operationLog', {
    operation_person,
    operation_content,
    operation_level,
  }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const loginLogList = () => {
  return post<ApiResult<LogRow[]>>('/llog/loginLogList').then((raw) => {
    return toApiResult(raw, toArray<LogRow>(raw))
  })
}

export const operationLogList = () => {
  return post<ApiResult<LogRow[]>>('/olog/operationLogList').then((raw) => {
    return toApiResult(raw, toArray<LogRow>(raw))
  })
}

export const searchLoginLogList = (account: string) => {
  return post<ApiResult<LogRow[]>>('/llog/searchLoginLogList', { account }).then((raw) => {
    return toApiResult(raw, toArray<LogRow>(raw))
  })
}

export const searchOperationLogList = (operation_person: string) => {
  return post<ApiResult<LogRow[]>>('/olog/searchOperationLogList', { operation_person }).then((raw) => {
    return toApiResult(raw, toArray<LogRow>(raw))
  })
}

export const loginLogListLength = () => {
  return post<ApiResult<{ length: number }>>('/llog/loginLogListLength').then((raw) => {
    return toApiResult(raw, toLengthData(raw))
  })
}

export const operationLogListLength = () => {
  return post<ApiResult<{ length: number }>>('/olog/operationLogListLength').then((raw) => {
    return toApiResult(raw, toLengthData(raw))
  })
}

export const returnLoginListData = (pager: number) => {
  return post<ApiResult<LogRow[]>>('/llog/returnLoginListData', { pager }).then((raw) => {
    return toApiResult(raw, toArray<LogRow>(raw))
  })
}

export const returnOperationListData = (pager: number) => {
  return post<ApiResult<LogRow[]>>('/olog/returnOperationListData', { pager }).then((raw) => {
    return toApiResult(raw, toArray<LogRow>(raw))
  })
}

export const clearLoginLogList = () => {
  return post<ApiResult<null>>('/llog/clearLoginLogList').then((raw) => {
    return toApiResult(raw, null)
  })
}

export const clearOperationLogList = () => {
  return post<ApiResult<null>>('/olog/clearOperationLogList').then((raw) => {
    return toApiResult(raw, null)
  })
}
