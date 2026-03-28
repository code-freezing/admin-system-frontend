/**
 * 模块说明：
 * 1. 用户与权限模块接口封装。
 * 2. 覆盖个人资料、账号安全、用户管理、管理员管理等能力。
 * 3. 用户相关页面和通用分页 hook 都从这里拿数据。
 */

import { post } from './request'
import { toApiResult, toArray, type ApiResult } from '@/http/response'

export interface UserInfoData {
  id?: number
  account?: number | string
  name?: string
  sex?: string
  email?: string
  department?: string
  identity?: string
  image_url?: string
  [key: string]: unknown
}

export interface LengthData {
  length: number
}

// 这一组接口全部属于“用户信息与管理员管理”模块。
export const getUserInfo = (id: number) => {
  return post<ApiResult<UserInfoData>>('/user/getUserInfo', { id }).then((raw) => {
    const data =
      typeof raw === 'object' && raw !== null ? (raw as unknown as UserInfoData) : {}
    return toApiResult(raw, data)
  })
}

export const bind = (account: string, onlyId: string | number, url: string) => {
  return post<ApiResult<null>>('/user/bindAccount', { account, onlyId, url }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const changePassword = (id: number, oldPassword: string, newPassword: string) => {
  return post<ApiResult<null>>('/user/changePassword', { id, oldPassword, newPassword }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const changeName = (name: string, id: number) => {
  return post<ApiResult<null>>('/user/changeName', { name, id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const changeSex = (sex: string, id: number) => {
  return post<ApiResult<null>>('/user/changeSex', { sex, id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const changeEmail = (email: string, id: number) => {
  return post<ApiResult<null>>('/user/changeEmail', { email, id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const createAdmin = (data: Record<string, unknown>) => {
  const { account, ...rest } = data
  return post<ApiResult<null>>('/user/createAdmin', { account, ...rest }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const editAdmin = (data: Record<string, unknown>) => {
  const { id, ...rest } = data
  return post<ApiResult<null>>('/user/editAdmin', { id, ...rest }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const changeIdentityToUser = (id: number) => {
  return post<ApiResult<null>>('/user/changeIdentityToUser', { id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const changeIdentityToAdmin = (id: number, identity: string) => {
  return post<ApiResult<null>>('/user/changeIdentityToAdmin', { id, identity }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const searchUser = (account: string | number | undefined, identity: string) => {
  return post<ApiResult<UserInfoData[]>>('/user/searchUser', { account, identity }).then((raw) => {
    return toApiResult(raw, toArray<UserInfoData>(raw))
  })
}

export const searchDepartment = (department: string) => {
  return post<ApiResult<UserInfoData[]>>('/user/searchUserByDepartment', { department }).then((raw) => {
    return toApiResult(raw, toArray<UserInfoData>(raw))
  })
}

export const banUser = (id: number) => {
  return post<ApiResult<null>>('/user/banUser', { id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const hotUser = (id: number) => {
  return post<ApiResult<null>>('/user/hotUser', { id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const getBanList = () => {
  return post<ApiResult<UserInfoData[]>>('/user/getBanList').then((raw) => {
    return toApiResult(raw, toArray<UserInfoData>(raw))
  })
}

export const deleteUser = (id: number, account: string) => {
  return post<ApiResult<null>>('/user/deleteUser', { id, account }).then((raw) => {
    return toApiResult(raw, null)
  })
}

// 列表长度和分页数据拆成两个接口，是为了配合当前表格分页逻辑。
export const getAdminListLength = (identity: string) => {
  return post<ApiResult<LengthData>>('/user/getAdminListLength', { identity }).then((raw) => {
    const record =
      typeof raw === 'object' && raw !== null ? (raw as unknown as Record<string, unknown>) : {}
    return toApiResult(raw, {
      length: typeof record['length'] === 'number' ? record['length'] : 0,
    })
  })
}

export const returnListData = (pager: number, identity: string) => {
  return post<ApiResult<UserInfoData[]>>('/user/returnListData', { pager, identity }).then((raw) => {
    return toApiResult(raw, toArray<UserInfoData>(raw))
  })
}
