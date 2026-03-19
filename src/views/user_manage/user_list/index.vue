<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <div class="table-wrapped">
    <!-- 顶部 -->
    <div class="table-top">
      <!-- 表格顶部 -->
      <div class="table-header">
        <!-- 鎼滅储妗?-->
        <div class="left-wrapped">
          <div class="search-wrapped">
            <el-input
              v-model="adminAccount"
              class="w-50 m-2"
              size="large"
              placeholder="输入账号进行搜索"
              :prefix-icon="Search"
              @change="searchUserByAccount()"
            />
          </div>
          <div class="select-wrapped">
            <el-select
              v-model="department"
              placeholder="请选择部门"
              clearable
              @change="searchForDepartment"
              @clear="clearOperation"
            >
              <el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
        </div>
        <div class="button-wrapped">
          <el-button plain type="primary" @click="banUserList">筛选冻结用户</el-button>
          <el-button plain type="primary" @click="getFirstPageList">显示全部用户</el-button>
        </div>
      </div>
      <!-- 表格内容 -->
      <div class="table-content">
        <el-table :data="tableData" style="width: 100%" border @row-dblclick="openUser">
          <el-table-column type="index" width="50" />
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="sex" label="性别" />
          <el-table-column prop="department" label="部门" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <div>
                <el-tag v-if="row.status == '1'" class="ml-2">冻结</el-tag>
                <el-tag class="ml-2" type="success" v-else>正常</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间">
            <template #default="{ row }">
              <div>{{ row.create_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="更新时间">
            <template #default="{ row }">
              <div>{{ row.update_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <div>
                <el-button type="primary" @click="banUserById(row.id)" :disabled="row.status == 1"
                  >冻结</el-button
                >
                <el-button type="success" @click="hotUserById(row.id)" :disabled="row.status == 0"
                  >解冻</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 底部 -->
    <div class="table-footer">
      <el-pagination
        :page-size="1"
        :current-page="paginationData.currentPage"
        :pager-count="7"
        :total="adminTotal"
        :page-count="paginationData.pageCount"
        @current-change="currentChange"
        layout="prev, pager, next"
      />
    </div>
  </div>
  <userinfo ref="user_info" @success="refreshAfterUserAction"></userinfo>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import breadCrumb from '@/components/bread_crumb.vue'
import userinfo from '../components/user_infor.vue'
import {
  searchUser,
  searchDepartment,
  getAdminListLength,
  returnListData,
  getBanList,
  banUser,
  hotUser,
} from '@/api/userinfor.js'
import { getDepartment } from '@/api/setting'
import { ElMessage } from 'element-plus'

const breadcrumb = ref()
const item = ref({
  first: '用户管理',
  second: '用户列表',
})

const adminAccount = ref<number>()
const tableData = ref<any[]>([])
const departmentData = ref<string[]>([])
const department = ref<string | undefined>()

const paginationData = reactive({
  pageCount: 1,
  currentPage: 1,
})
const adminTotal = ref<number>(0)

const returnDepartment = async () => {
  const res = await getDepartment()
  departmentData.value = Array.isArray(res) ? (res as string[]) : []
}
returnDepartment()

const searchUserByAccount = async () => {
  const res = await searchUser(adminAccount.value, '用户')
  tableData.value = Array.isArray(res) ? res : []
}

const getListByPage = async (page = paginationData.currentPage) => {
  const res = await returnListData(page, '用户')
  tableData.value = Array.isArray(res) ? res : []
  if (tableData.value.length === 0 && page > 1) {
    paginationData.currentPage = page - 1
    await returnAdminListLength()
    const prev = await returnListData(paginationData.currentPage, '用户')
    tableData.value = Array.isArray(prev) ? prev : []
  }
}

const returnAdminListLength = async () => {
  const res = await getAdminListLength('用户')
  adminTotal.value = (res as any).length
  paginationData.pageCount = Math.ceil((res as any).length / 10)
}
returnAdminListLength()

const getFirstPageList = async () => {
  paginationData.currentPage = 1
  await getListByPage(1)
}
getFirstPageList()

const searchForDepartment = async (value?: string) => {
  if (!value) {
    await getFirstPageList()
    return
  }
  const res = await searchDepartment(value)
  tableData.value = Array.isArray(res) ? res : []
}

const clearOperation = async () => {
  department.value = undefined
  await getFirstPageList()
}

const currentChange = async (value: number) => {
  paginationData.currentPage = value
  await getListByPage(value)
}

const banUserList = async () => {
  const res = await getBanList()
  tableData.value = Array.isArray(res) ? res : []
}

const banUserById = async (id: number) => {
  const res = await banUser(id)
  if (res.status == 0) {
    ElMessage({
      message: '冻结用户成功',
      type: 'success',
    })
    await getListByPage()
  } else {
    ElMessage.error('冻结用户失败')
  }
}

const hotUserById = async (id: number) => {
  const res = await hotUser(id)
  if (res.status == 0) {
    ElMessage({
      message: '解冻用户成功',
      type: 'success',
    })
    await getListByPage()
  } else {
    ElMessage.error('解冻用户失败')
  }
}

const refreshAfterUserAction = async () => {
  await getListByPage()
}

const user_info = ref()
const openUser = (row: any) => {
  user_info.value.open(row)
}
</script>

<style lang="scss" scoped>
.select-wrapped {
  :deep(.el-select) {
    width: 200px;
  }
}
</style>


