import instance from '@/http/index'

export const post = <T = any>(url: string, data?: any) => {
  return instance({
    url,
    method: 'POST',
    data,
  }) as Promise<T>
}
