/**
 * 模块说明：
 * 1. 轻量视图缓存工具。
 * 2. 只用于首页这类读多写少的展示数据，减少短时间重复请求。
 * 3. 采用 sessionStorage，避免跨浏览器长期缓存导致界面内容过旧。
 */

interface CacheRecord<T> {
  expiresAt: number
  value: T
}

const readCacheRecord = <T>(key: string): CacheRecord<T> | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.sessionStorage.getItem(key)
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as CacheRecord<T>
  } catch {
    window.sessionStorage.removeItem(key)
    return null
  }
}

export const getViewCache = <T>(key: string): T | null => {
  const record = readCacheRecord<T>(key)
  if (!record) {
    return null
  }

  if (record.expiresAt <= Date.now()) {
    window.sessionStorage.removeItem(key)
    return null
  }

  return record.value
}

export const setViewCache = <T>(key: string, value: T, ttlMs: number) => {
  if (typeof window === 'undefined') {
    return
  }

  const payload: CacheRecord<T> = {
    expiresAt: Date.now() + ttlMs,
    value,
  }

  window.sessionStorage.setItem(key, JSON.stringify(payload))
}
