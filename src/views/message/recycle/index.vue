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
        :page-size="1"
        :current-page="paginationData.recycleCurrentPage"
        :pager-count="7"
        :total="paginationData.recycleTotal"
        :page-count="paginationData.recyclePageCount"
        layout="prev, pager, next"
        @current-change="recycleCurrentChange"
      />
    </div>
  </div>
  <renewAndDelete ref="rad" @success="getRecycleFirstPageList" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import breadCrumb from '@/components/bread_crumb.vue'
import { getRecycleMessageLength, returnRecycleListData } from '@/api/message'
import renewAndDelete from '../components/delete.vue'

interface RecycleRow {
  id: number
  message_title?: string
  message_category?: string
  message_publish_department?: string
  message_receipt_object?: string
  message_delete_time?: string
}

const breadcrumb = ref()
const item = ref({
  first: '消息管理',
  second: '回收站',
})

const tableData = ref<RecycleRow[]>([])
const rad = ref()

const paginationData = reactive({
  recycleTotal: 0,
  recyclePageCount: 0,
  recycleCurrentPage: 1,
})

const loadRecycleLength = async () => {
  const res = await getRecycleMessageLength()
  const total = Array.isArray(res) ? res.length : 0
  paginationData.recycleTotal = total
  paginationData.recyclePageCount = Math.max(1, Math.ceil(total / 10))
}

const getRecycleFirstPageList = async () => {
  tableData.value = (await returnRecycleListData(1)) as RecycleRow[]
}

const recycleCurrentChange = async (value: number) => {
  paginationData.recycleCurrentPage = value
  tableData.value = (await returnRecycleListData(value)) as RecycleRow[]
}

const renew = (row: RecycleRow) => {
  rad.value.openRecover(row)
}

const realDelete = (id: number) => {
  rad.value.openRealDelete(id)
}

onMounted(async () => {
  await Promise.all([loadRecycleLength(), getRecycleFirstPageList()])
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
