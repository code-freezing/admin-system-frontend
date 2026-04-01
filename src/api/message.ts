import { post } from './request'
import { getNumberField, getStringField, result, toArray, toLengthData } from '@/http/response'

// 处理消息，把当前模块的关键逻辑集中在这里。
export const publishMessage = (data) =>
  post('/msg/publishMessage', data).then((raw) =>
    result(raw, {
      id: getNumberField(raw, 'id'),
      department: getStringField(raw, 'department'),
    }),
  )

// 处理消息列表，把当前模块的关键逻辑集中在这里。
export const companyMessageList = () =>
  post('/msg/companyMessageList').then((raw) => result(raw, toArray(raw)))

// 处理消息列表，把当前模块的关键逻辑集中在这里。
export const systemMessageList = () =>
  post('/msg/systemMessageList').then((raw) => result(raw, toArray(raw)))

// 更新消息，让当前记录按最新输入重新保存。
export const editMessage = (data) =>
  post('/msg/editMessage', data).then((raw) => result(raw, null))

// 查询消息，按当前条件筛出目标结果。
export const searchMessageBydepartment = (message_publish_department) =>
  post('/msg/searchMessageBydepartment', { message_publish_department }).then((raw) =>
    result(raw, toArray(raw)),
  )

// 查询消息，按当前条件筛出目标结果。
export const searchMessageByLevel = (message_level) =>
  post('/msg/searchMessageByLevel', { message_level }).then((raw) => result(raw, toArray(raw)))

// 获取消息，让后续逻辑统一使用这一份结果。
export const getMessage = (id) =>
  post('/msg/getMessage', { id }).then((raw) => result(raw, toArray(raw)))

// 更新当前状态，保持页面状态和实际数据一致。
export const updateClick = (message_click_number, id) =>
  post('/msg/updateClick', { message_click_number, id }).then((raw) => result(raw, null))

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const firstDelete = (id) =>
  post('/msg/firstDelete', { id }).then((raw) => result(raw, null))

// 处理列表，把当前模块的关键逻辑集中在这里。
export const recycleList = () =>
  post('/msg/recycleList').then((raw) => result(raw, toArray(raw)))

// 获取消息，让后续逻辑统一使用这一份结果。
export const getRecycleMessageLength = () =>
  post('/msg/getRecycleMessageLength').then((raw) => result(raw, toLengthData(raw)))

// 返回列表数据，让上层直接消费最终结果。
export const returnRecycleListData = (pager) =>
  post('/msg/returnRecycleListData', { pager }).then((raw) => result(raw, toArray(raw)))

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const recover = (id) =>
  post('/msg/recover', { id }).then((raw) => result(raw, null))

// 删除消息，避免旧数据继续影响后续流程。
export const deleteMessage = (id) =>
  post('/msg/deleteMessage', { id }).then((raw) => result(raw, null))

// 获取消息，让后续逻辑统一使用这一份结果。
export const getCompanyMessageLength = () =>
  post('/msg/getCompanyMessageLength').then((raw) => result(raw, toLengthData(raw)))

// 获取消息，让后续逻辑统一使用这一份结果。
export const getSystemMessageLength = () =>
  post('/msg/getSystemMessageLength').then((raw) => result(raw, toLengthData(raw)))

// 返回列表数据，让上层直接消费最终结果。
export const returnCompanyListData = (pager) =>
  post('/msg/returnCompanyListData', { pager }).then((raw) => result(raw, toArray(raw)))

// 返回列表数据，让上层直接消费最终结果。
export const returnSystemListData = (pager) =>
  post('/msg/returnSystemListData', { pager }).then((raw) => result(raw, toArray(raw)))
