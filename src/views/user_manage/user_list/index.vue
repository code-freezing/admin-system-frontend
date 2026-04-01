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
              @clear="showAllUsers()"
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
          <el-button plain type="primary" @click="showAllUsers">查看全部用户</el-button>
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
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import breadCrumb from '@/components/bread_crumb.vue'
import { usePagedTable } from '@/hooks/usePagedTable'
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

// 记录当前状态，方便后续逻辑统一读取和更新。
const breadcrumb = ref()
const { hasAnyPermission, hasPermission } = usePermission()
// 记录单项数据，方便后续逻辑统一读取和更新。
const item = ref({
  first: '用户管理',
  second: '用户列表',
})

// 记录当前状态，方便后续逻辑统一读取和更新。
const adminAccount = ref()
// 记录部门数据，方便后续逻辑统一读取和更新。
const departmentData = ref([])
// 记录部门，方便后续逻辑统一读取和更新。
const department = ref()
// 记录用户信息，方便后续逻辑统一读取和更新。
const user_info = ref()
// 记录用户列表页面视图，方便后续逻辑统一读取和更新。
const userListViewMode = ref('all')
const {
  tableData,
  total: adminTotal,
  pagination: paginationData,
  loadPage: loadUserPage,
  reload: reloadUserList,
  replaceWithList,
} = usePagedTable({
  loadList: async (page) => (await returnListData(page, '用户')).data,
  loadTotal: async () => (await getAdminListLength('用户')).data.length,
})

// 加载部门，让后续逻辑直接复用准备好的数据。
const loadDepartment = async () => {
  // 部门筛选项来自系统设置中的字典配置，不在页面里写死。
  const res = await getDepartment()
  departmentData.value = res.data
}

// 处理用户，把当前模块的关键逻辑集中在这里。
const showAllUsers = async () => {
  userListViewMode.value = 'all'
  await reloadUserList()
}

// 处理当前操作，让页面动作真正进入业务流程。
const applyAccountFilter = async () => {
  const account = adminAccount.value?.trim()
  if (!account) {
    await showAllUsers()
    return
  }

  userListViewMode.value = 'account'
  const res = await searchUser(account, '用户')
  replaceWithList(res.data)
}

// 处理部门，把当前操作正式提交到业务流程里。
const applyDepartmentFilter = async (value) => {
  if (!value) {
    await showAllUsers()
    return
  }

  userListViewMode.value = 'department'
  const res = await searchDepartment(value)
  replaceWithList(res.data)
}

// 处理当前状态，把当前模块的关键逻辑集中在这里。
const currentChange = async (value) => {
  await loadUserPage(value)
}

// 处理用户列表，把当前模块的关键逻辑集中在这里。
const banUserList = async () => {
  userListViewMode.value = 'banned'
  const res = await getBanList()
  replaceWithList(res.data)
}

// 刷新用户列表当前状态页面视图，避免旧凭证过期后直接中断当前会话。
const refreshUserListByCurrentView = async () => {
  // 用户列表有多种视图模式，刷新后要尽量保持用户当前正在看的那一类结果。
  if (userListViewMode.value === 'banned') {
    await banUserList()
    return
  }

  if (userListViewMode.value === 'department') {
    await applyDepartmentFilter(department.value)
    return
  }

  if (userListViewMode.value === 'account') {
    await applyAccountFilter()
    return
  }

  await showAllUsers()
}

// 查询用户，按当前条件筛出目标结果。
const searchUserByAccount = async () => {
  // 账号搜索和部门筛选互斥，切到账号搜索时先清空部门条件。
  department.value = undefined
  await applyAccountFilter()
}

// 查询部门，按当前条件筛出目标结果。
const searchForDepartment = async (value) => {
  // 部门筛选和账号搜索互斥，切到部门筛选时先清空账号关键字。
  adminAccount.value = ''
  await applyDepartmentFilter(value)
}

// 清理当前状态，防止旧数据残留到下一次流程。
const clearOperation = async () => {
  department.value = undefined
  await showAllUsers()
}

// 处理用户，把当前模块的关键逻辑集中在这里。
const banUserById = async (id) => {
  if (!hasPermission('button.user.user.ban')) return

  const res = await banUser(id)
  if (res.status == 0) {
    ElMessage.success('用户已冻结')
    await refreshUserListByCurrentView()
  } else {
    ElMessage.error('冻结失败')
  }
}

// 处理用户，把当前模块的关键逻辑集中在这里。
const hotUserById = async (id) => {
  if (!hasPermission('button.user.user.unban')) return

  const res = await hotUser(id)
  if (res.status == 0) {
    ElMessage.success('用户已解冻')
    await refreshUserListByCurrentView()
  } else {
    ElMessage.error('解冻失败')
  }
}

// 刷新用户，避免旧凭证过期后直接中断当前会话。
const refreshAfterUserAction = async () => {
  await refreshUserListByCurrentView()
}

// 处理用户，把当前模块的关键逻辑集中在这里。
const openUser = (row) => {
  // 双击行只在具备至少一种操作权限时才打开详情弹窗。
  if (!hasAnyPermission(['button.user.user.edit', 'button.user.user.promote', 'button.user.user.delete'])) {
    return
  }

  user_info.value.open(row)
}

// 页面首次进入后从这里拉起首屏数据或初始化流程。
onMounted(async () => {
  await Promise.all([loadDepartment(), showAllUsers()])
})
</script>

<style lang="scss" scoped>
.select-wrapped {
  :deep(.el-select) {
    width: 200px;
  }
}
</style>
