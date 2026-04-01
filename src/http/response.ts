// 处理记录，把当前模块的关键逻辑集中在这里。
export const isRecord = (value) => typeof value === 'object' && value !== null

// 处理记录，把当前模块的关键逻辑集中在这里。
export const toRecord = (value) => (isRecord(value) ? value : {})

// 获取状态，让后续逻辑统一使用这一份结果。
export const getStatus = (value) => {
  const record = toRecord(value)
  return typeof record.status === 'number' ? record.status : 0
}

// 获取消息，让后续逻辑统一使用这一份结果。
export const getMessage = (value) => {
  const record = toRecord(value)
  return typeof record.message === 'string' ? record.message : ''
}

// 处理结果，把当前模块的关键逻辑集中在这里。
export const result = (value, data) => ({
  status: getStatus(value),
  message: getMessage(value),
  data,
})

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const toArray = (value) => (Array.isArray(value) ? value : [])

// 处理数据，把当前模块的关键逻辑集中在这里。
export const toStringData = (value) => (typeof value === 'string' ? value : '')

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getStringField = (value, key) => {
  const field = toRecord(value)[key]
  return typeof field === 'string' ? field : ''
}

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getTextField = (value, key) => {
  const field = toRecord(value)[key]
  return typeof field === 'string' || typeof field === 'number' ? String(field) : ''
}

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getNumberField = (value, key) => {
  const field = toRecord(value)[key]
  return typeof field === 'number' ? field : 0
}

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getNullableNumberField = (value, key) => {
  const field = toRecord(value)[key]
  return typeof field === 'number' ? field : null
}

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getBooleanField = (value, key) => Boolean(toRecord(value)[key])

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getArrayField = (value, key) => toArray(toRecord(value)[key])

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getObjectField = (value, key) => {
  const field = toRecord(value)[key]
  return isRecord(field) ? field : null
}

// 处理会话用户资料，把当前模块的关键逻辑集中在这里。
export const toSessionUserProfile = (value) => {
  const record = toRecord(value)

  return {
    ...record,
    id: getNumberField(record, 'id'),
    image_url: getStringField(record, 'image_url'),
    identity: getStringField(record, 'identity'),
    account: getTextField(record, 'account'),
    name: getStringField(record, 'name'),
    sex: getStringField(record, 'sex'),
    department: getStringField(record, 'department'),
    email: getStringField(record, 'email'),
  }
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const toJsonStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string')
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

// 处理数据，把当前模块的关键逻辑集中在这里。
export const toLengthData = (value) => ({
  length: getNumberField(value, 'length'),
})

// 处理访问控制资料数据，把当前模块的关键逻辑集中在这里。
export const toAccessProfileData = (value) => ({
  user: toSessionUserProfile(toRecord(value).user),
  roles: getArrayField(value, 'roles'),
  permissionCodes: getArrayField(value, 'permissionCodes'),
  menus: getArrayField(value, 'menus'),
})
