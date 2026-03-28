/**
 * 模块说明：
 * 1. 部门消息接口封装。
 * 2. 供部门消息弹窗和未读状态 store 调用，统一声明消息读取相关接口。
 * 3. 这一层只组织参数和 URL，不处理页面交互。
 */

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
