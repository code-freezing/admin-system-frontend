import { defineStore } from 'pinia'
import { getReadListAndStatus, getDepartmentMsgList } from '@/api/dep_msg'
import { ref } from 'vue'

interface DepartmentMessageItem {
  [key: string]: unknown
}

interface ReadStatusItem {
  read_list?: string
}

export const useMsg = defineStore(
  'messageinfor',
  () => {
    const read_list = ref<number[]>([])
    const msg_list = ref<DepartmentMessageItem[]>([])

    // 部门消息接口依赖当前用户所在部门，这里统一从持久化用户信息里取。
    const getCurrentDepartment = () => {
      const userInfoStr = localStorage.getItem('userinfo')
      const localUserInfo = userInfoStr ? JSON.parse(userInfoStr) : null
      return localUserInfo?.department || localStorage.getItem('department')
    }

    const returnReadList = async (id: number) => {
      read_list.value = []
      msg_list.value = []

      const currentDepartment = getCurrentDepartment()

      if (!id || !currentDepartment) {
        return
      }

      const res = (await getReadListAndStatus(id)) as unknown
      if (!Array.isArray(res) || !res[0]) {
        return
      }

      const firstRow = res[0] as ReadStatusItem
      read_list.value = JSON.parse(firstRow.read_list || '[]') as number[]

      // 读列表和部门消息是两套来源，这里在一个动作里一起拉回 store。
      const departmentMessages = await getDepartmentMsgList(currentDepartment)
      msg_list.value = Array.isArray(departmentMessages)
        ? (departmentMessages as DepartmentMessageItem[])
        : []
    }

    return {
      read_list,
      msg_list,
      returnReadList,
    }
  },
  {
    persist: true,
  },
)
