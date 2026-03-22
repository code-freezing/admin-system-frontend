import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import router from '@/router'
import { clearLoginState, getAccessToken, setAuthTokens } from '@/utils/auth'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3007/'

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  _skipAuthRefresh?: boolean
}

const instance = axios.create({
  baseURL,
  timeout: 6000,
  // refresh token 在 HttpOnly Cookie 中，这里必须允许浏览器自动带 Cookie。
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 这个单例 Promise 用来保证多个 401 同时出现时只发一个刷新请求。
let refreshRequest: Promise<string> | null = null

const redirectToLogin = async () => {
  clearLoginState()

  if (router.currentRoute.value.path !== '/login') {
    await router.push('/login')
  }
}

const refreshAccessToken = async () => {
  if (!refreshRequest) {
    refreshRequest = instance.request({
      url: '/api/refresh',
      method: 'POST',
      // 刷新请求自己不需要 access token，也不能再次触发刷新逻辑。
      _skipAuthRefresh: true,
    } as RetryableRequestConfig)
      .then((res: any) => {
        if (res?.status !== 0 || !res?.accessToken) {
          throw new Error(res?.message || '刷新 Token 失败')
        }

        setAuthTokens(res.accessToken)
        return res.accessToken as string
      })
      .finally(() => {
        refreshRequest = null
      })
  }

  return refreshRequest
}

instance.interceptors.request.use(
  (config: RetryableRequestConfig) => {
    if (!config._skipAuthRefresh) {
      const token = getAccessToken()
      if (token) {
        config.headers.Authorization = token
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

// 大多数业务代码都希望直接拿到后端返回体，所以这里统一返回 response.data。
instance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const status = error.response?.status ?? (error.response?.data as any)?.status

    if (status === 401 && originalRequest && !originalRequest._retry && !originalRequest._skipAuthRefresh) {
      try {
        // access token 过期时，先刷新，再把刚才失败的请求重放一次。
        originalRequest._retry = true
        const nextAccessToken = await refreshAccessToken()
        originalRequest.headers.Authorization = nextAccessToken
        return instance(originalRequest)
      } catch (refreshError) {
        await redirectToLogin()
        return Promise.reject(refreshError)
      }
    }

    if (status === 401) {
      await redirectToLogin()
    }

    return Promise.reject(error)
  },
)

export type HttpRequestConfig = AxiosRequestConfig & {
  _skipAuthRefresh?: boolean
}

export default instance
