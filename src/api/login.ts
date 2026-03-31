/**
 * 模块说明：
 * 1. 认证模块接口封装。
 * 2. 覆盖注册、登录、刷新 token、退出登录和菜单加载等登录链路。
 * 3. 配合请求层的刷新逻辑，实现 access token 自动续期。
 */

import { post } from './request'
import {
  toAccessProfileData,
  toApiResult,
  type AccessProfileData,
  type ApiResult,
  type SessionUserProfile,
  getNullableNumberField,
  getStringField,
  toRecord,
  toSessionUserProfile,
} from '@/http/response'

export type LoginUser = SessionUserProfile

type AuthPayload = {
  account: string | number | null
  password: string | null
}

type VerifyPayload = {
  account: string | number | null
  email: string | null
}

export const register = ({ account, password }: AuthPayload) =>
  post<ApiResult<null>>('/api/register', { account, password }).then((raw) => toApiResult(raw, null))

export const login = ({ account, password }: AuthPayload) => {
  return post<ApiResult<{ accessToken: string; token: string; user: LoginUser }>>('/api/login', {
    account,
    password,
  }).then((raw) => {
    return toApiResult(raw, {
      accessToken: getStringField(raw, 'accessToken'),
      token: getStringField(raw, 'token'),
      user: toSessionUserProfile(toRecord(raw).results),
    })
  })
}

export const refreshToken = () => {
  // access token 过期后由请求层调用该接口，refresh token 会随 HttpOnly Cookie 自动发送。
  return post<ApiResult<{ accessToken: string }>>('/api/refresh', undefined, {
    _skipAuthRefresh: true,
  }).then((raw) => {
    return toApiResult(raw, {
      accessToken: getStringField(raw, 'accessToken'),
    })
  })
}

export const logout = () =>
  post<ApiResult<null>>('/api/logout', undefined, { _skipAuthRefresh: true }).then((raw) =>
    toApiResult(raw, null),
  )

export const authProfile = () =>
  post<ApiResult<AccessProfileData>>('/api/authProfile').then((raw) =>
    toApiResult(raw, toAccessProfileData(raw)),
  )

export const verify = ({ account, email }: VerifyPayload) => {
  // 找回密码前先验证账号和邮箱是否匹配同一个用户。
  return post<ApiResult<{ id: number | null }>>('/user/verifyAccountAndEmail', { account, email }).then(
    (raw) => toApiResult(raw, { id: getNullableNumberField(raw, 'id') }),
  )
}

export const reset = (id: number, newPassword: string) =>
  post<ApiResult<null>>('/user/changePasswordInLogin', { id, newPassword }).then((raw) =>
    toApiResult(raw, null),
  )
