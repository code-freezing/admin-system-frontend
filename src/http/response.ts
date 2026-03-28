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
  id?: number
  image_url?: string
  identity?: string
  account?: string
  name?: string
  sex?: string
  department?: string
  email?: string
  [key: string]: unknown
}

export interface AccessProfileData {
  user: SessionUserProfile
  roles: string[]
  permissionCodes: string[]
  menus: MenuNode[]
}

type UnknownRecord = Record<string, unknown>

export const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === 'object' && value !== null
}

export const getStatus = (value: unknown) => {
  if (!isRecord(value) || typeof value.status !== 'number') {
    return 0
  }

  return value.status
}

export const getMessage = (value: unknown) => {
  if (!isRecord(value) || typeof value.message !== 'string') {
    return ''
  }

  return value.message
}

export const toApiResult = <T>(value: unknown, data: T): ApiResult<T> => {
  return {
    status: getStatus(value),
    message: getMessage(value),
    data,
  }
}

export const toArray = <T>(value: unknown): T[] => {
  return Array.isArray(value) ? (value as T[]) : []
}

export const toStringData = (value: unknown) => {
  return typeof value === 'string' ? value : ''
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
  const record =
    typeof value === 'object' && value !== null ? (value as unknown as Record<string, unknown>) : {}

  return {
    length: typeof record['length'] === 'number' ? record['length'] : 0,
  }
}

export const toAccessProfileData = (value: unknown): AccessProfileData => {
  const record = isRecord(value) ? value : {}

  return {
    user: isRecord(record.user) ? (record.user as SessionUserProfile) : {},
    roles: Array.isArray(record.roles) ? (record.roles as string[]) : [],
    permissionCodes: Array.isArray(record.permissionCodes) ? (record.permissionCodes as string[]) : [],
    menus: Array.isArray(record.menus) ? (record.menus as MenuNode[]) : [],
  }
}
