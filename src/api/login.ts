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
  isRecord,
} from '@/http/response'

export type LoginUser = SessionUserProfile

// 登录模块只负责和认证相关接口通信，页面层再决定如何处理 UI。
type AuthPayload = {
  account: string | number | null
  password: string | null
}

type VerifyPayload = {
  account: string | number | null
  email: string | null
}

// 注册和登录都只是透传表单数据，不在这一层混入页面逻辑。
export const register = ({ account, password }: AuthPayload) => {
  return post<ApiResult<null>>('/api/register', { account, password }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const login = ({ account, password }: AuthPayload) => {
  return post<ApiResult<{ accessToken: string; token: string; user: LoginUser }>>('/api/login', {
    account,
    password,
  }).then((raw) => {
    const record = isRecord(raw) ? raw : ({} as Record<string, unknown>)
    const results = isRecord(record['results']) ? (record['results'] as LoginUser) : {}

    return toApiResult(raw, {
      accessToken: typeof record['accessToken'] === 'string' ? record['accessToken'] : '',
      token: typeof record['token'] === 'string' ? record['token'] : '',
      user: results,
    })
  })
}

// access token 过期后，请求层会调用该接口，refresh token 由 HttpOnly Cookie 自动携带。
export const refreshToken = () => {
  return post<ApiResult<{ accessToken: string }>>('/api/refresh', undefined, {
    _skipAuthRefresh: true,
  }).then((raw) => {
    const record = isRecord(raw) ? raw : ({} as Record<string, unknown>)

    return toApiResult(raw, {
      accessToken: typeof record['accessToken'] === 'string' ? record['accessToken'] : '',
    })
  })
}

// 退出登录时通知后端撤销当前会话对应的 refresh token。
export const logout = () => {
  return post<ApiResult<null>>('/api/logout', undefined, { _skipAuthRefresh: true }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const authProfile = () => {
  return post<ApiResult<AccessProfileData>>('/api/authProfile').then((raw) => {
    return toApiResult(raw, toAccessProfileData(raw))
  })
}

// 登录成功后会根据用户 id 拉取菜单，并恢复动态路由。
// 找回密码流程先校验账号和邮箱，再允许重置密码。
export const verify = ({ account, email }: VerifyPayload) => {
  return post<ApiResult<{ id: number | null }>>('/user/verifyAccountAndEmail', { account, email }).then(
    (raw) => {
      const record = isRecord(raw) ? raw : ({} as Record<string, unknown>)

      return toApiResult(raw, {
        id: typeof record['id'] === 'number' ? record['id'] : null,
      })
    },
  )
}

export const reset = (id: number, newPassword: string) => {
  return post<ApiResult<null>>('/user/changePasswordInLogin', { id, newPassword }).then((raw) => {
    return toApiResult(raw, null)
  })
}
