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
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 这个实例只负责通用请求配置，业务层统一通过它发请求。
let refreshRequest: Promise<string> | null = null

const redirectToLogin = async () => {
  clearLoginState()

  if (router.currentRoute.value.path !== '/login') {
    await router.push('/login')
  }
}

const refreshAccessToken = async () => {
  if (!refreshRequest) {
    // 多个请求同时 401 时复用同一个刷新请求，避免并发刷新互相覆盖。
    refreshRequest = instance.request({
      url: '/api/refresh',
      method: 'POST',
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
      // 业务请求统一自动带上 access token。
      const token = getAccessToken()
      if (token) {
        config.headers.Authorization = token
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器只做最小处理，业务代码拿到的就是后端返回体。
instance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const status = error.response?.status ?? (error.response?.data as any)?.status

    if (status === 401 && originalRequest && !originalRequest._retry && !originalRequest._skipAuthRefresh) {
      try {
        // access token 失效后，先刷新，再重放原请求。
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
