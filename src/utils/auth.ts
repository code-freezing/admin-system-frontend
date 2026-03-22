const ACCESS_TOKEN_KEY = 'accessToken'

const normalizeAccessToken = (token: string | null | undefined) => {
  if (!token) {
    return ''
  }

  return token.startsWith('Bearer ') ? token : `Bearer ${token}`
}

export const getAccessToken = () => normalizeAccessToken(localStorage.getItem(ACCESS_TOKEN_KEY))

export const hasAuthSession = () => Boolean(getAccessToken())

export const setAuthTokens = (accessToken: string) => {
  // 存储时补齐 Bearer 前缀，拦截器可以直接复用。
  localStorage.setItem(ACCESS_TOKEN_KEY, normalizeAccessToken(accessToken))
}

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem('token')
}

export const clearLoginState = () => {
  // 登录态失效时统一清理 token 和用户上下文，避免页面残留旧状态。
  clearAuthTokens()
  localStorage.removeItem('id')
  localStorage.removeItem('name')
  localStorage.removeItem('department')
  localStorage.removeItem('userinfo')
}
