import { post } from './request'

export const getAllSwiper = () => {
  return post('/set/getAllSwiper')
}

export const getCompanyName = () => {
  return post('/set/getCompanyName')
}

export const changeCompanyName = (set_value: string) => {
  return post('/set/changeCompanyName', { set_value })
}

export const changeCompanyIntroduce = (set_text: string, set_name: string) => {
  return post('/set/changeCompanyIntroduce', { set_text, set_name })
}

export const getCompanyIntroduce = (set_name: string) => {
  return post('/set/getCompanyIntroduce', { set_name })
}

export const getAllCompanyIntroduce = () => {
  return post('/set/getAllCompanyIntroduce')
}

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
