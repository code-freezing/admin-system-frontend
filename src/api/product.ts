import { post } from './request'

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

export const auditProduct = (data: Record<string, unknown>) => {
  const { id, ...rest } = data
  return post('/pro/auditProduct', { id, ...rest })
}

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
