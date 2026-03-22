import instance, { type HttpRequestConfig } from '@/http/index'

export const post = <T = any>(url: string, data?: any, config?: HttpRequestConfig) => {
  return instance({
    url,
    method: 'POST',
    data,
    ...config,
  }) as Promise<T>
}
