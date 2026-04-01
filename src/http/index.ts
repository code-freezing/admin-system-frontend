import axios from 'axios'
import router from '@/router'
import pinia from '@/stores'
import { useMenu } from '@/stores/menu'
import { useMsg } from '@/stores/message'
import { usePermission } from '@/stores/permission'
import { useUserInfo } from '@/stores/userinfor'
import { clearLoginState, getAccessToken, setAuthTokens } from '@/utils/auth'
import { getApiBaseUrl } from '@/utils/runtime_url'
import { getMessage, getStatus, getStringField, toAccessProfileData } from './response'

const instance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 6000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshRequest = null

// 处理登录，把当前模块的关键逻辑集中在这里。
const redirectToLogin = async () => {
  useMenu(pinia).reset()
  usePermission(pinia).reset()
  useUserInfo(pinia).reset()
  useMsg(pinia).reset()
  clearLoginState()

  if (router.currentRoute.value.path !== '/login') {
    await router.push('/login')
  }
}

// 同步访问控制资料，避免本地状态和服务端结果出现偏差。
const syncAccessProfile = async () => {
  const res = await instance.request({
    url: '/api/authProfile',
    method: 'POST',
    _skipAuthRefresh: true,
    _skipAccessSync: true,
  })

  const profile = toAccessProfileData(res)
  const permissionStore = usePermission(pinia)
  const menuStore = useMenu(pinia)
  const userStore = useUserInfo(pinia)

  permissionStore.setAccessProfile(profile)
  userStore.applyProfile(profile.user)
  menuStore.setRouter(permissionStore.menuTree)
}

// 刷新访问控制Token，避免旧凭证过期后直接中断当前会话。
const refreshAccessToken = async () => {
  if (!refreshRequest) {
    refreshRequest = instance
      .request({
        url: '/api/refresh',
        method: 'POST',
        _skipAuthRefresh: true,
      })
      .then((res) => {
        const accessToken = getStringField(res, 'accessToken')
        const message = getMessage(res) || '刷新 Token 失败'

        if (getStatus(res) !== 0 || !accessToken) {
          throw new Error(message)
        }

        setAuthTokens(accessToken)
        return accessToken
      })
      .finally(() => {
        refreshRequest = null
      })
  }

  return refreshRequest
}

instance.interceptors.request.use(
  (config) => {
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

instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status ?? getStatus(error.response?.data)

    if (status === 401 && originalRequest && !originalRequest._retry && !originalRequest._skipAuthRefresh) {
      try {
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

export default instance
