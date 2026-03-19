<template>
  <breadCrumb ref="breadcrumb" :item="item" />
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <div>
          <el-input
            v-model="account"
            class="w-50 m-2"
            size="large"
            placeholder="按账号搜索"
            clearable
            @change="searchLoginAccount()"
            @clear="getLoginFirstPageList"
          >
            <template #prefix>
              <Search />
            </template>
          </el-input>
        </div>
        <div class="upload-wrapped">
          <el-button type="danger" @click="clearList">清空登录日志</el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="login_time" label="登录时间" width="200">
            <template #default="{ row }">
              <div>{{ row.login_time?.slice(0, 16) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-footer">
      <el-pagination
        :page-size="1"
        :current-page="paginationData.loginCurrentPage"
        :pager-count="7"
        :total="paginationData.loginTotal"
        :page-count="paginationData.loginPageCount"
        layout="prev, pager, next"
        @current-change="loginCurrentChange"
      />
    </div>
  </div>
  <tips ref="tip" @success="getLoginFirstPageList" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import breadCrumb from '@/components/bread_crumb.vue'
import tips from './components/tips.vue'
import { loginLogListLength, returnLoginListData, searchLoginLogList } from '@/api/log'

interface LoginLogRow {
  login_time?: string
  [key: string]: unknown
}

const breadcrumb = ref()
const item = ref({
  first: '登录日志',
  second: '',
})

const account = ref('')
const tableData = ref<LoginLogRow[]>([])
const tip = ref()

const paginationData = reactive({
  loginTotal: 0,
  loginPageCount: 0,
  loginCurrentPage: 1,
})

const loadLoginLength = async () => {
  const res = await loginLogListLength()
  const total = Array.isArray(res) ? res.length : 0
  paginationData.loginTotal = total
  paginationData.loginPageCount = Math.max(1, Math.ceil(total / 10))
}

const getLoginFirstPageList = async () => {
  tableData.value = (await returnLoginListData(1)) as LoginLogRow[]
}

const loginCurrentChange = async (value: number) => {
  paginationData.loginCurrentPage = value
  tableData.value = (await returnLoginListData(value)) as LoginLogRow[]
}

const searchLoginAccount = async () => {
  tableData.value = (await searchLoginLogList(Number(account.value))) as LoginLogRow[]
}

const clearList = () => {
  tip.value.open()
}

onMounted(async () => {
  await Promise.all([loadLoginLength(), getLoginFirstPageList()])
})
</script>

<style lang="scss" scoped>
:deep(.el-table .cell) {
  font-weight: 400;
}

a {
  color: #fff;
  display: block;
  text-decoration: none;
}
</style>
