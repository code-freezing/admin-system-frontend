<template>
  <breadCrumb ref="breadcrumb" :item="item" />
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-content">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column label="消息标题" prop="message_title" />
          <el-table-column label="消息分类" prop="message_category" />
          <el-table-column label="发布部门" prop="message_publish_department" />
          <el-table-column label="接收对象" prop="message_receipt_object" />
          <el-table-column label="删除时间" prop="message_delete_time">
            <template #default="{ row }">
              <div>{{ row.message_delete_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div>
                <el-button type="success" @click="renew(row)">恢复</el-button>
                <el-button type="danger" @click="realDelete(row.id)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-footer">
      <el-pagination
        :page-size="10"
        :current-page="recyclePagination.currentPage"
        :pager-count="7"
        :total="recycleTotal"
        :page-count="recyclePagination.pageCount"
        layout="prev, pager, next"
        @current-change="recycleCurrentChange"
      />
    </div>
  </div>
  <renewAndDelete ref="rad" @success="reloadRecycleList" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import breadCrumb from '@/components/bread_crumb.vue'
import { getRecycleMessageLength, returnRecycleListData } from '@/api/message'
import { usePagedTable } from '@/hooks/usePagedTable'
import renewAndDelete from '../components/delete.vue'

// 记录当前状态，方便后续逻辑统一读取和更新。
const breadcrumb = ref()
// 记录单项数据，方便后续逻辑统一读取和更新。
const item = ref({
  first: '消息管理',
  second: '回收站',
})

// 记录当前状态，方便后续逻辑统一读取和更新。
const rad = ref()
const {
  tableData,
  total: recycleTotal,
  pagination: recyclePagination,
  loadPage: recycleCurrentChange,
  reload: reloadRecycleList,
} = usePagedTable({
  // 回收站页只关心软删除消息，恢复和永久删除都复用 delete 弹窗里的动作。
  loadList: async (page) => (await returnRecycleListData(page)).data,
  loadTotal: async () => (await getRecycleMessageLength()).data.length,
})

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const renew = (row) => {
  // 恢复和永久删除都交给同一个确认弹窗处理，页面只负责刷新回收站列表。
  rad.value.openRecover(row)
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const realDelete = (id) => {
  rad.value.openRealDelete(id)
}

// 页面首次进入后从这里拉起首屏数据或初始化流程。
onMounted(async () => {
  await reloadRecycleList()
})
</script>

<style lang="scss" scoped>
.table-wrapped {
  padding: 8px;
  height: calc(100vh - 101px);
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .table-top {
    display: flex;
    flex-direction: column;

    .table-content {
      padding: 10px 20px 20px;
      margin-bottom: 8px;
      background: #fff;
    }
  }

  .table-footer {
    display: flex;
    justify-content: flex-end;
    background: #fff;
  }
}

:deep(.el-table .cell) {
  font-weight: 400;
}
</style>
