import { post } from './request'

// 部门消息接口。
export const getDepartmentMsg = (id: number, department: string) => {
  return post('/dm/getDepartmentMsg', { id, department })
}

export const getDepartmentMsgList = (department: string) => {
  return post('/dm/getDepartmentMsgList', { department })
}

export const getReadListAndStatus = (id: number) => {
  return post('/dm/getReadListAndStatus', { id })
}

export const clickDelete = (readId: number, id: number) => {
  return post('/dm/clickDelete', { readId, id })
}

export const changeUserReadList = (newId: number, department: string) => {
  return post('/dm/changeUserReadList', { newId, department })
}

export const changeUserReadListButDelete = (deleteId: number, department: string) => {
  return post('/dm/changeUserReadListButDelete', { deleteId, department })
}
