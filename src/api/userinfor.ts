import { post } from './request'
import { result, toArray, toLengthData, toSessionUserProfile } from '@/http/response'

// 获取用户信息，让后续逻辑统一使用这一份结果。
export const getUserInfo = (id) =>
  post('/user/getUserInfo', { id }).then((raw) => result(raw, toSessionUserProfile(raw)))

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const bind = (account, onlyId, url) =>
  post('/user/bindAccount', { account, onlyId, url }).then((raw) => result(raw, null))

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const changePassword = (id, oldPassword, newPassword) =>
  post('/user/changePassword', { id, oldPassword, newPassword }).then((raw) => result(raw, null))

// 处理名称，把当前模块的关键逻辑集中在这里。
export const changeName = (name, id) =>
  post('/user/changeName', { name, id }).then((raw) => result(raw, null))

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const changeSex = (sex, id) =>
  post('/user/changeSex', { sex, id }).then((raw) => result(raw, null))

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const changeEmail = (email, id) =>
  post('/user/changeEmail', { email, id }).then((raw) => result(raw, null))

// 创建新记录，把当前输入正式写成业务数据。
export const createAdmin = (data) =>
  post('/user/createAdmin', data).then((raw) => result(raw, null))

// 更新当前记录，确保最新输入能覆盖旧数据。
export const editAdmin = (data) =>
  post('/user/editAdmin', data).then((raw) => result(raw, null))

// 处理用户，把当前模块的关键逻辑集中在这里。
export const changeIdentityToUser = (id) =>
  post('/user/changeIdentityToUser', { id }).then((raw) => result(raw, null))

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const changeIdentityToAdmin = (id, identity) =>
  post('/user/changeIdentityToAdmin', { id, identity }).then((raw) => result(raw, null))

// 查询用户，按当前条件筛出目标结果。
export const searchUser = (account, identity) =>
  post('/user/searchUser', { account, identity }).then((raw) => result(raw, toArray(raw)))

// 查询部门，按当前条件筛出目标结果。
export const searchDepartment = (department) =>
  post('/user/searchUserByDepartment', { department }).then((raw) => result(raw, toArray(raw)))

// 处理用户，把当前模块的关键逻辑集中在这里。
export const banUser = (id) =>
  post('/user/banUser', { id }).then((raw) => result(raw, null))

// 处理用户，把当前模块的关键逻辑集中在这里。
export const hotUser = (id) =>
  post('/user/hotUser', { id }).then((raw) => result(raw, null))

// 获取列表，让后续逻辑统一使用这一份结果。
export const getBanList = () =>
  post('/user/getBanList').then((raw) => result(raw, toArray(raw)))

// 删除用户，避免旧数据继续影响后续流程。
export const deleteUser = (id, account) =>
  post('/user/deleteUser', { id, account }).then((raw) => result(raw, null))

// 获取列表，让后续逻辑统一使用这一份结果。
export const getAdminListLength = (identity) =>
  post('/user/getAdminListLength', { identity }).then((raw) => result(raw, toLengthData(raw)))

// 返回列表数据，让上层直接消费最终结果。
export const returnListData = (pager, identity) =>
  post('/user/returnListData', { pager, identity }).then((raw) => result(raw, toArray(raw)))
