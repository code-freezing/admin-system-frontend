import { post } from './request'
import { getArrayField, result } from '@/http/response'

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getCategoryAndNumber = () =>
  post('/ov/getCategoryAndNumber').then((raw) =>
    result(raw, {
      category: getArrayField(raw, 'category'),
      price: getArrayField(raw, 'price'),
    }),
  )

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getAdminAndNumber = () =>
  post('/ov/getAdminAndNumber').then((raw) =>
    result(raw, {
      data: getArrayField(raw, 'data'),
    }),
  )

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getLevelAndNumber = () =>
  post('/ov/getLevelAndNumber').then((raw) =>
    result(raw, {
      data: getArrayField(raw, 'data'),
    }),
  )

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getDayAndNumber = () =>
  post('/ov/getDayAndNumber').then((raw) =>
    result(raw, {
      week: getArrayField(raw, 'week'),
      number: getArrayField(raw, 'number'),
    }),
  )
