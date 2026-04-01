import { post } from './request'
import { getArrayField, getNumberField, result, toArray } from '@/http/response'

// 获取部门消息，让后续逻辑统一使用这一份结果。
export const getDepartmentMsg = (id, department) =>
  post('/dm/getDepartmentMsg', { id, department }).then((raw) =>
    result(raw, {
      id: getNumberField(raw, 'id'),
      read_list: getArrayField(raw, 'read_list'),
    }),
  )

// 获取部门消息列表，让后续逻辑统一使用这一份结果。
export const getDepartmentMsgList = (department) =>
  post('/dm/getDepartmentMsgList', { department }).then((raw) => result(raw, toArray(raw)))

// 获取已读信息列表状态，让后续逻辑统一使用这一份结果。
export const getReadListAndStatus = (id) =>
  post('/dm/getReadListAndStatus', { id }).then((raw) => result(raw, toArray(raw)))

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
export const clickDelete = (readId, id) =>
  post('/dm/clickDelete', { readId, id }).then((raw) => result(raw, null))

// 处理用户已读信息列表，把当前模块的关键逻辑集中在这里。
export const changeUserReadList = (newId, department) =>
  post('/dm/changeUserReadList', { newId, department }).then((raw) => result(raw, null))

// 处理用户已读信息列表，把当前模块的关键逻辑集中在这里。
export const changeUserReadListButDelete = (deleteId, department) =>
  post('/dm/changeUserReadListButDelete', { deleteId, department }).then((raw) => result(raw, null))
