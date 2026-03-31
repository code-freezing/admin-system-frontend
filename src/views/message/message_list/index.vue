<!--
  组件说明：
  1. 消息列表页面。
  2. 负责公告查询、发布、编辑、查看详情和进入回收站等主流程。
  3. 它是消息模块最核心的操作入口。
-->
<template>
  <breadCrumb ref="breadcrumb" :item="item" />
  <div class="module-common-wrapped">
    <div class="module-common-content">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="公司消息" name="first">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped">
                  <el-select
                    v-model="department"
                    placeholder="按发布部门筛选"
                    clearable
                    style="width: 160px"
                    @change="applyCompanyFilters"
                    @clear="applyCompanyFilters"
                  >
                    <el-option
                      v-for="item in departmentData"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                  <el-radio-group
                    v-model="radio2"
                    class="ml-4"
                    style="flex-wrap: nowrap"
                    @change="applyCompanyFilters"
                  >
                    <el-radio label="一般">一般</el-radio>
                    <el-radio label="重要">重要</el-radio>
                    <el-radio label="紧急">紧急</el-radio>
                  </el-radio-group>
                </div>
                <div class="button-wrapped">
                  <el-button type="primary" plain @click="resetCompanyFilters">
                    刷新公司消息
                  </el-button>
                  <el-button type="primary" @click="createMessage(1)">发布公司消息</el-button>
                </div>
              </div>
              <div class="module-common-table">
                <el-table :data="companyTableData" border style="width: 100%">
                  <el-table-column type="index" width="50" />
                  <el-table-column prop="message_title" label="消息标题" width="320" />
                  <el-table-column prop="message_category" label="消息分类" />
                  <el-table-column prop="message_publish_department" label="发布部门" />
                  <el-table-column prop="message_publish_name" label="发布人" />
                  <el-table-column prop="message_receipt_object" label="接收对象" />
                  <el-table-column prop="message_level" label="级别" />
                  <el-table-column prop="message_publish_time" label="发布时间" width="200">
                    <template #default="{ row }">
                      <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="message_update_time" label="更新时间" width="200">
                    <template #default="{ row }">
                      <div>{{ row.message_update_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="message_click_number" label="点击次数" />
                  <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                      <div>
                        <el-button type="success" @click="editMessage(row)">编辑</el-button>
                        <el-button type="danger" @click="deleteMessage(row)">删除</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="table-footer">
              <el-pagination
                :page-size="10"
                :current-page="companyPagination.currentPage"
                :pager-count="7"
                :total="companyTotal"
                :page-count="companyPagination.pageCount"
                layout="prev, pager, next"
                @current-change="companyCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="系统消息" name="second">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped" />
                <div class="button-wrapped">
                  <el-button type="primary" @click="createMessage(2)">发布系统消息</el-button>
                </div>
              </div>
              <div class="module-common-table">
                <el-table :data="systemTableData" border style="width: 100%">
                  <el-table-column type="index" width="50" />
                  <el-table-column prop="message_title" label="消息标题" />
                  <el-table-column prop="message_publish_name" label="发布人" />
                  <el-table-column prop="message_click_number" label="点击次数" />
                  <el-table-column prop="message_publish_time" label="发布时间" width="200">
                    <template #default="{ row }">
                      <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                      <div>
                        <el-button type="success" @click="editSystemMessage(row)">编辑</el-button>
                        <el-button type="danger" @click="deleteSystemMessage(row.id)">
                          删除
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="table-footer">
              <el-pagination
                :page-size="10"
                :current-page="systemPagination.currentPage"
                :pager-count="7"
                :total="systemTotal"
                :page-count="systemPagination.pageCount"
                layout="prev, pager, next"
                @current-change="systemCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <createEdit ref="cre" @success="changeTwoPageList" />
  <deleteM ref="delete_msg" @success="changeTwoPageList" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import breadCrumb from '@/components/bread_crumb.vue'
import { getDepartment } from '@/api/setting'
import { usePagedTable } from '@/hooks/usePagedTable'
import {
  companyMessageList,
  getCompanyMessageLength,
  getSystemMessageLength,
  returnCompanyListData,
  returnSystemListData,
} from '@/api/message'
import createEdit from '../components/create_edit.vue'
import deleteM from '../components/delete.vue'

interface MessageRow {
  id: number
  message_title?: string
  message_publish_name?: string
  message_publish_department?: string
  message_receipt_object?: string
  message_level?: string
  message_publish_time?: string
  message_update_time?: string
  message_click_number?: number
  [key: string]: unknown
}

const breadcrumb = ref()
const item = ref({
  first: '消息管理',
  second: '消息列表',
})

const activeName = ref('first')
const department = ref<string>()
const radio2 = ref<string>()
const departmentData = ref<string[]>([])
const companyFilterSource = ref<MessageRow[]>([])
const {
  tableData: companyTableData,
  total: companyTotal,
  pagination: companyPagination,
  reload: reloadCompanyTab,
  loadPage: companyCurrentChange,
  replaceWithList: replaceCompanyList,
} = usePagedTable<MessageRow>({
  loadList: async (page) => (await returnCompanyListData(page)).data as MessageRow[],
  loadTotal: async () => (await getCompanyMessageLength()).data.length,
})

const {
  tableData: systemTableData,
  total: systemTotal,
  pagination: systemPagination,
  reload: reloadSystemTab,
  loadPage: systemCurrentChange,
} = usePagedTable<MessageRow>({
  loadList: async (page) => (await returnSystemListData(page)).data as MessageRow[],
  loadTotal: async () => (await getSystemMessageLength()).data.length,
})

const loadDepartmentList = async () => {
  // 发布部门来自系统设置里的字典配置，不在页面里写死。
  const res = await getDepartment()
  departmentData.value = res.data
}

const loadCompanyFilterSource = async () => {
  companyFilterSource.value = (await companyMessageList()).data as MessageRow[]
}

const applyCompanyFilters = async () => {
  // 公司消息筛选基于完整列表做前端组合过滤，避免多条件切换时互相覆盖结果。
  if (!department.value && !radio2.value) {
    await reloadCompanyTab()
    return
  }

  if (companyFilterSource.value.length === 0) {
    await loadCompanyFilterSource()
  }

  const filteredList = companyFilterSource.value.filter((message) => {
    const departmentMatched =
      !department.value || message.message_publish_department === department.value
    const levelMatched = !radio2.value || message.message_level === radio2.value

    return departmentMatched && levelMatched
  })

  replaceCompanyList(filteredList)
}

const resetCompanyFilters = async () => {
  department.value = undefined
  radio2.value = undefined
  await reloadCompanyTab()
}

const changeTwoPageList = async () => {
  // 新建、编辑和删除后先清空筛选，再刷新两类消息列表避免残留旧结果。
  department.value = undefined
  radio2.value = undefined
  await Promise.all([loadCompanyFilterSource(), reloadCompanyTab(), reloadSystemTab()])
}

const cre = ref()
const createMessage = (id: number) => {
  cre.value.openCreate(id)
}
const editMessage = (row: MessageRow) => {
  cre.value.openEdit(row)
}
const editSystemMessage = (row: MessageRow) => {
  cre.value.openEditSystem(row)
}

const delete_msg = ref()
const deleteMessage = (row: MessageRow) => {
  // 公司消息删除会把整行传给弹窗，因为回收站逻辑需要更多上下文。
  delete_msg.value.openDelete(row)
}
const deleteSystemMessage = (id: number) => {
  delete_msg.value.openRealDelete(id)
}

onMounted(async () => {
  await Promise.all([
    loadDepartmentList(),
    loadCompanyFilterSource(),
    reloadCompanyTab(),
    reloadSystemTab(),
  ])
})
</script>

<style lang="scss" scoped>
.el-radio-group {
  margin-left: 20px;
}

:deep(.el-table .cell) {
  font-weight: 400;
}
</style>
