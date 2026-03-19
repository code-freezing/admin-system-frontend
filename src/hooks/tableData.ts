import { getAdminListLength, returnListData, searchUser } from '@/api/userinfor'
import { reactive, ref } from 'vue'

type TableRow = Record<string, unknown>

interface AdminLengthResponse {
  length?: number
}

const toRows = <T>(value: unknown): T[] => {
  return Array.isArray(value) ? (value as T[]) : []
}

export const useTable = (identity: string) => {
  const paginationData = reactive({
    pageCount: 1,
    currentPage: 1,
  })
  const adminTotal = ref(0)
  const adminAccount = ref<number | string | undefined>(undefined)
  const tableData = ref<TableRow[]>([])

  const syncTotalCount = async () => {
    const res = (await getAdminListLength(identity)) as AdminLengthResponse | number
    const total = Number((res as AdminLengthResponse)?.length ?? 0)

    adminTotal.value = total
    paginationData.pageCount = Math.max(1, Math.ceil(total / 10))
  }

  const loadPage = async (page: number) => {
    const list = await returnListData(page, identity)
    tableData.value = toRows<TableRow>(list)
  }

  const getFirstPageList = async () => {
    paginationData.currentPage = 1
    await syncTotalCount()
    await loadPage(1)
  }

  const currentChange = async (value: number) => {
    paginationData.currentPage = value
    await loadPage(value)
  }

  const searchAdmin = async () => {
    if (adminAccount.value === undefined || adminAccount.value === '') {
      await loadPage(paginationData.currentPage)
      return
    }

    const list = await searchUser(Number(adminAccount.value), identity)
    tableData.value = toRows<TableRow>(list)
  }

  const clearInput = async () => {
    await loadPage(paginationData.currentPage)
  }

  const refreshTable = async (action: 'create' | 'edit' | 'delete' = 'edit') => {
    await syncTotalCount()

    const list = await returnListData(paginationData.currentPage, identity)
    const normalizedList = toRows<TableRow>(list)

    if (action === 'delete' && normalizedList.length === 0 && paginationData.currentPage > 1) {
      paginationData.currentPage -= 1
      await loadPage(paginationData.currentPage)
      await syncTotalCount()
      return
    }

    tableData.value = normalizedList
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
