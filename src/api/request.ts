import instance, { type HttpRequestConfig } from '@/http/index'

// API 层只关心接口路径和参数，底层请求细节都交给 http 实例处理。
export const post = <T = any>(url: string, data?: any, config?: HttpRequestConfig) => {
  return instance({
    url,
    method: 'POST',
    data,
    ...config,
  }) as Promise<T>
}
