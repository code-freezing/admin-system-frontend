import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3007/'

// 这个实例只负责通用请求配置，业务层统一通过它发请求。
const instance = axios.create({
  baseURL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const getToken = () => {
  const token = localStorage.getItem('token')
  return token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : ''
}

// 请求前统一补上 token，避免每个接口文件重复处理认证头。
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器只做最小处理，业务代码拿到的就是后端返回体。
instance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
)

export type HttpRequestConfig = AxiosRequestConfig

export default instance
