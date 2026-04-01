import { post } from './request'
import { result, toArray, toJsonStringArray, toStringData } from '@/http/response'

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getAllSwiper = () =>
  post('/set/getAllSwiper').then((raw) => result(raw, toArray(raw)))

// 获取名称，让后续逻辑统一使用这一份结果。
export const getCompanyName = () =>
  post('/set/getCompanyName').then((raw) => result(raw, toStringData(raw)))

// 处理名称，把当前模块的关键逻辑集中在这里。
export const changeCompanyName = (set_value) =>
  post('/set/changeCompanyName', { set_value }).then((raw) => result(raw, null))

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const changeCompanyIntroduce = (set_text, set_name) =>
  post('/set/changeCompanyIntroduce', { set_text, set_name }).then((raw) => result(raw, null))

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getCompanyIntroduce = (set_name) =>
  post('/set/getCompanyIntroduce', { set_name }).then((raw) => result(raw, toStringData(raw)))

// 获取当前结果，让后续逻辑统一使用这一份数据。
export const getAllCompanyIntroduce = () =>
  post('/set/getAllCompanyIntroduce').then((raw) => result(raw, toArray(raw)))

// 更新部门，避免状态分散在多个位置维护。
export const setDepartment = (data) =>
  post('/set/setDepartment', { set_value: data }).then((raw) => result(raw, null))

// 获取部门，让后续逻辑统一使用这一份结果。
export const getDepartment = () =>
  post('/set/getDepartment').then((raw) => result(raw, toJsonStringArray(raw)))

// 更新产品，避免状态分散在多个位置维护。
export const setProduct = (data) =>
  post('/set/setProduct', { set_value: data }).then((raw) => result(raw, null))

// 获取产品，让后续逻辑统一使用这一份结果。
export const getProduct = () =>
  post('/set/getProduct').then((raw) => result(raw, toJsonStringArray(raw)))
