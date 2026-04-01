const ACCESS_TOKEN_KEY = 'accessToken'

// 处理访问控制Token，把当前模块的关键逻辑集中在这里。
const normalizeAccessToken = (token: string | null | undefined) => {
  return !token ? '' : token.startsWith('Bearer ') ? token : `Bearer ${token}`
}

// 获取访问控制Token，让后续逻辑统一使用这一份结果。
export const getAccessToken = () => normalizeAccessToken(localStorage.getItem(ACCESS_TOKEN_KEY))

// 处理鉴权会话，把当前模块的关键逻辑集中在这里。
export const hasAuthSession = () => Boolean(getAccessToken())

// 更新鉴权，避免状态分散在多个位置维护。
export const setAuthTokens = (accessToken: string) => {
  // 存储时统一补齐 Bearer 前缀，避免请求层反复关心 token 形态。
  localStorage.setItem(ACCESS_TOKEN_KEY, normalizeAccessToken(accessToken))
}

// 清理登录，防止旧状态残留到下一次流程。
export const clearLoginState = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}
