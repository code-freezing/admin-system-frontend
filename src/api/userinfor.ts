/**
 * 模块说明：
 * 1. 用户与权限模块接口封装。
 * 2. 覆盖个人资料、账号安全、用户管理、管理员管理等能力。
 * 3. 用户相关页面和通用分页 hook 都从这里拿数据。
 */

import { post } from './request'

// 这一组接口全部属于“用户信息与管理员管理”模块。
export const getUserInfo = (id: number) => {
  return post('/user/getUserInfo', { id })
}

export const bind = (account: string, onlyId: string | number, url: string) => {
  return post('/user/bindAccount', { account, onlyId, url })
}

export const changePassword = (id: number, oldPassword: string, newPassword: string) => {
  return post('/user/changePassword', { id, oldPassword, newPassword })
}

export const changeName = (name: string, id: number) => {
  return post('/user/changeName', { name, id })
}

export const changeSex = (sex: string, id: number) => {
  return post('/user/changeSex', { sex, id })
}

export const changeEmail = (email: string, id: number) => {
  return post('/user/changeEmail', { email, id })
}

export const createAdmin = (data: Record<string, unknown>) => {
  const { account, ...rest } = data
  return post('/user/createAdmin', { account, ...rest })
}

export const editAdmin = (data: Record<string, unknown>) => {
  const { id, ...rest } = data
  return post('/user/editAdmin', { id, ...rest })
}

export const changeIdentityToUser = (id: number) => {
  return post('/user/changeIdentityToUser', { id })
}

export const changeIdentityToAdmin = (id: number, identity: string) => {
  return post('/user/changeIdentityToAdmin', { id, identity })
}

export const searchUser = (account: string | number | undefined, identity: string) => {
  return post('/user/searchUser', { account, identity })
}

export const searchDepartment = (department: string) => {
  return post('/user/searchUserByDepartment', { department })
}

export const banUser = (id: number) => {
  return post('/user/banUser', { id })
}

export const hotUser = (id: number) => {
  return post('/user/hotUser', { id })
}

export const getBanList = () => {
  return post('/user/getBanList')
}

export const deleteUser = (id: number, account: string) => {
  return post('/user/deleteUser', { id, account })
}

// 列表长度和分页数据拆成两个接口，是为了配合当前表格分页逻辑。
export const getAdminListLength = (identity: string) => {
  return post('/user/getAdminListLength', { identity })
}

export const returnListData = (pager: number, identity: string) => {
  return post('/user/returnListData', { pager, identity })
}
