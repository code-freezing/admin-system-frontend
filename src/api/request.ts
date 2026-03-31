/**
 * 模块说明：
 * 1. 统一请求助手。
 * 2. 对外暴露最常用的 POST 包装，屏蔽 axios 实例的底层细节。
 * 3. 其目标是让各个 api 文件保持轻量和一致。
 */

import instance, { type HttpRequestConfig } from '@/http/index'

// API 层统一走这层轻包装，避免每个模块重复关心请求方法和实例细节。
export const post = <T = any>(url: string, data?: any, config?: HttpRequestConfig) => {
  return instance({
    url,
    method: 'POST',
    data,
    ...config,
  }) as Promise<T>
}
