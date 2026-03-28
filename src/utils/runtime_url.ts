/**
 * 模块说明：
 * 1. 运行时 URL 工具。
 * 2. 统一处理 API 基址、资源绝对地址和环境变量兼容。
 * 3. 避免页面层继续散落 127.0.0.1 和两套环境变量名。
 */

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:3007'

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

export const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASEURL
  return trimTrailingSlash(configuredUrl || DEFAULT_API_BASE_URL)
}

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiBaseUrl()}${normalizedPath}`
}

export const toAbsoluteResourceUrl = (value?: string | null) => {
  if (!value) {
    return ''
  }

  if (/^https?:\/\//.test(value)) {
    return value
  }

  return buildApiUrl(value)
}
