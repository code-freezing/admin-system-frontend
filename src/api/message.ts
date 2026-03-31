/**
 * 模块说明：
 * 1. 消息公告模块接口封装。
 * 2. 负责公告发布、编辑、回收站、详情和首页消息列表等请求。
 * 3. 消息页面和首页公告面板都依赖这一层。
 */

import { post } from './request'
import {
  getNumberField,
  getStringField,
  toApiResult,
  toArray,
  toLengthData,
  type ApiResult,
} from '@/http/response'

export interface MessageRow {
  id: number
  message_title?: string
  message_category?: string
  message_publish_department?: string
  message_publish_name?: string
  message_publish_time?: string
  message_update_time?: string
  message_delete_time?: string
  message_click_number?: number
  message_status?: number | string
  message_receipt_object?: string
  message_level?: string
  message_content?: string
  [key: string]: unknown
}

export const publishMessage = (data: Record<string, unknown>) => {
  // 发布消息后前端还要继续同步部门已读列表，所以这里额外带回消息 id 和接收部门。
  return post<ApiResult<{ id: number; department: string }>>('/msg/publishMessage', data).then((raw) =>
    toApiResult(raw, {
      id: getNumberField(raw, 'id'),
      department: getStringField(raw, 'department'),
    }),
  )
}

export const companyMessageList = () =>
  post<ApiResult<MessageRow[]>>('/msg/companyMessageList').then((raw) =>
    toApiResult(raw, toArray<MessageRow>(raw)),
  )

export const systemMessageList = () =>
  post<ApiResult<MessageRow[]>>('/msg/systemMessageList').then((raw) =>
    toApiResult(raw, toArray<MessageRow>(raw)),
  )

export const editMessage = (data: Record<string, unknown>) =>
  post<ApiResult<null>>('/msg/editMessage', data).then((raw) => toApiResult(raw, null))

export const searchMessageBydepartment = (message_publish_department: string) =>
  post<ApiResult<MessageRow[]>>('/msg/searchMessageBydepartment', { message_publish_department }).then(
    (raw) => toApiResult(raw, toArray<MessageRow>(raw)),
  )

export const searchMessageByLevel = (message_level: string) =>
  post<ApiResult<MessageRow[]>>('/msg/searchMessageByLevel', { message_level }).then((raw) =>
    toApiResult(raw, toArray<MessageRow>(raw)),
  )

export const getMessage = (id: number) =>
  post<ApiResult<MessageRow[]>>('/msg/getMessage', { id }).then((raw) =>
    toApiResult(raw, toArray<MessageRow>(raw)),
  )

export const updateClick = (message_click_number: number, id: number) =>
  post<ApiResult<null>>('/msg/updateClick', { message_click_number, id }).then((raw) =>
    toApiResult(raw, null),
  )

export const firstDelete = (id: number) =>
  post<ApiResult<null>>('/msg/firstDelete', { id }).then((raw) => toApiResult(raw, null))

export const recycleList = () =>
  post<ApiResult<MessageRow[]>>('/msg/recycleList').then((raw) =>
    toApiResult(raw, toArray<MessageRow>(raw)),
  )

export const getRecycleMessageLength = () =>
  post<ApiResult<{ length: number }>>('/msg/getRecycleMessageLength').then((raw) =>
    toApiResult(raw, toLengthData(raw)),
  )

export const returnRecycleListData = (pager: number) =>
  post<ApiResult<MessageRow[]>>('/msg/returnRecycleListData', { pager }).then((raw) =>
    toApiResult(raw, toArray<MessageRow>(raw)),
  )

export const recover = (id: number) =>
  post<ApiResult<null>>('/msg/recover', { id }).then((raw) => toApiResult(raw, null))

export const deleteMessage = (id: number) =>
  post<ApiResult<null>>('/msg/deleteMessage', { id }).then((raw) => toApiResult(raw, null))

export const getCompanyMessageLength = () =>
  post<ApiResult<{ length: number }>>('/msg/getCompanyMessageLength').then((raw) =>
    toApiResult(raw, toLengthData(raw)),
  )

export const getSystemMessageLength = () =>
  post<ApiResult<{ length: number }>>('/msg/getSystemMessageLength').then((raw) =>
    toApiResult(raw, toLengthData(raw)),
  )

export const returnCompanyListData = (pager: number) =>
  post<ApiResult<MessageRow[]>>('/msg/returnCompanyListData', { pager }).then((raw) =>
    toApiResult(raw, toArray<MessageRow>(raw)),
  )

export const returnSystemListData = (pager: number) =>
  post<ApiResult<MessageRow[]>>('/msg/returnSystemListData', { pager }).then((raw) =>
    toApiResult(raw, toArray<MessageRow>(raw)),
  )
