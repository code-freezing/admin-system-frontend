import { post } from './request'

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

export const updateClick = (message_click_number: number, id: number) => {
  return post('/msg/updateClick', { message_click_number, id })
}

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
