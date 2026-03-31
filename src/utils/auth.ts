/**
 * 模块说明：
 * 1. 登录态工具。
 * 2. 负责 access token 的本地存取、Bearer 前缀规范化和登录态清理。
 * 3. 请求层、路由守卫和退出登录逻辑都会依赖这里。
 */

const ACCESS_TOKEN_KEY = 'accessToken'

const normalizeAccessToken = (token: string | null | undefined) => {
  return !token ? '' : token.startsWith('Bearer ') ? token : `Bearer ${token}`
}

export const getAccessToken = () => normalizeAccessToken(localStorage.getItem(ACCESS_TOKEN_KEY))

export const hasAuthSession = () => Boolean(getAccessToken())

export const setAuthTokens = (accessToken: string) => {
  // 存储时统一补齐 Bearer 前缀，避免请求层反复关心 token 形态。
  localStorage.setItem(ACCESS_TOKEN_KEY, normalizeAccessToken(accessToken))
}

export const clearLoginState = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}
