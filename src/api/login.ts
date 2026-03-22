import { post } from './request'

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
  return post('/api/register', { account, password })
}

export const login = ({ account, password }: AuthPayload) => {
  return post('/api/login', { account, password })
}

// access token 过期后，请求层会调用该接口，refresh token 由 HttpOnly Cookie 自动携带。
export const refreshToken = () => {
  return post('/api/refresh', undefined, { _skipAuthRefresh: true })
}

// 退出登录时通知后端撤销当前会话对应的 refresh token。
export const logout = () => {
  return post('/api/logout', undefined, { _skipAuthRefresh: true })
}

// 登录成功后会根据用户 id 拉取菜单，并恢复动态路由。
export const returnMenuList = (id: number) => {
  return post('/api/returnMenuList', { id })
}

// 找回密码流程先校验账号和邮箱，再允许重置密码。
export const verify = ({ account, email }: VerifyPayload) => {
  return post('/user/verifyAccountAndEmail', { account, email })
}

export const reset = (id: number, newPassword: string) => {
  return post('/user/changePasswordInLogin', { id, newPassword })
}
