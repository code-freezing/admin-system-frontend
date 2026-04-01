import { post } from './request'
import { result, toArray, toLengthData } from '@/http/response'

// 创建产品，把当前输入转成新的业务记录。
export const createProduct = (data) =>
  post('/pro/createProduct', data).then((raw) => result(raw, null))

// 删除产品，避免旧数据继续影响后续流程。
export const deleteProduct = (id) =>
  post('/pro/deleteProduct', { id }).then((raw) => result(raw, null))

// 更新产品，让当前记录按最新输入重新保存。
export const editProduct = (data) =>
  post('/pro/editProduct', data).then((raw) => result(raw, null))

// 处理产品，把当前操作正式提交到业务流程里。
export const applyOutProduct = (data) =>
  post('/pro/applyOutProduct', data).then((raw) => result(raw, null))

// 处理申请产品，把当前模块的关键逻辑集中在这里。
export const withdrawApplyProduct = (id) =>
  post('/pro/withdrawApplyProduct', { id }).then((raw) => result(raw, null))

// 处理产品，确保审核动作按当前规则落地。
export const auditProduct = (data) =>
  post('/pro/auditProduct', data).then((raw) => result(raw, null))

// 查询产品，按当前条件筛出目标结果。
export const searchProductForId = (product_id) =>
  post('/pro/searchProductForId', { product_id }).then((raw) => result(raw, toArray(raw)))

// 查询产品申请，按当前条件筛出目标结果。
export const searchProductForApplyId = (product_out_id) =>
  post('/pro/searchProductForApplyId', { product_out_id }).then((raw) => result(raw, toArray(raw)))

// 查询产品，按当前条件筛出目标结果。
export const searchProductForOutId = (product_out_id) =>
  post('/pro/searchProductForOutId', { product_out_id }).then((raw) => result(raw, toArray(raw)))

// 获取产品，让后续逻辑统一使用这一份结果。
export const getProductLength = () =>
  post('/pro/getProductLength').then((raw) => result(raw, toLengthData(raw)))

// 获取申请产品，让后续逻辑统一使用这一份结果。
export const getApplyProductLength = () =>
  post('/pro/getApplyProductLength').then((raw) => result(raw, toLengthData(raw)))

// 获取产品，让后续逻辑统一使用这一份结果。
export const getOutProductLength = () =>
  post('/pro/getOutProductLength').then((raw) => result(raw, toLengthData(raw)))

// 返回产品列表数据，让上层直接消费最终结果。
export const returnProductListData = (pager) =>
  post('/pro/returnProductListData', { pager }).then((raw) => result(raw, toArray(raw)))

// 返回申请产品列表数据，让上层直接消费最终结果。
export const returnApplyProductListData = (pager) =>
  post('/pro/returnApplyProductListData', { pager }).then((raw) => result(raw, toArray(raw)))

// 返回产品列表数据，让上层直接消费最终结果。
export const returnOutProductListData = (pager) =>
  post('/pro/returnOutProductListData', { pager }).then((raw) => result(raw, toArray(raw)))
