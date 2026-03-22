import { post } from './request'

// 消息模块既有公告发布，也有回收站和统计列表，所以接口数量会比较多。
export const publishMessage = (data: Record<string, unknown>) => {
  const { message_title, ...rest } = data
  return post('/msg/publishMessage', { message_title, ...rest })
}

export const companyMessageList = () => {
  return post('/msg/companyMessageList')
}

export const systemMessageList = () => {
  return post('/msg/systemMessageList')
}

// 编辑接口会触发后端同步未读列表，前端只需要提交最新表单。
export const editMessage = (data: Record<string, unknown>) => {
  const { message_title, ...rest } = data
  return post('/msg/editMessage', { message_title, ...rest })
}

export const searchMessageBydepartment = (message_publish_department: string) => {
  return post('/msg/searchMessageBydepartment', { message_publish_department })
}

export const searchMessageByLevel = (message_level: string) => {
  return post('/msg/searchMessageByLevel', { message_level })
}

export const getMessage = (id: number) => {
  return post('/msg/getMessage', { id })
}

// 点击量更新单独拆成接口，方便详情页打开时直接上报浏览次数。
export const updateClick = (message_click_number: number, id: number) => {
  return post('/msg/updateClick', { message_click_number, id })
}

// 删除分成软删除、恢复和永久删除，和后端回收站流程保持一致。
export const firstDelete = (id: number) => {
  return post('/msg/firstDelete', { id })
}

export const recycleList = () => {
  return post('/msg/recycleList')
}

export const getRecycleMessageLength = () => {
  return post('/msg/getRecycleMessageLength')
}

export const returnRecycleListData = (pager: number) => {
  return post('/msg/returnRecycleListData', { pager })
}

export const recover = (id: number) => {
  return post('/msg/recover', { id })
}

export const deleteMessage = (id: number) => {
  return post('/msg/deleteMessage', { id })
}

export const getCompanyMessageLength = () => {
  return post('/msg/getCompanyMessageLength')
}

export const getSystemMessageLength = () => {
  return post('/msg/getSystemMessageLength')
}

export const returnCompanyListData = (pager: number) => {
  return post('/msg/returnCompanyListData', { pager })
}

export const returnSystemListData = (pager: number) => {
  return post('/msg/returnSystemListData', { pager })
}
