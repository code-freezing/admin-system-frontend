import { searchUser, getAdminListLength, returnListData } from '@/api/userinfor'
import { ref, reactive } from 'vue'

export const useTable = (identity: string) => {
  const paginationData = reactive({
    pageCount: 1,
    currentPage: 1,
  })
  const adminTotal = ref<number>(0)
  const adminAccount = ref<number>()
  const tableData = ref<object[]>([])

  const returnAdminListLength = async () => {
    const res = (await getAdminListLength(identity)) as any
    adminTotal.value = res.length
    paginationData.pageCount = Math.max(1, Math.ceil(res.length / 10))
  }

  const loadPage = async (page: number) => {
    tableData.value = (await returnListData(page, identity)) as any
  }

  const getFirstPageList = async () => {
    paginationData.currentPage = 1
    await returnAdminListLength()
    await loadPage(1)
  }

  const currentChange = async (value: number) => {
    paginationData.currentPage = value
    await loadPage(paginationData.currentPage)
  }

  const searchAdmin = async () => {
    tableData.value = (await searchUser(adminAccount.value as number, identity)) as any
  }

  const clearInput = async () => {
    await loadPage(paginationData.currentPage)
  }

  const refreshTable = async (action: 'create' | 'edit' | 'delete' = 'edit') => {
    await returnAdminListLength()
    const list = (await returnListData(paginationData.currentPage, identity)) as any
    if (action === 'delete' && Array.isArray(list) && list.length === 0 && paginationData.currentPage > 1) {
      paginationData.currentPage -= 1
      await loadPage(paginationData.currentPage)
      await returnAdminListLength()
      return
    }

    tableData.value = Array.isArray(list) ? list : []
  }

  getFirstPageList()

  return {
    adminAccount,
    paginationData,
    adminTotal,
    tableData,
    currentChange,
    searchAdmin,
    clearInput,
    refreshTable,
    getFirstPageList,
  }
}
