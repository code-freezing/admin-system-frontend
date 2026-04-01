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
              <el-tag class="ml-2" :type="levelTagType(row.operation_level)">
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

// 记录当前状态，方便后续逻辑统一读取和更新。
const breadcrumb = ref()
// 记录单项数据，方便后续逻辑统一读取和更新。
const item = ref({
  first: '操作日志',
  second: '',
})

// 记录名称，方便后续逻辑统一读取和更新。
const name = ref('')
// 记录表格数据数据，方便后续逻辑统一读取和更新。
const tableData = ref([])
// 记录当前状态，方便后续逻辑统一读取和更新。
const tip = ref()

// 记录数据，方便后续逻辑统一读取和更新。
const paginationData = reactive({
  operationTotal: 0,
  operationPageCount: 0,
  operationCurrentPage: 1,
})

// 加载当前数据，让后续逻辑直接复用准备好的结果。
const loadOperationLength = async () => {
  // 总数单独维护，保持和当前操作日志分页组件的计算方式一致。
  const res = await operationLogListLength()
  const total = res.data.length
  paginationData.operationTotal = total
  paginationData.operationPageCount = Math.max(1, Math.ceil(total / 10))
}

// 获取页码列表，让后续逻辑统一使用这一份结果。
const getOperationFirstPageList = async () => {
  paginationData.operationCurrentPage = 1
  tableData.value = (await returnOperationListData(1)).data
}

// 处理当前状态，把当前模块的关键逻辑集中在这里。
const operationCurrentChange = async (value) => {
  paginationData.operationCurrentPage = value
  tableData.value = (await returnOperationListData(value)).data
}

// 按当前条件查询结果，避免页面层重复拼接筛选逻辑。
const searchOperationPerson = async () => {
  tableData.value = (await searchOperationLogList(name.value.trim())).data
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const levelClass = (value) => {
  // 左侧色条和标签类型都基于同一套级别语义，先在这里统一归类。
  if (value == '高级' || value == '错误') return 'danger'
  if (value == '中级' || value == '警告') return 'warning'
  return 'normal'
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const levelTagType = (value) => {
  if (value == '高级' || value == '错误') return 'danger'
  if (value == '中级' || value == '警告') return 'warning'
  return 'info'
}

// 清理列表，防止旧状态残留到下一次流程。
const clearList = () => {
  tip.value.open()
}

// 处理列表，把当前模块的关键逻辑集中在这里。
const reloadOperationList = async () => {
  await Promise.all([loadOperationLength(), getOperationFirstPageList()])
}

// 页面首次进入后从这里拉起首屏数据或初始化流程。
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
