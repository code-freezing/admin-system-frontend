/**
 * 模块说明：
 * 1. 系统设置接口封装。
 * 2. 提供公司信息、轮播图、富文本配置等后台设置页需要的请求。
 * 3. 首页展示的数据也会间接依赖这一层维护的配置。
 */

import { post } from './request'
import { toApiResult, toArray, toJsonStringArray, toStringData, type ApiResult } from '@/http/response'

export interface CompanySettingItem {
  id: number
  set_name: string
  set_value: string | null
  set_text: string
}

// 系统设置集中管理轮播图、公司信息、部门和产品分类配置。
export const getAllSwiper = () => {
  return post<ApiResult<string[]>>('/set/getAllSwiper').then((raw) => {
    return toApiResult(raw, toArray<string>(raw))
  })
}

export const getCompanyName = () => {
  return post<ApiResult<string>>('/set/getCompanyName').then((raw) => {
    return toApiResult(raw, toStringData(raw))
  })
}

export const changeCompanyName = (set_value: string) => {
  return post<ApiResult<null>>('/set/changeCompanyName', { set_value }).then((raw) => {
    return toApiResult(raw, null)
  })
}

// 公司简介按 set_name 区分不同配置项，前端只传当前编辑项的值。
export const changeCompanyIntroduce = (set_text: string, set_name: string) => {
  return post<ApiResult<null>>('/set/changeCompanyIntroduce', { set_text, set_name }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const getCompanyIntroduce = (set_name: string) => {
  return post<ApiResult<string>>('/set/getCompanyIntroduce', { set_name }).then((raw) => {
    return toApiResult(raw, toStringData(raw))
  })
}

export const getAllCompanyIntroduce = () => {
  return post<ApiResult<CompanySettingItem[]>>('/set/getAllCompanyIntroduce').then((raw) => {
    return toApiResult(raw, toArray<CompanySettingItem>(raw))
  })
}

// 部门和产品配置既可能是字符串，也可能是数组序列化后的结果。
export const setDepartment = (data: string | string[]) => {
  return post<ApiResult<null>>('/set/setDepartment', { set_value: data }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const getDepartment = () => {
  return post<ApiResult<string[]>>('/set/getDepartment').then((raw) => {
    return toApiResult(raw, toJsonStringArray(raw))
  })
}

export const setProduct = (data: string | string[]) => {
  return post<ApiResult<null>>('/set/setProduct', { set_value: data }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const getProduct = () => {
  return post<ApiResult<string[]>>('/set/getProduct').then((raw) => {
    return toApiResult(raw, toJsonStringArray(raw))
  })
}
