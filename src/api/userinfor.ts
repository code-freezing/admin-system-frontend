/**
 * 模块说明：
 * 1. 用户与权限模块接口封装。
 * 2. 覆盖个人资料、账号安全、用户管理、管理员管理等能力。
 * 3. 用户相关页面和通用分页 hook 都从这里拿数据。
 */

import { post } from './request'
import { toApiResult, toArray, toLengthData, toSessionUserProfile, type ApiResult } from '@/http/response'

export type UserInfoData = ReturnType<typeof toSessionUserProfile>

export interface LengthData {
  length: number
}

export const getUserInfo = (id: number) => {
  return post<ApiResult<UserInfoData>>('/user/getUserInfo', { id }).then((raw) =>
    toApiResult(raw, toSessionUserProfile(raw)),
  )
}

export const bind = (account: string, onlyId: string | number, url: string) =>
  post<ApiResult<null>>('/user/bindAccount', { account, onlyId, url }).then((raw) => toApiResult(raw, null))

export const changePassword = (id: number, oldPassword: string, newPassword: string) =>
  post<ApiResult<null>>('/user/changePassword', { id, oldPassword, newPassword }).then((raw) =>
    toApiResult(raw, null),
  )

export const changeName = (name: string, id: number) =>
  post<ApiResult<null>>('/user/changeName', { name, id }).then((raw) => toApiResult(raw, null))

export const changeSex = (sex: string, id: number) =>
  post<ApiResult<null>>('/user/changeSex', { sex, id }).then((raw) => toApiResult(raw, null))

export const changeEmail = (email: string, id: number) =>
  post<ApiResult<null>>('/user/changeEmail', { email, id }).then((raw) => toApiResult(raw, null))

export const createAdmin = (data: Record<string, unknown>) =>
  post<ApiResult<null>>('/user/createAdmin', data).then((raw) => toApiResult(raw, null))

export const editAdmin = (data: Record<string, unknown>) =>
  post<ApiResult<null>>('/user/editAdmin', data).then((raw) => toApiResult(raw, null))

export const changeIdentityToUser = (id: number) =>
  post<ApiResult<null>>('/user/changeIdentityToUser', { id }).then((raw) => toApiResult(raw, null))

export const changeIdentityToAdmin = (id: number, identity: string) =>
  post<ApiResult<null>>('/user/changeIdentityToAdmin', { id, identity }).then((raw) =>
    toApiResult(raw, null),
  )

export const searchUser = (account: string | number | undefined, identity: string) =>
  post<ApiResult<UserInfoData[]>>('/user/searchUser', { account, identity }).then((raw) =>
    toApiResult(raw, toArray<UserInfoData>(raw)),
  )

export const searchDepartment = (department: string) =>
  post<ApiResult<UserInfoData[]>>('/user/searchUserByDepartment', { department }).then((raw) =>
    toApiResult(raw, toArray<UserInfoData>(raw)),
  )

export const banUser = (id: number) =>
  post<ApiResult<null>>('/user/banUser', { id }).then((raw) => toApiResult(raw, null))

export const hotUser = (id: number) =>
  post<ApiResult<null>>('/user/hotUser', { id }).then((raw) => toApiResult(raw, null))

export const getBanList = () =>
  post<ApiResult<UserInfoData[]>>('/user/getBanList').then((raw) =>
    toApiResult(raw, toArray<UserInfoData>(raw)),
  )

export const deleteUser = (id: number, account: string) =>
  post<ApiResult<null>>('/user/deleteUser', { id, account }).then((raw) => toApiResult(raw, null))

export const getAdminListLength = (identity: string) => {
  // 列表总数单独取值，保持和当前分页表格逻辑一致。
  return post<ApiResult<LengthData>>('/user/getAdminListLength', { identity }).then((raw) =>
    toApiResult(raw, toLengthData(raw)),
  )
}

export const returnListData = (pager: number, identity: string) =>
  post<ApiResult<UserInfoData[]>>('/user/returnListData', { pager, identity }).then((raw) =>
    toApiResult(raw, toArray<UserInfoData>(raw)),
  )
