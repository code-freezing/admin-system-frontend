/**
 * 模块说明：
 * 1. 系统概览接口封装。
 * 2. 为概览页提供图表、统计卡片和排行数据。
 * 3. 聚合概览相关请求，避免页面里散落多个 URL。
 */

import { post } from './request'
import { getArrayField, toApiResult, type ApiResult } from '@/http/response'

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

export const getCategoryAndNumber = () => {
  // 概览页图表数据结构不统一，这里统一把后端裸对象收敛成固定字段。
  return post<ApiResult<CategoryAndNumberData>>('/ov/getCategoryAndNumber').then((raw) =>
    toApiResult(raw, {
      category: getArrayField<string>(raw, 'category'),
      price: getArrayField<number>(raw, 'price'),
    }),
  )
}

export const getAdminAndNumber = () => {
  return post<ApiResult<AdminAndNumberData>>('/ov/getAdminAndNumber').then((raw) =>
    toApiResult(raw, {
      data: getArrayField<PieStatsItem>(raw, 'data'),
    }),
  )
}

export const getLevelAndNumber = () => {
  return post<ApiResult<LevelAndNumberData>>('/ov/getLevelAndNumber').then((raw) =>
    toApiResult(raw, {
      data: getArrayField<PieStatsItem>(raw, 'data'),
    }),
  )
}

export const getDayAndNumber = () => {
  return post<ApiResult<DayAndNumberData>>('/ov/getDayAndNumber').then((raw) =>
    toApiResult(raw, {
      week: getArrayField<string>(raw, 'week'),
      number: getArrayField<number>(raw, 'number'),
    }),
  )
}
