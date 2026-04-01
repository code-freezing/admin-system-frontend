import { defineStore } from 'pinia'
import { getReadListAndStatus, getDepartmentMsgList } from '@/api/dep_msg'
import { ref } from 'vue'
import { useUserInfo } from './userinfor'

export const useMsg = defineStore(
  'messageinfor',
  () => {
    // 记录已读信息列表，方便后续逻辑统一读取和更新。
    const read_list = ref([])
    // 记录消息列表，方便后续逻辑统一读取和更新。
    const msg_list = ref([])

    // 获取当前状态部门，让后续逻辑统一使用这一份结果。
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

      read_list.value = JSON.parse(res.data[0].read_list || '[]')
      const departmentMessages = await getDepartmentMsgList(currentDepartment)
      msg_list.value = departmentMessages.data
    }

    // 重置当前状态，把当前流程恢复到干净初始状态。
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
