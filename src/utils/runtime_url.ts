const DEFAULT_API_BASE_URL = 'http://127.0.0.1:3007'

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getApiBaseUrl = () => {
  // 同时兼容两套历史环境变量名，避免老环境配置切不过来。
  const configuredUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASEURL
  return trimTrailingSlash(configuredUrl || DEFAULT_API_BASE_URL)
}

// 整理当前输入，确保后续流程直接消费统一结构。
export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiBaseUrl()}${normalizedPath}`
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const toAbsoluteResourceUrl = (value?: string | null) => {
  if (!value) return ''

  if (/^https?:\/\//.test(value)) return value

  return buildApiUrl(value)
}
