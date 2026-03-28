/**
 * 模块说明：
 * 1. 部门消息接口封装。
 * 2. 供部门消息弹窗和未读状态 store 调用，统一声明消息读取相关接口。
 * 3. 这一层只组织参数和 URL，不处理页面交互。
 */

import { post } from './request'
import { toApiResult, toArray, type ApiResult } from '@/http/response'

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
export const getDepartmentMsg = (id: number, department: string) => {
  return post<ApiResult<{ id: number; read_list: number[] }>>('/dm/getDepartmentMsg', {
    id,
    department,
  }).then((raw) => {
    const record =
      typeof raw === 'object' && raw !== null ? (raw as unknown as Record<string, unknown>) : {}

    return toApiResult(raw, {
      id: typeof record.id === 'number' ? record.id : 0,
      read_list: Array.isArray(record.read_list) ? (record.read_list as number[]) : [],
    })
  })
}

export const getDepartmentMsgList = (department: string) => {
  return post<ApiResult<DepartmentMessageItem[]>>('/dm/getDepartmentMsgList', { department }).then((raw) => {
    return toApiResult(raw, toArray<DepartmentMessageItem>(raw))
  })
}

export const getReadListAndStatus = (id: number) => {
  return post<ApiResult<ReadStatusItem[]>>('/dm/getReadListAndStatus', { id }).then((raw) => {
    return toApiResult(raw, toArray<ReadStatusItem>(raw))
  })
}

export const clickDelete = (readId: number, id: number) => {
  return post<ApiResult<null>>('/dm/clickDelete', { readId, id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const changeUserReadList = (newId: number, department: string) => {
  return post<ApiResult<null>>('/dm/changeUserReadList', { newId, department }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const changeUserReadListButDelete = (deleteId: number, department: string) => {
  return post<ApiResult<null>>('/dm/changeUserReadListButDelete', { deleteId, department }).then((raw) => {
    return toApiResult(raw, null)
  })
}
