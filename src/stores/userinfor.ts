import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/userinfor'
import { ref } from 'vue'

interface UserProfilePayload {
  image_url?: string
  identity?: string
  account?: string
  name?: string
  sex?: string
  department?: string
  email?: string
}

type UserProfileResponse =
  | {
      results?: UserProfilePayload
      data?: UserProfilePayload
    }
  | UserProfilePayload
  | null
  | undefined

// 后端不同接口返回结构不完全统一，这里先做一次格式归一化。
const resolveProfile = (value: UserProfileResponse): UserProfilePayload => {
  if (!value) {
    return {}
  }

  if ('results' in value && value.results) {
    return value.results
  }

  if ('data' in value && value.data) {
    return value.data
  }

  return value as UserProfilePayload
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
      const res = (await getUserInfo(userId)) as UserProfileResponse
      const data = resolveProfile(res)

      imageUrl.value = data.image_url ?? ''
      identity.value = data.identity ?? ''
      account.value = data.account ?? ''
      name.value = data.name ?? ''
      sex.value = data.sex ?? ''
      department.value = data.department ?? ''
      email.value = data.email ?? ''
      id.value = userId
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
      userInfo,
    }
  },
  {
    persist: true,
  },
)
