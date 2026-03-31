/**
 * 模块说明：
 * 1. 用户信息 store。
 * 2. 统一保存当前登录用户的基础资料，避免页面反复从接口结果里解构字段。
 * 3. 登录后和刷新恢复时，页面都会依赖这里的状态。
 */

import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/userinfor'
import { ref } from 'vue'
import type { SessionUserProfile } from '@/http/response'

export const useUserInfo = defineStore(
  'userinfo',
  () => {
    const id = ref<number>(0)
    const account = ref<string>('')
    const name = ref<string>('')
    const sex = ref<string>('')
    const imageUrl = ref<string>('')
    const identity = ref<string>('')
    const department = ref<string>('')
    const email = ref<string>('')

    // 拉取用户详情后直接拆成字段状态，页面层只消费扁平数据。
    const userInfo = async (userId: number) => {
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

    // 会话恢复和登录成功都直接复用这套字段同步逻辑。
    const applyProfile = (profile: SessionUserProfile) => {
      id.value = profile.id
      imageUrl.value = profile.image_url
      identity.value = profile.identity
      account.value = profile.account
      name.value = profile.name
      sex.value = profile.sex
      department.value = profile.department
      email.value = profile.email
    }

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
