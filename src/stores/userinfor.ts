import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/userinfor'
import { ref } from 'vue'

export const useUserInfo = defineStore(
  'userinfo',
  () => {
    // 记录当前状态，方便后续逻辑统一读取和更新。
    const id = ref(0)
    // 记录当前状态，方便后续逻辑统一读取和更新。
    const account = ref('')
    // 记录名称，方便后续逻辑统一读取和更新。
    const name = ref('')
    // 记录当前状态，方便后续逻辑统一读取和更新。
    const sex = ref('')
    // 记录当前状态，方便后续逻辑统一读取和更新。
    const imageUrl = ref('')
    // 记录当前状态，方便后续逻辑统一读取和更新。
    const identity = ref('')
    // 记录部门，方便后续逻辑统一读取和更新。
    const department = ref('')
    // 记录当前状态，方便后续逻辑统一读取和更新。
    const email = ref('')

    // 处理用户信息，把当前模块的关键逻辑集中在这里。
    const userInfo = async (userId) => {
      const res = await getUserInfo(userId)
      const data = res.data

      id.value = data.id
      imageUrl.value = data.image_url
      identity.value = data.identity
      account.value = data.account
      name.value = data.name
      sex.value = data.sex
      department.value = data.department
      email.value = data.email
    }

    const applyProfile = (profile = {}) => {
      id.value = profile.id || 0
      imageUrl.value = profile.image_url || ''
      identity.value = profile.identity || ''
      account.value = profile.account || ''
      name.value = profile.name || ''
      sex.value = profile.sex || ''
      department.value = profile.department || ''
      email.value = profile.email || ''
    }

    // 重置当前状态，把当前流程恢复到干净初始状态。
    const reset = () => {
      id.value = 0
      account.value = ''
      name.value = ''
      sex.value = ''
      imageUrl.value = ''
      identity.value = ''
      department.value = ''
      email.value = ''
    }

    return {
      id,
      account,
      name,
      sex,
      imageUrl,
      identity,
      department,
      email,
      applyProfile,
      reset,
      userInfo,
    }
  },
  {
    persist: true,
  },
)
