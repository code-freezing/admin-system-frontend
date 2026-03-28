/**
 * 模块说明：
 * 1. 产品出入库模块接口封装。
 * 2. 负责产品入库、出库申请、审核、分页和查询等库存业务请求。
 * 3. 产品列表页和审核弹窗都会复用这里的方法。
 */

import { post } from './request'
import { toApiResult, toArray, toLengthData, type ApiResult } from '@/http/response'

export interface ProductRow {
  id: number
  product_id?: string | number
  product_name?: string
  product_category?: string
  product_unit?: string
  product_in_warehouse_number?: number
  product_single_price?: number
  product_all_price?: number
  product_create_person?: string
  product_create_time?: string
  product_update_time?: string
  in_memo?: string
  product_out_status?: string
  product_out_id?: string | number
  product_out_number?: number
  product_out_price?: number
  product_out_apply_person?: string
  product_out_apply_user_id?: number
  product_out_apply_account?: string
  apply_memo?: string
  audit_memo?: string
  product_apply_time?: string
  product_audit_time?: string
  product_out_audit_person?: string
  [key: string]: unknown
}

// 产品接口覆盖入库、出库申请、审批和分页查询，保持和后端路由一一对应。
export const createProduct = (data: Record<string, unknown>) => {
  const { product_id, ...rest } = data
  return post<ApiResult<null>>('/pro/createProduct', { product_id, ...rest }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const deleteProduct = (id: number) => {
  return post<ApiResult<null>>('/pro/deleteProduct', { id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const editProduct = (data: Record<string, unknown>) => {
  const { id, ...rest } = data
  return post<ApiResult<null>>('/pro/editProduct', { id, ...rest }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const applyOutProduct = (data: Record<string, unknown>) => {
  const { id, ...rest } = data
  return post<ApiResult<null>>('/pro/applyOutProduct', { id, ...rest }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const withdrawApplyProduct = (id: number) => {
  return post<ApiResult<null>>('/pro/withdrawApplyProduct', { id }).then((raw) => {
    return toApiResult(raw, null)
  })
}

// 审批接口会根据传入状态决定是同意出库还是驳回申请。
export const auditProduct = (data: Record<string, unknown>) => {
  const { id, ...rest } = data
  return post<ApiResult<null>>('/pro/auditProduct', { id, ...rest }).then((raw) => {
    return toApiResult(raw, null)
  })
}

// 搜索接口按不同业务编号拆分，避免页面拼接复杂条件。
export const searchProductForId = (product_id: string | number) => {
  return post<ApiResult<ProductRow[]>>('/pro/searchProductForId', { product_id }).then((raw) => {
    return toApiResult(raw, toArray<ProductRow>(raw))
  })
}

export const searchProductForApplyId = (product_out_id: string | number) => {
  return post<ApiResult<ProductRow[]>>('/pro/searchProductForApplyId', { product_out_id }).then((raw) => {
    return toApiResult(raw, toArray<ProductRow>(raw))
  })
}

export const searchProductForOutId = (product_out_id: string | number) => {
  return post<ApiResult<ProductRow[]>>('/pro/searchProductForOutId', { product_out_id }).then((raw) => {
    return toApiResult(raw, toArray<ProductRow>(raw))
  })
}

export const getProductLength = () => {
  return post<ApiResult<{ length: number }>>('/pro/getProductLength').then((raw) => {
    return toApiResult(raw, toLengthData(raw))
  })
}

export const getApplyProductLength = () => {
  return post<ApiResult<{ length: number }>>('/pro/getApplyProductLength').then((raw) => {
    return toApiResult(raw, toLengthData(raw))
  })
}

export const getOutProductLength = () => {
  return post<ApiResult<{ length: number }>>('/pro/getOutProductLength').then((raw) => {
    return toApiResult(raw, toLengthData(raw))
  })
}

export const returnProductListData = (pager: number) => {
  return post<ApiResult<ProductRow[]>>('/pro/returnProductListData', { pager }).then((raw) => {
    return toApiResult(raw, toArray<ProductRow>(raw))
  })
}

export const returnApplyProductListData = (pager: number) => {
  return post<ApiResult<ProductRow[]>>('/pro/returnApplyProductListData', { pager }).then((raw) => {
    return toApiResult(raw, toArray<ProductRow>(raw))
  })
}

export const returnOutProductListData = (pager: number) => {
  return post<ApiResult<ProductRow[]>>('/pro/returnOutProductListData', { pager }).then((raw) => {
    return toApiResult(raw, toArray<ProductRow>(raw))
  })
}
