import { defineStore } from 'pinia'
import { getReadListAndStatus, getDepartmentMsgList } from '@/api/dep_msg'
import { ref } from 'vue'

// 使用了setup写法
export const useMsg = defineStore(
  'messageinfor',
  () => {
    const read_list = ref<number[]>([])
    const msg_list = ref<any[]>([])

    const returnReadList = async (id: number) => {
      read_list.value = []
      msg_list.value = []

      const userInfoStr = localStorage.getItem('userinfo')
      const localUserInfo = userInfoStr ? JSON.parse(userInfoStr) : null
      const currentUserdepartment = localUserInfo?.department || localStorage.getItem('department')

      if (!id || !currentUserdepartment) {
        return
      }

      const res = (await getReadListAndStatus(id)) as any
      const department: string | null = currentUserdepartment

      if (!Array.isArray(res) || !res[0]) {
        return
      }

      read_list.value = JSON.parse(res[0].read_list || '[]') as number[]
      msg_list.value = (await getDepartmentMsgList(department as string)) as any
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
