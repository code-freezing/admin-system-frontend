<!--
  组件说明：
  1. 普通用户列表页。
  2. 负责查看员工列表、部门筛选、冻结解冻、赋权和编辑资料。
  3. 这是用户管理员最常使用的主工作台。
-->
<template>
  <breadCrumb ref="breadcrumb" :item="item" />
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <div class="left-wrapped">
          <div class="search-wrapped">
            <el-input
              v-model="adminAccount"
              class="w-50 m-2"
              size="large"
              placeholder="按账号搜索"
              :prefix-icon="Search"
              clearable
              @change="searchUserByAccount()"
              @clear="reloadUserList()"
            />
          </div>
          <div class="select-wrapped">
            <el-select
              v-model="department"
              placeholder="按部门筛选"
              clearable
              @change="searchForDepartment"
              @clear="clearOperation"
            >
              <el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
        </div>
        <div class="button-wrapped">
          <el-button plain type="primary" @click="banUserList">查看冻结用户</el-button>
          <el-button plain type="primary" @click="getFirstPageList">查看全部用户</el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableData" border style="width: 100%" @row-dblclick="openUser">
          <el-table-column type="index" width="50" />
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="sex" label="性别" />
          <el-table-column prop="department" label="部门" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag v-if="row.status == '1'" class="ml-2">冻结</el-tag>
              <el-tag v-else class="ml-2" type="success">正常</el-tag>
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
                <el-button
                  v-permission="'button.user.user.ban'"
                  type="primary"
                  @click="banUserById(row.id)"
                  :disabled="row.status == 1"
                >
                  冻结
                </el-button>
                <el-button
                  v-permission="'button.user.user.unban'"
                  type="success"
                  @click="hotUserById(row.id)"
                  :disabled="row.status == 0"
                >
                  解冻
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
        :current-page="paginationData.currentPage"
        :pager-count="7"
        :total="adminTotal"
        :page-count="paginationData.pageCount"
        layout="prev, pager, next"
        @current-change="currentChange"
      />
    </div>
  </div>
  <userinfo ref="user_info" @success="refreshAfterUserAction" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import breadCrumb from '@/components/bread_crumb.vue'
import { usePermission } from '@/hooks/usePermission'
import { getDepartment } from '@/api/setting'
import {
  banUser,
  getAdminListLength,
  getBanList,
  hotUser,
  returnListData,
  searchDepartment,
  searchUser,
} from '@/api/userinfor'
import userinfo from '../components/user_infor.vue'

interface UserRow {
  id: number
  status?: string
  create_time?: string
  update_time?: string
  [key: string]: unknown
}

const breadcrumb = ref()
const { hasAnyPermission, hasPermission } = usePermission()
const item = ref({
  first: '用户管理',
  second: '用户列表',
})

const adminAccount = ref<string>()
const tableData = ref<UserRow[]>([])
const departmentData = ref<string[]>([])
const department = ref<string>()
const adminTotal = ref(0)
const user_info = ref()

const paginationData = reactive({
  pageCount: 1,
  currentPage: 1,
})

const loadDepartment = async () => {
  const res = await getDepartment()
  departmentData.value = Array.isArray(res) ? (res as string[]) : []
}

const loadUserLength = async () => {
  const res = await getAdminListLength('用户')
  adminTotal.value = typeof (res as { length?: number })?.length === 'number' ? (res as { length: number }).length : 0
  paginationData.pageCount = Math.max(1, Math.ceil(adminTotal.value / 10))
}

const getListByPage = async (page = paginationData.currentPage) => {
  const res = await returnListData(page, '用户')
  tableData.value = Array.isArray(res) ? (res as UserRow[]) : []
}

const getFirstPageList = async () => {
  paginationData.currentPage = 1
  await getListByPage(1)
}

const reloadUserList = async () => {
  await Promise.all([loadUserLength(), getFirstPageList()])
}

const searchUserByAccount = async () => {
  const account = adminAccount.value?.trim()
  if (!account) {
    await reloadUserList()
    return
  }

  const res = await searchUser(account, '用户')
  tableData.value = Array.isArray(res) ? (res as UserRow[]) : []
  adminTotal.value = tableData.value.length
  paginationData.currentPage = 1
  paginationData.pageCount = 1
}

const searchForDepartment = async (value?: string) => {
  if (!value) {
    await reloadUserList()
    return
  }
  const res = await searchDepartment(value)
  tableData.value = Array.isArray(res) ? (res as UserRow[]) : []
  adminTotal.value = tableData.value.length
  paginationData.currentPage = 1
  paginationData.pageCount = 1
}

const clearOperation = async () => {
  department.value = undefined
  await reloadUserList()
}

const currentChange = async (value: number) => {
  paginationData.currentPage = value
  await getListByPage(value)
}

const banUserList = async () => {
  const res = await getBanList()
  tableData.value = Array.isArray(res) ? (res as UserRow[]) : []
  adminTotal.value = tableData.value.length
  paginationData.currentPage = 1
  paginationData.pageCount = 1
}

const banUserById = async (id: number) => {
  if (!hasPermission('button.user.user.ban')) return

  const res = await banUser(id)
  if (res.status == 0) {
    ElMessage.success('用户已冻结')
    await reloadUserList()
  } else {
    ElMessage.error('冻结失败')
  }
}

const hotUserById = async (id: number) => {
  if (!hasPermission('button.user.user.unban')) return

  const res = await hotUser(id)
  if (res.status == 0) {
    ElMessage.success('用户已解冻')
    await reloadUserList()
  } else {
    ElMessage.error('解冻失败')
  }
}

const refreshAfterUserAction = async () => {
  await reloadUserList()
}

const openUser = (row: UserRow) => {
  if (!hasAnyPermission(['button.user.user.edit', 'button.user.user.promote', 'button.user.user.delete'])) {
    return
  }

  user_info.value.open(row)
}

onMounted(async () => {
  await Promise.all([loadDepartment(), reloadUserList()])
})
</script>

<style lang="scss" scoped>
.select-wrapped {
  :deep(.el-select) {
    width: 200px;
  }
}
</style>
