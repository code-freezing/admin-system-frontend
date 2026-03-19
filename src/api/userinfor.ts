import { post } from './request'

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

export const getAdminList = (identity: string) => {
  return post('/user/getAdminList', { identity })
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

export const searchUser = (account: number | undefined, identity: string) => {
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

export const deleteUser = (id: number, account: number) => {
  return post('/user/deleteUser', { id, account })
}

export const getAdminListLength = (identity: string) => {
  return post('/user/getAdminListLength', { identity })
}

export const returnListData = (pager: number, identity: string) => {
  return post('/user/returnListData', { pager, identity })
}
