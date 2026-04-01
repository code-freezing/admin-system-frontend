import instance from '@/http/index'

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const post = (url, data, config) =>
  instance({
    url,
    method: 'POST',
    data,
    ...config,
  })
