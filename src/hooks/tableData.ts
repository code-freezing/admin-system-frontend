import { getAdminListLength, returnListData, searchUser } from '@/api/userinfor'
import { ref } from 'vue'
import { usePagedTable } from './usePagedTable'

// 提供表格数据，让调用方通过统一入口复用这段逻辑。
export const useTable = (identity) => {
  // 记录当前状态，方便后续逻辑统一读取和更新。
  const adminAccount = ref()
  const {
    tableData,
    total: adminTotal,
    pagination: paginationData,
    syncTotal: syncTotalCount,
    loadPage,
    loadFirstPage: getFirstPageList,
    replaceWithList,
  } = usePagedTable({
    loadList: async (page) => {
      const list = await returnListData(page, identity)
      return list.data
    },
    loadTotal: async () => {
      const res = await getAdminListLength(identity)
      return res.data.length
    },
  })

  // 处理当前状态，把当前模块的关键逻辑集中在这里。
  const currentChange = async (value) => loadPage(value)

  // 按当前条件查询结果，避免页面层重复拼接筛选逻辑。
  const searchAdmin = async () => {
    if (adminAccount.value === undefined || adminAccount.value === '') {
      await getFirstPageList()
      return
    }

    const list = await searchUser(String(adminAccount.value).trim(), identity)
    replaceWithList(list.data)
  }

  // 清理当前状态，防止旧数据残留到下一次流程。
  const clearInput = async () => {
    await getFirstPageList()
  }

  const refreshTable = async (action: 'create' | 'edit' | 'delete' = 'edit') => {
    // 删除导致当前页空表时回退一页，避免分页器停在已经无数据的页码上。
    await syncTotalCount()

    const list = await returnListData(paginationData.currentPage, identity)
    const normalizedList = list.data

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
