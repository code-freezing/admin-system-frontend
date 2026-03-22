import { post } from './request'

type AuthPayload = {
  account: string | number | null
  password: string | null
}

type VerifyPayload = {
  account: string | number | null
  email: string | null
}

// 登录相关接口保持各自封装，调用方负责传递表单数据。
export const register = ({ account, password }: AuthPayload) => {
  return post('/api/register', { account, password })
}

export const login = ({ account, password }: AuthPayload) => {
  return post('/api/login', { account, password })
}

// access token 过期后，前端通过 HttpOnly Cookie 里的 refresh token 静默续期。
export const refreshToken = () => {
  return post('/api/refresh', undefined, { _skipAuthRefresh: true })
}

// 退出登录时通知后端撤销当前 Cookie 中的 refresh token。
export const logout = () => {
  return post('/api/logout', undefined, { _skipAuthRefresh: true })
}

export const returnMenuList = (id: number) => {
  return post('/api/returnMenuList', { id })
}

export const verify = ({ account, email }: VerifyPayload) => {
  return post('/user/verifyAccountAndEmail', { account, email })
}

export const reset = (id: number, newPassword: string) => {
  return post('/user/changePasswordInLogin', { id, newPassword })
}
