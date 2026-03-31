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

export const getAllSwiper = () =>
  post<ApiResult<string[]>>('/set/getAllSwiper').then((raw) => toApiResult(raw, toArray<string>(raw)))

export const getCompanyName = () =>
  post<ApiResult<string>>('/set/getCompanyName').then((raw) => toApiResult(raw, toStringData(raw)))

export const changeCompanyName = (set_value: string) =>
  post<ApiResult<null>>('/set/changeCompanyName', { set_value }).then((raw) => toApiResult(raw, null))

export const changeCompanyIntroduce = (set_text: string, set_name: string) =>
  post<ApiResult<null>>('/set/changeCompanyIntroduce', { set_text, set_name }).then((raw) =>
    toApiResult(raw, null),
  )

export const getCompanyIntroduce = (set_name: string) =>
  post<ApiResult<string>>('/set/getCompanyIntroduce', { set_name }).then((raw) =>
    toApiResult(raw, toStringData(raw)),
  )

export const getAllCompanyIntroduce = () =>
  post<ApiResult<CompanySettingItem[]>>('/set/getAllCompanyIntroduce').then((raw) =>
    toApiResult(raw, toArray<CompanySettingItem>(raw)),
  )

export const setDepartment = (data: string | string[]) =>
  post<ApiResult<null>>('/set/setDepartment', { set_value: data }).then((raw) => toApiResult(raw, null))

export const getDepartment = () =>
  post<ApiResult<string[]>>('/set/getDepartment').then((raw) => toApiResult(raw, toJsonStringArray(raw)))

export const setProduct = (data: string | string[]) =>
  post<ApiResult<null>>('/set/setProduct', { set_value: data }).then((raw) => toApiResult(raw, null))

export const getProduct = () =>
  post<ApiResult<string[]>>('/set/getProduct').then((raw) => toApiResult(raw, toJsonStringArray(raw)))
