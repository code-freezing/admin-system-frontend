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
                    style="width: 160px"
                    @change="getListByDepartment"
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
                    @change="getMessageListByLevel"
                  >
                    <el-radio label="一般">一般</el-radio>
                    <el-radio label="重要">重要</el-radio>
                    <el-radio label="紧急">紧急</el-radio>
                  </el-radio-group>
                </div>
                <div class="button-wrapped">
                  <el-button type="primary" plain @click="getCompanyFirstPageList">
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
                :page-size="1"
                :current-page="paginationData.companyCurrentPage"
                :pager-count="7"
                :total="paginationData.companyTotal"
                :page-count="paginationData.companyPageCount"
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
                :page-size="1"
                :current-page="paginationData.systemCurrentPage"
                :pager-count="7"
                :total="paginationData.systemTotal"
                :page-count="paginationData.systemCount"
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
import { onMounted, reactive, ref } from 'vue'
import breadCrumb from '@/components/bread_crumb.vue'
import { getDepartment } from '@/api/setting'
import {
  searchMessageBydepartment,
  searchMessageByLevel,
  getCompanyMessageLength,
  getSystemMessageLength,
  returnCompanyListData,
  returnSystemListData,
} from '@/api/message'
import createEdit from '../components/create_edit.vue'
import deleteM from '../components/delete.vue'

// 消息列表页分为公司消息和系统消息两个标签页，但都复用同一套弹窗组件。
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
const companyTableData = ref<MessageRow[]>([])
const systemTableData = ref<MessageRow[]>([])

// 两套分页状态分别维护公司消息和系统消息，避免切换标签时互相覆盖。
const paginationData = reactive({
  companyTotal: 0,
  companyPageCount: 0,
  companyCurrentPage: 1,
  systemTotal: 0,
  systemCount: 0,
  systemCurrentPage: 1,
})

const loadDepartmentList = async () => {
  const res = await getDepartment()
  departmentData.value = Array.isArray(res) ? (res as string[]) : []
}

const loadCompanyLength = async () => {
  const res = await getCompanyMessageLength()
  const total = Array.isArray(res) ? res.length : 0
  paginationData.companyTotal = total
  paginationData.companyPageCount = Math.max(1, Math.ceil(total / 10))
}

const loadSystemLength = async () => {
  const res = await getSystemMessageLength()
  const total = Array.isArray(res) ? res.length : 0
  paginationData.systemTotal = total
  paginationData.systemCount = Math.max(1, Math.ceil(total / 10))
}

const getCompanyFirstPageList = async () => {
  companyTableData.value = (await returnCompanyListData(1)) as MessageRow[]
}

const getSystemFirstPageList = async () => {
  systemTableData.value = (await returnSystemListData(1)) as MessageRow[]
}

// 公司消息支持按部门和等级筛选；系统消息列表保持简单展示。
const getListByDepartment = async () => {
  if (!department.value) {
    await getCompanyFirstPageList()
    return
  }
  companyTableData.value = (await searchMessageBydepartment(department.value)) as MessageRow[]
}

const getMessageListByLevel = async () => {
  if (!radio2.value) {
    await getCompanyFirstPageList()
    return
  }
  companyTableData.value = (await searchMessageByLevel(radio2.value)) as MessageRow[]
}

const changeTwoPageList = async () => {
  department.value = undefined
  radio2.value = undefined
  await Promise.all([getCompanyFirstPageList(), getSystemFirstPageList()])
}

const companyCurrentChange = async (value: number) => {
  paginationData.companyCurrentPage = value
  companyTableData.value = (await returnCompanyListData(value)) as MessageRow[]
}

const systemCurrentChange = async (value: number) => {
  paginationData.systemCurrentPage = value
  systemTableData.value = (await returnSystemListData(value)) as MessageRow[]
}

// createEdit 和 deleteM 都是弹窗组件，列表页只负责传入当前行数据。
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
  delete_msg.value.openDelete(row)
}
const deleteSystemMessage = (id: number) => {
  delete_msg.value.openRealDelete(id)
}

onMounted(async () => {
  await Promise.all([
    loadDepartmentList(),
    loadCompanyLength(),
    loadSystemLength(),
    getCompanyFirstPageList(),
    getSystemFirstPageList(),
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
