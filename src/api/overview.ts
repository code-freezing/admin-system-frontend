/**
 * 模块说明：
 * 1. 系统概览接口封装。
 * 2. 为概览页提供图表、统计卡片和排行数据。
 * 3. 聚合概览相关请求，避免页面里散落多个 URL。
 */

import { post } from './request'

// 概览页只做统计查询。
export const getCategoryAndNumber = () => {
  return post('/ov/getCategoryAndNumber')
}

export const getAdminAndNumber = () => {
  return post('/ov/getAdminAndNumber')
}

export const getLevelAndNumber = () => {
  return post('/ov/getLevelAndNumber')
}

export const getDayAndNumber = () => {
  return post('/ov/getDayAndNumber')
}
