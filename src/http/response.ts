/**
 * 模块说明：
 * 1. 前端接口响应标准化工具。
 * 2. 负责把后端“数组 / results / 直接对象”等不同返回形态收敛成统一结构。
 * 3. API 层和请求层都可以复用这里，减少页面里的 any 和协议分支判断。
 */

import type { MenuNode } from '@/stores/permission'

export interface ApiResult<T> {
  status: number
  message: string
  data: T
}

export interface SessionUserProfile {
  id: number
  image_url: string
  identity: string
  account: string
  name: string
  sex: string
  department: string
  email: string
  [key: string]: unknown
}

export interface AccessProfileData {
  user: SessionUserProfile
  roles: string[]
  permissionCodes: string[]
  menus: MenuNode[]
}

type UnknownRecord = Record<string, unknown>

export const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

export const toRecord = (value: unknown): UnknownRecord => (isRecord(value) ? value : {})

export const getStatus = (value: unknown) => {
  const record = toRecord(value)
  return typeof record.status === 'number' ? record.status : 0
}

export const getMessage = (value: unknown) => {
  const record = toRecord(value)
  return typeof record.message === 'string' ? record.message : ''
}

export const toApiResult = <T>(value: unknown, data: T): ApiResult<T> => {
  return {
    status: getStatus(value),
    message: getMessage(value),
    data,
  }
}

export const toArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : [])

export const toStringData = (value: unknown) => (typeof value === 'string' ? value : '')

export const getStringField = (value: unknown, key: string) => {
  const field = toRecord(value)[key]
  return typeof field === 'string' ? field : ''
}

export const getTextField = (value: unknown, key: string) => {
  const field = toRecord(value)[key]
  return typeof field === 'string' || typeof field === 'number' ? String(field) : ''
}

export const getNumberField = (value: unknown, key: string) => {
  const field = toRecord(value)[key]
  return typeof field === 'number' ? field : 0
}

export const getNullableNumberField = (value: unknown, key: string) => {
  const field = toRecord(value)[key]
  return typeof field === 'number' ? field : null
}

export const getBooleanField = (value: unknown, key: string) => Boolean(toRecord(value)[key])

export const getArrayField = <T>(value: unknown, key: string): T[] => toArray<T>(toRecord(value)[key])

export const getObjectField = <T extends UnknownRecord>(value: unknown, key: string): T | null => {
  const field = toRecord(value)[key]
  return isRecord(field) ? (field as T) : null
}

export const toSessionUserProfile = (value: unknown): SessionUserProfile => {
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

export const toJsonStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export const toLengthData = (value: unknown) => {
  return {
    length: getNumberField(value, 'length'),
  }
}

export const toAccessProfileData = (value: unknown): AccessProfileData => {
  // authProfile 的返回会直接驱动菜单、按钮和用户信息恢复，这里统一收敛成固定结构。
  return {
    user: toSessionUserProfile(toRecord(value).user),
    roles: getArrayField<string>(value, 'roles'),
    permissionCodes: getArrayField<string>(value, 'permissionCodes'),
    menus: getArrayField<MenuNode>(value, 'menus'),
  }
}
