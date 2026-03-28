/**
 * 模块说明：
 * 1. 系统概览接口封装。
 * 2. 为概览页提供图表、统计卡片和排行数据。
 * 3. 聚合概览相关请求，避免页面里散落多个 URL。
 */

import { post } from './request'
import { toApiResult, type ApiResult, isRecord } from '@/http/response'

export interface PieStatsItem {
  name: string
  value: number
}

export interface CategoryAndNumberData {
  category: string[]
  price: number[]
}

export interface AdminAndNumberData {
  data: PieStatsItem[]
}

export interface LevelAndNumberData {
  data: PieStatsItem[]
}

export interface DayAndNumberData {
  week: string[]
  number: number[]
}

// 概览页只做统计查询。
export const getCategoryAndNumber = () => {
  return post<ApiResult<CategoryAndNumberData>>('/ov/getCategoryAndNumber').then((raw) => {
    const record = isRecord(raw) ? raw : ({} as Record<string, unknown>)
    return toApiResult(raw, {
      category: Array.isArray(record['category']) ? (record['category'] as string[]) : [],
      price: Array.isArray(record['price']) ? (record['price'] as number[]) : [],
    })
  })
}

export const getAdminAndNumber = () => {
  return post<ApiResult<AdminAndNumberData>>('/ov/getAdminAndNumber').then((raw) => {
    const record = isRecord(raw) ? raw : ({} as Record<string, unknown>)
    return toApiResult(raw, {
      data: Array.isArray(record['data']) ? (record['data'] as PieStatsItem[]) : [],
    })
  })
}

export const getLevelAndNumber = () => {
  return post<ApiResult<LevelAndNumberData>>('/ov/getLevelAndNumber').then((raw) => {
    const record = isRecord(raw) ? raw : ({} as Record<string, unknown>)
    return toApiResult(raw, {
      data: Array.isArray(record['data']) ? (record['data'] as PieStatsItem[]) : [],
    })
  })
}

export const getDayAndNumber = () => {
  return post<ApiResult<DayAndNumberData>>('/ov/getDayAndNumber').then((raw) => {
    const record = isRecord(raw) ? raw : ({} as Record<string, unknown>)
    return toApiResult(raw, {
      week: Array.isArray(record['week']) ? (record['week'] as string[]) : [],
      number: Array.isArray(record['number']) ? (record['number'] as number[]) : [],
    })
  })
}
