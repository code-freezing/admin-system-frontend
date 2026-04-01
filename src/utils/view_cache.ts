// 处理已读信息缓存记录，把当前模块的关键逻辑集中在这里。
const readCacheRecord = (key) => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.sessionStorage.getItem(key)
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    window.sessionStorage.removeItem(key)
    return null
  }
}

// 获取页面视图缓存，让后续逻辑统一使用这一份结果。
export const getViewCache = (key) => {
  const record = readCacheRecord(key)
  if (!record) {
    return null
  }

  if (record.expiresAt <= Date.now()) {
    window.sessionStorage.removeItem(key)
    return null
  }

  return record.value
}

// 更新页面视图缓存，避免状态分散在多个位置维护。
export const setViewCache = (key, value, ttlMs) => {
  if (typeof window === 'undefined') {
    return
  }

  const payload = {
    expiresAt: Date.now() + ttlMs,
    value,
  }

  window.sessionStorage.setItem(key, JSON.stringify(payload))
}
