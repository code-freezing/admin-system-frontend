/**
 * 模块说明：
 * 1. 用户管理表格分页 hook。
 * 2. 封装列表分页、搜索、总数同步和删除后页码回退等通用逻辑。
 * 3. 不同管理员页面只需传入身份类型即可复用这套流程。
 */

import { getAdminListLength, returnListData, searchUser } from '@/api/userinfor'
import { ref } from 'vue'
import { usePagedTable } from './usePagedTable'

type TableRow = Record<string, unknown>

export const useTable = (identity: string) => {
  const adminAccount = ref<number | string | undefined>(undefined)
  const {
    tableData,
    total: adminTotal,
    pagination: paginationData,
    syncTotal: syncTotalCount,
    loadPage,
    loadFirstPage: getFirstPageList,
    replaceWithList,
  } = usePagedTable<TableRow>({
    loadList: async (page) => {
      const list = await returnListData(page, identity)
      return list.data as TableRow[]
    },
    loadTotal: async () => {
      const res = await getAdminListLength(identity)
      return res.data.length
    },
  })

  const currentChange = async (value: number) => {
    await loadPage(value)
  }

  const searchAdmin = async () => {
    if (adminAccount.value === undefined || adminAccount.value === '') {
      await getFirstPageList()
      return
    }

    const list = await searchUser(String(adminAccount.value).trim(), identity)
    replaceWithList(list.data as TableRow[])
  }

  const clearInput = async () => {
    await getFirstPageList()
  }

  const refreshTable = async (action: 'create' | 'edit' | 'delete' = 'edit') => {
    await syncTotalCount()

    const list = await returnListData(paginationData.currentPage, identity)
    const normalizedList = list.data as TableRow[]

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
