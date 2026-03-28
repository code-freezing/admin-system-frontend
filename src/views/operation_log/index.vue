<!--
  组件说明：
  1. 操作日志页面。
  2. 展示后台关键业务操作的审计记录，辅助排查问题和追踪责任。
  3. 前端 tracking 工具写入的内容最终会在这里查看。
-->
<template>
  <breadCrumb ref="breadcrumb" :item="item" />
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <div>
          <el-input
            v-model="name"
            class="w-50 m-2"
            size="large"
            placeholder="按操作人搜索"
            clearable
            @change="searchOperationPerson()"
            @clear="getOperationFirstPageList"
          >
            <template #prefix>
              <Search />
            </template>
          </el-input>
        </div>
        <div class="upload-wrapped">
          <el-button type="danger" @click="clearList">清空操作日志</el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="operation_person" label="操作人">
            <template #default="{ row }">
              <div :class="levelClass(row.operation_level)">
                <span class="person">{{ row.operation_person }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="operation_content" label="操作内容" />
          <el-table-column prop="operation_level" label="操作级别">
            <template #default="{ row }">
              <el-tag class="ml-2" :type="levelTagType(row.operation_level) as any">
                {{ row.operation_level }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="operation_time" label="操作时间" width="200">
            <template #default="{ row }">
              <div>{{ row.operation_time?.slice(0, 16) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-footer">
      <el-pagination
        :page-size="10"
        :current-page="paginationData.operationCurrentPage"
        :pager-count="7"
        :total="paginationData.operationTotal"
        :page-count="paginationData.operationPageCount"
        layout="prev, pager, next"
        @current-change="operationCurrentChange"
      />
    </div>
  </div>
  <tips ref="tip" @success="reloadOperationList" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import breadCrumb from '@/components/bread_crumb.vue'
import tips from './components/tips.vue'
import { operationLogListLength, returnOperationListData, searchOperationLogList } from '@/api/log'

interface OperationRow {
  operation_person?: string
  operation_content?: string
  operation_level?: string
  operation_time?: string
}

const breadcrumb = ref()
const item = ref({
  first: '操作日志',
  second: '',
})

const name = ref('')
const tableData = ref<OperationRow[]>([])
const tip = ref()

const paginationData = reactive({
  operationTotal: 0,
  operationPageCount: 0,
  operationCurrentPage: 1,
})

const loadOperationLength = async () => {
  const res = await operationLogListLength()
  const total = typeof res?.length === 'number' ? res.length : 0
  paginationData.operationTotal = total
  paginationData.operationPageCount = Math.max(1, Math.ceil(total / 10))
}

const getOperationFirstPageList = async () => {
  paginationData.operationCurrentPage = 1
  tableData.value = (await returnOperationListData(1)) as OperationRow[]
}

const operationCurrentChange = async (value: number) => {
  paginationData.operationCurrentPage = value
  tableData.value = (await returnOperationListData(value)) as OperationRow[]
}

const searchOperationPerson = async () => {
  tableData.value = (await searchOperationLogList(name.value.trim())) as OperationRow[]
}

const levelClass = (value?: string) => {
  if (value == '高级' || value == '错误') return 'danger'
  if (value == '中级' || value == '警告') return 'warning'
  return 'normal'
}

const levelTagType = (value?: string) => {
  if (value == '高级' || value == '错误') return 'danger'
  if (value == '中级' || value == '警告') return 'warning'
  return 'info'
}

const clearList = () => {
  tip.value.open()
}

const reloadOperationList = async () => {
  await Promise.all([loadOperationLength(), getOperationFirstPageList()])
}

onMounted(async () => {
  await reloadOperationList()
})
</script>

<style lang="scss" scoped>
:deep(.el-table .cell) {
  font-weight: 400;
}

.person {
  margin-left: 8px;
}

.danger {
  border-left: 2px solid red;
}

.warning {
  border-left: 2px solid yellow;
}

.normal {
  border-left: 0;
}
</style>
