import { reactive, ref } from 'vue'

// 提供表格数据，让调用方通过统一入口复用这段逻辑。
export const usePagedTable = (options) => {
  const pageSize = options.pageSize || 10
  // 记录表格数据数据，方便后续逻辑统一读取和更新。
  const tableData = ref([])
  // 记录总数，方便后续逻辑统一读取和更新。
  const total = ref(0)
  // 记录当前状态，方便后续逻辑统一读取和更新。
  const pagination = reactive({
    currentPage: 1,
    pageCount: 1,
  })

  // 同步总数，避免本地状态和服务端结果出现偏差。
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

  // 加载页码，让后续逻辑直接复用准备好的数据。
  const loadFirstPage = async () => loadPage(1)

  // 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
  const reload = async () => {
    await Promise.all([syncTotal(), loadFirstPage()])
  }

  // 处理列表，把当前模块的关键逻辑集中在这里。
  const replaceWithList = (list) => {
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
