/**
 * 模块说明：
 * 1. 部门消息 store。
 * 2. 统一保存当前用户的已读列表和部门消息列表，供顶部消息入口复用。
 * 3. 把部门解析和两类请求整合到 store 中，减少页面重复代码。
 */

import { defineStore } from 'pinia'
import { getReadListAndStatus, getDepartmentMsgList } from '@/api/dep_msg'
import { ref } from 'vue'
import { useUserInfo } from './userinfor'

interface DepartmentMessageItem {
  [key: string]: unknown
}

export const useMsg = defineStore(
  'messageinfor',
  () => {
    const read_list = ref<number[]>([])
    const msg_list = ref<DepartmentMessageItem[]>([])

    const getCurrentDepartment = () => useUserInfo().department

    const returnReadList = async (id = useUserInfo().id) => {
      read_list.value = []
      msg_list.value = []

      const currentDepartment = getCurrentDepartment()

      if (!id || !currentDepartment) {
        return
      }

      const res = await getReadListAndStatus(id)
      if (!res.data[0]) {
        return
      }

      const firstRow = res.data[0]
      read_list.value = JSON.parse(firstRow.read_list || '[]') as number[]

      // 顶部消息入口依赖已读列表和部门消息两套数据，这里统一一次性拉回。
      const departmentMessages = await getDepartmentMsgList(currentDepartment)
      msg_list.value = departmentMessages.data
    }

    const reset = () => {
      read_list.value = []
      msg_list.value = []
    }

    return {
      read_list,
      msg_list,
      reset,
      returnReadList,
    }
  },
  {
    persist: true,
  },
)
