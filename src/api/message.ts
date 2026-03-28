/**
 * 模块说明：
 * 1. 消息公告模块接口封装。
 * 2. 负责公告发布、编辑、回收站、详情和首页消息列表等请求。
 * 3. 消息页面和首页公告面板都依赖这一层。
 */

import { post } from './request'
import { toApiResult, toArray, toLengthData, type ApiResult, isRecord } from '@/http/response'

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

// 消息模块既有公告发布，也有回收站和统计列表，所以接口数量会比较多。
export const publishMessage = (data: Record<string, unknown>) => {
  const { message_title, ...rest } = data
  return post<ApiResult<{ id: number; department: string }>>('/msg/publishMessage', {
    message_title,
    ...rest,
  }).then((raw) => {
    const record = isRecord(raw) ? raw : ({} as Record<string, unknown>)
    return toApiResult(raw, {
      id: typeof record['id'] === 'number' ? record['id'] : 0,
      department: typeof record['department'] === 'string' ? record['department'] : '',
    })
  })
}

export const companyMessageList = () => {
  return post<ApiResult<MessageRow[]>>('/msg/companyMessageList').then((raw) => {
    return toApiResult(raw, toArray<MessageRow>(raw))
  })
}

export const systemMessageList = () => {
  return post<ApiResult<MessageRow[]>>('/msg/systemMessageList').then((raw) => {
    return toApiResult(raw, toArray<MessageRow>(raw))
  })
}

// 编辑接口会触发后端同步未读列表，前端只需要提交最新表单。
export const editMessage = (data: Record<string, unknown>) => {
  const { message_title, ...rest } = data
  return post<ApiResult<null>>('/msg/editMessage', { message_title, ...rest }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const searchMessageBydepartment = (message_publish_department: string) => {
  return post<ApiResult<MessageRow[]>>('/msg/searchMessageBydepartment', {
    message_publish_department,
  }).then((raw) => {
    return toApiResult(raw, toArray<MessageRow>(raw))
  })
}

export const searchMessageByLevel = (message_level: string) => {
  return post<ApiResult<MessageRow[]>>('/msg/searchMessageByLevel', { message_level }).then((raw) => {
    return toApiResult(raw, toArray<MessageRow>(raw))
  })
}

export const getMessage = (id: number) => {
  return post<ApiResult<MessageRow[]>>('/msg/getMessage', { id }).then((raw) => {
    return toApiResult(raw, toArray<MessageRow>(raw))
  })
}

// 点击量更新单独拆成接口，方便详情页打开时直接上报浏览次数。
export const updateClick = (message_click_number: number, id: number) => {
  return post<ApiResult<null>>('/msg/updateClick', { message_click_number, id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

// 删除分成软删除、恢复和永久删除，和后端回收站流程保持一致。
export const firstDelete = (id: number) => {
  return post<ApiResult<null>>('/msg/firstDelete', { id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const recycleList = () => {
  return post<ApiResult<MessageRow[]>>('/msg/recycleList').then((raw) => {
    return toApiResult(raw, toArray<MessageRow>(raw))
  })
}

export const getRecycleMessageLength = () => {
  return post<ApiResult<{ length: number }>>('/msg/getRecycleMessageLength').then((raw) => {
    return toApiResult(raw, toLengthData(raw))
  })
}

export const returnRecycleListData = (pager: number) => {
  return post<ApiResult<MessageRow[]>>('/msg/returnRecycleListData', { pager }).then((raw) => {
    return toApiResult(raw, toArray<MessageRow>(raw))
  })
}

export const recover = (id: number) => {
  return post<ApiResult<null>>('/msg/recover', { id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const deleteMessage = (id: number) => {
  return post<ApiResult<null>>('/msg/deleteMessage', { id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const getCompanyMessageLength = () => {
  return post<ApiResult<{ length: number }>>('/msg/getCompanyMessageLength').then((raw) => {
    return toApiResult(raw, toLengthData(raw))
  })
}

export const getSystemMessageLength = () => {
  return post<ApiResult<{ length: number }>>('/msg/getSystemMessageLength').then((raw) => {
    return toApiResult(raw, toLengthData(raw))
  })
}

export const returnCompanyListData = (pager: number) => {
  return post<ApiResult<MessageRow[]>>('/msg/returnCompanyListData', { pager }).then((raw) => {
    return toApiResult(raw, toArray<MessageRow>(raw))
  })
}

export const returnSystemListData = (pager: number) => {
  return post<ApiResult<MessageRow[]>>('/msg/returnSystemListData', { pager }).then((raw) => {
    return toApiResult(raw, toArray<MessageRow>(raw))
  })
}
