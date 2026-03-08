import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/userinfor'
import { ref } from 'vue'
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
      const res = (await getUserInfo(userId)) as any
      const data = res?.results ?? res
      imageUrl.value = data?.image_url ?? ''
      identity.value = data?.identity ?? ''
      account.value = data?.account ?? ''
      name.value = data?.name ?? ''
      sex.value = data?.sex ?? ''
      department.value = data?.department ?? ''
      email.value = data?.email ?? ''
      id.value = userId
      console.log(res)
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
