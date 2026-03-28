/**
 * 模块说明：
 * 1. 轻量分页表格 hook。
 * 2. 负责维护列表数据、总数、页码和“回到第一页后重载”这类通用状态。
 * 3. 只抽离重复的分页脚手架，不接管页面自己的业务筛选和弹窗逻辑。
 */

import { reactive, ref } from 'vue'

type LoadListFn<T> = (page: number) => Promise<T[]>
type LoadTotalFn = () => Promise<number>

interface UsePagedTableOptions<T> {
  loadList: LoadListFn<T>
  loadTotal?: LoadTotalFn
  pageSize?: number
}

export const usePagedTable = <T>(options: UsePagedTableOptions<T>) => {
  const pageSize = options.pageSize ?? 10
  const tableData = ref<T[]>([])
  const total = ref(0)
  const pagination = reactive({
    currentPage: 1,
    pageCount: 1,
  })

  const syncTotal = async () => {
    if (!options.loadTotal) {
      total.value = tableData.value.length
      pagination.pageCount = Math.max(1, Math.ceil(total.value / pageSize))
      return total.value
    }

    total.value = await options.loadTotal()
    pagination.pageCount = Math.max(1, Math.ceil(total.value / pageSize))
    return total.value
  }

  const loadPage = async (page = pagination.currentPage) => {
    pagination.currentPage = page
    tableData.value = await options.loadList(page)
    return tableData.value
  }

  const loadFirstPage = async () => loadPage(1)

  const reload = async () => {
    await Promise.all([syncTotal(), loadFirstPage()])
  }

  const replaceWithList = (list: T[]) => {
    tableData.value = list
    total.value = list.length
    pagination.currentPage = 1
    pagination.pageCount = 1
  }

  return {
    tableData,
    total,
    pagination,
    syncTotal,
    loadPage,
    loadFirstPage,
    reload,
    replaceWithList,
  }
}
