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
