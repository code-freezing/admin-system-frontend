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

export const loginLog = (account: string, name: string, email: string) =>
  post<ApiResult<null>>('/llog/loginLog', { account, name, email }).then((raw) => toApiResult(raw, null))

export const operationLog = (operation_person: string, operation_content: string, operation_level: string) =>
  post<ApiResult<null>>('/olog/operationLog', {
    operation_person,
    operation_content,
    operation_level,
  }).then((raw) => toApiResult(raw, null))

export const loginLogList = () =>
  post<ApiResult<LogRow[]>>('/llog/loginLogList').then((raw) => toApiResult(raw, toArray<LogRow>(raw)))

export const operationLogList = () =>
  post<ApiResult<LogRow[]>>('/olog/operationLogList').then((raw) =>
    toApiResult(raw, toArray<LogRow>(raw)),
  )

export const searchLoginLogList = (account: string) =>
  post<ApiResult<LogRow[]>>('/llog/searchLoginLogList', { account }).then((raw) =>
    toApiResult(raw, toArray<LogRow>(raw)),
  )

export const searchOperationLogList = (operation_person: string) =>
  post<ApiResult<LogRow[]>>('/olog/searchOperationLogList', { operation_person }).then((raw) =>
    toApiResult(raw, toArray<LogRow>(raw)),
  )

export const loginLogListLength = () =>
  post<ApiResult<{ length: number }>>('/llog/loginLogListLength').then((raw) =>
    toApiResult(raw, toLengthData(raw)),
  )

export const operationLogListLength = () =>
  post<ApiResult<{ length: number }>>('/olog/operationLogListLength').then((raw) =>
    toApiResult(raw, toLengthData(raw)),
  )

export const returnLoginListData = (pager: number) =>
  post<ApiResult<LogRow[]>>('/llog/returnLoginListData', { pager }).then((raw) =>
    toApiResult(raw, toArray<LogRow>(raw)),
  )

export const returnOperationListData = (pager: number) =>
  post<ApiResult<LogRow[]>>('/olog/returnOperationListData', { pager }).then((raw) =>
    toApiResult(raw, toArray<LogRow>(raw)),
  )

export const clearLoginLogList = () =>
  post<ApiResult<null>>('/llog/clearLoginLogList').then((raw) => toApiResult(raw, null))

export const clearOperationLogList = () =>
  post<ApiResult<null>>('/olog/clearOperationLogList').then((raw) => toApiResult(raw, null))
