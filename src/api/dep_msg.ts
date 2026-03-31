/**
 * 模块说明：
 * 1. 部门消息接口封装。
 * 2. 供部门消息弹窗和未读状态 store 调用，统一声明消息读取相关接口。
 * 3. 这一层只组织参数和 URL，不处理页面交互。
 */

import { post } from './request'
import { getArrayField, getNumberField, toApiResult, toArray, type ApiResult } from '@/http/response'

export interface DepartmentMessageItem {
  id: number
  message_title: string
  message_content: string
  message_level?: string
  message_publish_time?: string
  message_click_number?: number
  [key: string]: unknown
}

export interface ReadStatusItem {
  read_list?: string
  read_status?: number
}

// 部门消息接口。
export const getDepartmentMsg = (id: number, department: string) =>
  post<ApiResult<{ id: number; read_list: number[] }>>('/dm/getDepartmentMsg', { id, department }).then(
    (raw) =>
      toApiResult(raw, {
        id: getNumberField(raw, 'id'),
        read_list: getArrayField<number>(raw, 'read_list'),
      }),
  )

export const getDepartmentMsgList = (department: string) =>
  post<ApiResult<DepartmentMessageItem[]>>('/dm/getDepartmentMsgList', { department }).then((raw) =>
    toApiResult(raw, toArray<DepartmentMessageItem>(raw)),
  )

export const getReadListAndStatus = (id: number) =>
  post<ApiResult<ReadStatusItem[]>>('/dm/getReadListAndStatus', { id }).then((raw) =>
    toApiResult(raw, toArray<ReadStatusItem>(raw)),
  )

export const clickDelete = (readId: number, id: number) =>
  post<ApiResult<null>>('/dm/clickDelete', { readId, id }).then((raw) => toApiResult(raw, null))

export const changeUserReadList = (newId: number, department: string) =>
  post<ApiResult<null>>('/dm/changeUserReadList', { newId, department }).then((raw) =>
    toApiResult(raw, null),
  )

export const changeUserReadListButDelete = (deleteId: number, department: string) =>
  post<ApiResult<null>>('/dm/changeUserReadListButDelete', { deleteId, department }).then((raw) =>
    toApiResult(raw, null),
  )
