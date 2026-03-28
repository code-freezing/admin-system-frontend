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
import { getStatus, toAccessProfileData } from './response'

const baseURL = getApiBaseUrl()

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  _skipAuthRefresh?: boolean
  _skipAccessSync?: boolean
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
  // 登录态彻底失效后，必须同时清 token 和用户上下文。
  // 如果只跳转页面而不清本地状态，刷新后仍可能被误判为“已登录”。
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
  userStore.applyProfile(profile.user ?? {})
  menuStore.setRouter(permissionStore.menuTree)
}

const refreshAccessToken = async () => {
  if (!refreshRequest) {
    refreshRequest = instance.request({
      url: '/api/refresh',
      method: 'POST',
      // 刷新请求自己不需要 access token，也不能再次触发刷新逻辑。
      _skipAuthRefresh: true,
    } as RetryableRequestConfig)
      .then((res: unknown) => {
        const record = typeof res === 'object' && res !== null ? (res as Record<string, unknown>) : {}
        const accessToken = typeof record.accessToken === 'string' ? record.accessToken : ''
        const message = typeof record.message === 'string' ? record.message : '刷新 Token 失败'

        if (getStatus(res) !== 0 || !accessToken) {
          throw new Error(message)
        }

        // 刷新成功后立即覆盖本地 access token。
        // 后续排队等待的请求会直接复用这次刷新拿到的新 token。
        setAuthTokens(accessToken)
        return accessToken
      })
      .finally(() => {
        // 无论成功还是失败，都要释放锁，避免后续 401 永远卡住。
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
        // 统一在这里附带 Authorization，页面层和 api 层都不需要关心 token 细节。
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
    const status = error.response?.status ?? getStatus(error.response?.data)

    if (status === 401 && originalRequest && !originalRequest._retry && !originalRequest._skipAuthRefresh) {
      try {
        // access token 过期时，先刷新，再把刚才失败的请求重放一次。
        originalRequest._retry = true
        const nextAccessToken = await refreshAccessToken()
        originalRequest.headers.Authorization = nextAccessToken
        return instance(originalRequest)
      } catch (refreshError) {
        // 刷新失败通常意味着 refresh token 也已经失效，当前会话必须作废。
        await redirectToLogin()
        return Promise.reject(refreshError)
      }
    }

    if (status === 401) {
      // 已经是刷新请求本身失败，或该请求明确禁止刷新时，直接回登录页。
      await redirectToLogin()
    }

    if (status === 403 && originalRequest && !originalRequest._skipAccessSync) {
      try {
        await syncAccessProfile()
      } catch {
        // 如果权限上下文同步失败，保持原始 403 即可。
      }
    }

    return Promise.reject(error)
  },
)

export type HttpRequestConfig = AxiosRequestConfig & {
  _skipAuthRefresh?: boolean
  _skipAccessSync?: boolean
}

export default instance
