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

// 列表查询和总数接口拆开，方便页面分别驱动表格与分页器。
export const getProductList = () => {
  return post('/pro/getProductList')
}

export const applyOutProduct = (data: Record<string, unknown>) => {
  const { id, ...rest } = data
  return post('/pro/applyOutProduct', { id, ...rest })
}

export const applyProductList = () => {
  return post('/pro/applyProductList')
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
export const searchProductForId = (product_id: number) => {
  return post('/pro/searchProductForId', { product_id })
}

export const searchProductForApplyId = (product_out_id: number) => {
  return post('/pro/searchProductForApplyId', { product_out_id })
}

export const searchProductForOutId = (product_out_id: number) => {
  return post('/pro/searchProductForOutId', { product_out_id })
}

export const getProductLength = () => {
  return post('/pro/getProductLength')
}

export const getApplyProductLength = () => {
  return post('/pro/getApplyProductLength')
}

export const auditProductList = () => {
  return post('/pro/auditProductList')
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
