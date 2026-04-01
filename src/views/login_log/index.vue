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
        :page-size="10"
        :current-page="paginationData.loginCurrentPage"
        :pager-count="7"
        :total="paginationData.loginTotal"
        :page-count="paginationData.loginPageCount"
        layout="prev, pager, next"
        @current-change="loginCurrentChange"
      />
    </div>
  </div>
  <tips ref="tip" @success="reloadLoginList" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import breadCrumb from '@/components/bread_crumb.vue'
import tips from './components/tips.vue'
import { loginLogListLength, returnLoginListData, searchLoginLogList } from '@/api/log'

// 记录当前状态，方便后续逻辑统一读取和更新。
const breadcrumb = ref()
// 记录单项数据，方便后续逻辑统一读取和更新。
const item = ref({
  first: '登录日志',
  second: '',
})

// 记录当前状态，方便后续逻辑统一读取和更新。
const account = ref('')
// 记录表格数据数据，方便后续逻辑统一读取和更新。
const tableData = ref([])
// 记录当前状态，方便后续逻辑统一读取和更新。
const tip = ref()

// 记录数据，方便后续逻辑统一读取和更新。
const paginationData = reactive({
  loginTotal: 0,
  loginPageCount: 0,
  loginCurrentPage: 1,
})

// 加载登录，让后续逻辑直接复用准备好的数据。
const loadLoginLength = async () => {
  // 总数单独维护，保持和当前登录日志分页组件的计算方式一致。
  const res = await loginLogListLength()
  const total = res.data.length
  paginationData.loginTotal = total
  paginationData.loginPageCount = Math.max(1, Math.ceil(total / 10))
}

// 获取登录页码列表，让后续逻辑统一使用这一份结果。
const getLoginFirstPageList = async () => {
  paginationData.loginCurrentPage = 1
  tableData.value = (await returnLoginListData(1)).data
}

// 处理当前状态，在认证通过后建立当前会话。
const loginCurrentChange = async (value) => {
  paginationData.loginCurrentPage = value
  tableData.value = (await returnLoginListData(value)).data
}

// 查询登录，按当前条件筛出目标结果。
const searchLoginAccount = async () => {
  tableData.value = (await searchLoginLogList(account.value.trim())).data
}

// 清理列表，防止旧状态残留到下一次流程。
const clearList = () => {
  tip.value.open()
}

// 处理登录列表，把当前模块的关键逻辑集中在这里。
const reloadLoginList = async () => {
  await Promise.all([loadLoginLength(), getLoginFirstPageList()])
}

// 页面首次进入后从这里拉起首屏数据或初始化流程。
onMounted(async () => {
  await reloadLoginList()
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
