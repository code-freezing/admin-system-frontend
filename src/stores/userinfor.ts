/**
 * 模块说明：
 * 1. 用户信息 store。
 * 2. 统一保存当前登录用户的基础资料，避免页面反复从接口结果里解构字段。
 * 3. 登录后和刷新恢复时，页面都会依赖这里的状态。
 */

import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/userinfor'
import { ref } from 'vue'

interface UserProfilePayload {
  id?: number
  image_url?: string
  identity?: string
  account?: string
  name?: string
  sex?: string
  department?: string
  email?: string
}

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

    // 拉取用户详情后，把页面常用字段拆到独立 ref，避免页面每次都手动解构。
    const userInfo = async (userId: number) => {
      const res = await getUserInfo(userId)
      const data = res.data

      id.value = data.id ?? userId
      imageUrl.value = data.image_url ?? ''
      identity.value = data.identity ?? ''
      account.value = typeof data.account === 'string' ? data.account : String(data.account ?? '')
      name.value = data.name ?? ''
      sex.value = data.sex ?? ''
      department.value = data.department ?? ''
      email.value = data.email ?? ''
    }

    const applyProfile = (profile: UserProfilePayload) => {
      id.value = profile.id ?? 0
      imageUrl.value = profile.image_url ?? ''
      identity.value = profile.identity ?? ''
      account.value = typeof profile.account === 'string' ? profile.account : String(profile.account ?? '')
      name.value = profile.name ?? ''
      sex.value = profile.sex ?? ''
      department.value = profile.department ?? ''
      email.value = profile.email ?? ''
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
