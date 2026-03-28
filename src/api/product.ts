/**
 * 模块说明：
 * 1. 产品出入库模块接口封装。
 * 2. 负责产品入库、出库申请、审核、分页和查询等库存业务请求。
 * 3. 产品列表页和审核弹窗都会复用这里的方法。
 */

import { post } from './request'

// 产品接口覆盖入库、出库申请、审批和分页查询，保持和后端路由一一对应。
export const createProduct = (data: Record<string, unknown>) => {
  const { product_id, ...rest } = data
  return post('/pro/createProduct', { product_id, ...rest })
}

export const deleteProduct = (id: number) => {
  return post('/pro/deleteProduct', { id })
}

export const editProduct = (data: Record<string, unknown>) => {
  const { id, ...rest } = data
  return post('/pro/editProduct', { id, ...rest })
}

export const applyOutProduct = (data: Record<string, unknown>) => {
  const { id, ...rest } = data
  return post('/pro/applyOutProduct', { id, ...rest })
}

export const withdrawApplyProduct = (id: number) => {
  return post('/pro/withdrawApplyProduct', { id })
}

// 审批接口会根据传入状态决定是同意出库还是驳回申请。
export const auditProduct = (data: Record<string, unknown>) => {
  const { id, ...rest } = data
  return post('/pro/auditProduct', { id, ...rest })
}

// 搜索接口按不同业务编号拆分，避免页面拼接复杂条件。
export const searchProductForId = (product_id: string | number) => {
  return post('/pro/searchProductForId', { product_id })
}

export const searchProductForApplyId = (product_out_id: string | number) => {
  return post('/pro/searchProductForApplyId', { product_out_id })
}

export const searchProductForOutId = (product_out_id: string | number) => {
  return post('/pro/searchProductForOutId', { product_out_id })
}

export const getProductLength = () => {
  return post('/pro/getProductLength')
}

export const getApplyProductLength = () => {
  return post('/pro/getApplyProductLength')
}

export const getOutProductLength = () => {
  return post('/pro/getOutProductLength')
}

export const returnProductListData = (pager: number) => {
  return post('/pro/returnProductListData', { pager })
}

export const returnApplyProductListData = (pager: number) => {
  return post('/pro/returnApplyProductListData', { pager })
}

export const returnOutProductListData = (pager: number) => {
  return post('/pro/returnOutProductListData', { pager })
}
