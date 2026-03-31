/**
 * 模块说明：
 * 1. axios 实例与认证链路入口。
 * 2. 统一处理 baseURL、请求头、401 刷新 token 和登录态失效跳转。
 * 3. 前端所有接口最终都会走到这里。
 */

import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import router from '@/router'
import pinia from '@/stores'
import { useMenu } from '@/stores/menu'
import { useMsg } from '@/stores/message'
import { usePermission } from '@/stores/permission'
import { useUserInfo } from '@/stores/userinfor'
import { clearLoginState, getAccessToken, setAuthTokens } from '@/utils/auth'
import { getApiBaseUrl } from '@/utils/runtime_url'
import { getMessage, getStatus, getStringField, toAccessProfileData } from './response'

const baseURL = getApiBaseUrl()

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  _skipAuthRefresh?: boolean
  _skipAccessSync?: boolean
}

const instance = axios.create({
  baseURL,
  timeout: 6000,
  // refresh token 在 HttpOnly Cookie 中，这里必须允许浏览器自动携带 Cookie。
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 多个请求同时 401 时复用同一个刷新请求，避免并发刷新把会话状态打乱。
let refreshRequest: Promise<string> | null = null

const redirectToLogin = async () => {
  // 登录态失效后同时清空本地用户上下文，避免刷新后还被误判成已登录。
  useMenu(pinia).reset()
  usePermission(pinia).reset()
  useUserInfo(pinia).reset()
  useMsg(pinia).reset()
  clearLoginState()

  if (router.currentRoute.value.path !== '/login') {
    await router.push('/login')
  }
}

const syncAccessProfile = async () => {
  // 403 后主动同步一次最新权限上下文，避免按钮和菜单继续停留在旧状态。
  const res = await instance.request({
    url: '/api/authProfile',
    method: 'POST',
    _skipAuthRefresh: true,
    _skipAccessSync: true,
  } as RetryableRequestConfig)
  const profile = toAccessProfileData(res)

  const permissionStore = usePermission(pinia)
  const menuStore = useMenu(pinia)
  const userStore = useUserInfo(pinia)

  permissionStore.setAccessProfile(profile)
  userStore.applyProfile(profile.user)
  menuStore.setRouter(permissionStore.menuTree)
}

const refreshAccessToken = async () => {
  if (!refreshRequest) {
    refreshRequest = instance.request({
      url: '/api/refresh',
      method: 'POST',
      // 刷新请求自身不能再带旧 access token，也不能递归触发刷新逻辑。
      _skipAuthRefresh: true,
    } as RetryableRequestConfig)
      .then((res: unknown) => {
        const accessToken = getStringField(res, 'accessToken')
        const message = getMessage(res) || '刷新 Token 失败'

        if (getStatus(res) !== 0 || !accessToken) {
          throw new Error(message)
        }

        // 刷新成功后立即覆盖本地 access token，让等待中的请求直接复用新 token。
        setAuthTokens(accessToken)
        return accessToken
      })
      .finally(() => {
        // 刷新结束后立即释放锁，避免后续 401 永远等待上一轮结果。
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
        // Authorization 统一在请求层补齐，页面和 API 层只负责业务参数。
        config.headers.Authorization = token
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  // 业务层统一直接消费后端返回体，不再额外解包 AxiosResponse。
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const status = error.response?.status ?? getStatus(error.response?.data)

    if (status === 401 && originalRequest && !originalRequest._retry && !originalRequest._skipAuthRefresh) {
      try {
        // access token 过期后先刷新，再重放当前失败的原始请求。
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

    if (status === 403 && originalRequest && !originalRequest._skipAccessSync) {
      try {
        await syncAccessProfile()
      } catch {}
    }

    return Promise.reject(error)
  },
)

export type HttpRequestConfig = AxiosRequestConfig & {
  _skipAuthRefresh?: boolean
  _skipAccessSync?: boolean
}

export default instance
