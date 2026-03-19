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
