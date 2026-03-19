<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <!-- wrapper -->
  <div class="module-common-wrapped">
    <div class="module-common-content">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="公告管理" name="first">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped">
                  <el-select
                    v-model="department"
                    placeholder="请选择部门"
                    @change="getListByDepartment"
                    style="width: 160px"
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
                    @change="getMessageListByLevel"
                    style="flex-wrap: nowrap"
                  >
                    <el-radio label="涓€鑸?">涓€鑸?</el-radio>
                    <el-radio label="重要">重要</el-radio>
                    <el-radio label="蹇呰">蹇呰</el-radio>
                  </el-radio-group>
                </div>
                <div class="button-wrapped">
                  <el-button type="primary" plain @click="getCompanyFirstPageList"
                    >全部公告</el-button
                  >
                  <el-button type="primary" @click="createMessage(1)">发布公告</el-button>
                </div>
              </div>
              <!-- 表格部分 -->
              <div class="module-common-table">
                <el-table :data="companyTableData" border style="width: 100%">
                  <el-table-column type="index" width="50"></el-table-column>
                  <el-table-column prop="message_title" label="公告主题" width="320" />
                  <el-table-column prop="message_category" label="类别" />
                  <el-table-column prop="message_publish_department" label="发布部门" />
                  <el-table-column prop="message_publish_name" label="发布人" />
                  <el-table-column prop="message_receipt_object" label="接收对象" />
                  <el-table-column prop="message_level" label="公告等级" />
                  <el-table-column prop="message_publish_time" label="发布时间" width="200">
                    <template #default="{ row }">
                      <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="message_update_time" label="最新编辑时间" width="200">
                    <template #default="{ row }">
                      <div>{{ row.message_update_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="message_click_number" label="阅读人数" />
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
                @current-change="companyCurrentChange"
                layout="prev, pager, next"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="系统消息" name="second">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped"></div>
                <div class="button-wrapped">
                  <el-button type="primary" @click="createMessage(2)">发布系统消息</el-button>
                </div>
              </div>
              <!-- 表格部分 -->
              <div class="module-common-table">
                <el-table :data="systemTableData" border style="width: 100%">
                  <el-table-column type="index" width="50"></el-table-column>
                  <el-table-column prop="message_title" label="消息主题" />
                  <el-table-column prop="message_publish_name" label="鍙戝竷鑰?" />
                  <el-table-column prop="message_click_number" label="阅读人数" />
                  <el-table-column prop="message_publish_time" label="发布时间" width="200">
                    <template #default="{ row }">
                      <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                      <div>
                        <el-button type="success" @click="editSystemMessage(row)">编辑</el-button>
                        <el-button type="danger" @click="deleteSystemMessage(row.id)"
                          >删除</el-button
                        >
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
                @current-change="systemCurrentChange"
                layout="prev, pager, next"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <createEdit ref="cre" @success="changeTwoPageList"></createEdit>
  <deleteM ref="delete_msg" @success="changeTwoPageList"></deleteM>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import breadCrumb from '@/components/bread_crumb.vue'
import {
  searchMessageBydepartment,
  searchMessageByLevel,
  getCompanyMessageLength,
  getSystemMessageLength,
  returnCompanyListData,
  returnSystemListData,
} from '@/api/message'
import { getDepartment } from '@/api/setting'
import createEdit from '../components/create_edit.vue'
import deleteM from '../components/delete.vue'

const breadcrumb = ref()
const item = ref({
  first: '消息管理',
  second: '消息列表',
})
const activeName = ref('first')
const department = ref<string>()
const departmentData = ref<object[]>([])
const companyTableData = ref<object[]>([])
const systemTableData = ref<object[]>([])
const radio2 = ref()

const paginationData = reactive({
  companyTotal: 1,
  companyPageCount: 1,
  companyCurrentPage: 1,
  systemTotal: 1,
  systemCount: 1,
  systemCurrentPage: 1,
})

const getDepartmentList = async () => {
  departmentData.value = (await getDepartment()) as any
}
getDepartmentList()

const getListByDepartment = async () => {
  companyTableData.value = (await searchMessageBydepartment(department.value as string)) as any
}
const getMessageListByLevel = async () => {
  companyTableData.value = (await searchMessageByLevel(radio2.value)) as any
}

const getCompanyListLength = async () => {
  const res = (await getCompanyMessageLength()) as any
  paginationData.companyTotal = res.length
  paginationData.companyPageCount = Math.ceil(res.length / 10)
}
getCompanyListLength()

const getSystemListLength = async () => {
  const res = (await getSystemMessageLength()) as any
  paginationData.systemTotal = res.length
  paginationData.systemCount = Math.ceil(res.length / 10)
}
getSystemListLength()

const getCompanyFirstPageList = async () => {
  companyTableData.value = (await returnCompanyListData(1)) as any
}
getCompanyFirstPageList()

const getSystemFirstPageList = async () => {
  systemTableData.value = (await returnSystemListData(1)) as any
}
getSystemFirstPageList()

const changeTwoPageList = () => {
  department.value = undefined
  radio2.value = null
  getCompanyFirstPageList()
  getSystemFirstPageList()
}

const companyCurrentChange = async (value: number) => {
  paginationData.companyCurrentPage = value
  companyTableData.value = (await returnCompanyListData(paginationData.companyCurrentPage)) as any
}

const systemCurrentChange = async (value: number) => {
  paginationData.systemCurrentPage = value
  systemTableData.value = (await returnSystemListData(paginationData.systemCurrentPage)) as any
}

const cre = ref()
const createMessage = (id: number) => {
  cre.value.openCreate(id)
}
const editMessage = (row: any) => {
  cre.value.openEdit(row)
}
const editSystemMessage = (row: any) => {
  cre.value.openEditSystem(row)
}
const delete_msg = ref()
const deleteMessage = (row: any) => {
  delete_msg.value.openDelete(row)
}
const deleteSystemMessage = (id: number) => {
  delete_msg.value.openRealDelete(id)
}
</script>

<style lang="scss" scoped>
.el-radio-group {
  margin-left: 20px;
}

:deep(.el-table .cell) {
  font-weight: 400;
}
</style>
