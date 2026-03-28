/**
 * 模块说明：
 * 1. 系统设置接口封装。
 * 2. 提供公司信息、轮播图、富文本配置等后台设置页需要的请求。
 * 3. 首页展示的数据也会间接依赖这一层维护的配置。
 */

import { post } from './request'

// 系统设置集中管理轮播图、公司信息、部门和产品分类配置。
export const getAllSwiper = () => {
  return post('/set/getAllSwiper')
}

export const getCompanyName = () => {
  return post('/set/getCompanyName')
}

export const changeCompanyName = (set_value: string) => {
  return post('/set/changeCompanyName', { set_value })
}

// 公司简介按 set_name 区分不同配置项，前端只传当前编辑项的值。
export const changeCompanyIntroduce = (set_text: string, set_name: string) => {
  return post('/set/changeCompanyIntroduce', { set_text, set_name })
}

export const getCompanyIntroduce = (set_name: string) => {
  return post('/set/getCompanyIntroduce', { set_name })
}

export const getAllCompanyIntroduce = () => {
  return post('/set/getAllCompanyIntroduce')
}

// 部门和产品配置既可能是字符串，也可能是数组序列化后的结果。
export const setDepartment = (data: string | string[]) => {
  return post('/set/setDepartment', { set_value: data })
}

export const getDepartment = () => {
  return post('/set/getDepartment')
}

export const setProduct = (data: string | string[]) => {
  return post('/set/setProduct', { set_value: data })
}

export const getProduct = () => {
  return post('/set/getProduct')
}
