import { post } from './request'
import { result, toArray, toLengthData } from '@/http/response'

// 处理日志，在认证通过后建立当前会话。
export const loginLog = (account, name, email) =>
  post('/llog/loginLog', { account, name, email }).then((raw) => result(raw, null))

// 处理日志，把当前模块的关键逻辑集中在这里。
export const operationLog = (operation_person, operation_content, operation_level) =>
  post('/olog/operationLog', {
    operation_person,
    operation_content,
    operation_level,
  }).then((raw) => result(raw, null))

// 处理日志列表，在认证通过后建立当前会话。
export const loginLogList = () =>
  post('/llog/loginLogList').then((raw) => result(raw, toArray(raw)))

// 处理日志列表，把当前模块的关键逻辑集中在这里。
export const operationLogList = () =>
  post('/olog/operationLogList').then((raw) => result(raw, toArray(raw)))

// 查询登录日志列表，按当前条件筛出目标结果。
export const searchLoginLogList = (account) =>
  post('/llog/searchLoginLogList', { account }).then((raw) => result(raw, toArray(raw)))

// 查询日志列表，按当前条件筛出目标结果。
export const searchOperationLogList = (operation_person) =>
  post('/olog/searchOperationLogList', { operation_person }).then((raw) => result(raw, toArray(raw)))

// 处理日志列表，在认证通过后建立当前会话。
export const loginLogListLength = () =>
  post('/llog/loginLogListLength').then((raw) => result(raw, toLengthData(raw)))

// 处理日志列表，把当前模块的关键逻辑集中在这里。
export const operationLogListLength = () =>
  post('/olog/operationLogListLength').then((raw) => result(raw, toLengthData(raw)))

// 返回登录列表数据，让上层直接消费最终结果。
export const returnLoginListData = (pager) =>
  post('/llog/returnLoginListData', { pager }).then((raw) => result(raw, toArray(raw)))

// 返回列表数据，让上层直接消费最终结果。
export const returnOperationListData = (pager) =>
  post('/olog/returnOperationListData', { pager }).then((raw) => result(raw, toArray(raw)))

// 清理登录日志列表，防止旧状态残留到下一次流程。
export const clearLoginLogList = () =>
  post('/llog/clearLoginLogList').then((raw) => result(raw, null))

// 清理日志列表，防止旧状态残留到下一次流程。
export const clearOperationLogList = () =>
  post('/olog/clearOperationLogList').then((raw) => result(raw, null))
