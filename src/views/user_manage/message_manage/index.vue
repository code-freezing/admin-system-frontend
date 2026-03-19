<template>
  <breadCrumb ref="breadcrumb" :item="item" />
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <div class="search-wrapped">
          <el-input
            v-model="adminAccount"
            class="w-50 m-2"
            size="large"
            placeholder="按账号搜索"
            @change="searchAdmin()"
            clearable
            @clear="clearInput()"
          >
            <template #prefix>
              <Search />
            </template>
          </el-input>
        </div>
        <div class="button-wrapped">
          <el-button type="primary" @click="openCreate(3)">新增消息管理员</el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column type="index" width="50" />
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="department" label="部门" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <div>
                <el-button type="success" @click="openEdit(row.id)">编辑</el-button>
                <el-button type="danger" @click="openDelete(row.id)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-footer">
      <el-pagination
        :page-size="1"
        :current-page="paginationData.currentPage"
        :pager-count="7"
        :total="adminTotal"
        :page-count="paginationData.pageCount"
        layout="prev, pager, next"
        @current-change="currentChange"
      />
    </div>
  </div>
  <createA ref="create_admin" @success="refreshTable('create')" />
  <editA ref="edit_admin" @success="refreshTable('edit')" />
  <deleteA ref="delete_admin" @success="refreshTable('delete')" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import breadCrumb from '@/components/bread_crumb.vue'
import createA from '../components/create_admin.vue'
import editA from '../components/edit_admin.vue'
import deleteA from '../components/delete_admin.vue'
import { useTable } from '@/hooks'

const {
  adminAccount,
  paginationData,
  adminTotal,
  tableData,
  currentChange,
  searchAdmin,
  clearInput,
  refreshTable,
} = useTable('消息管理员')

const breadcrumb = ref()
const item = ref({
  first: '用户管理',
  second: '消息管理员',
})

const create_admin = ref()
const openCreate = (id: number) => {
  create_admin.value.open(id)
}

const edit_admin = ref()
const openEdit = (id: number) => {
  edit_admin.value.open(id)
}

const delete_admin = ref()
const openDelete = (id: number) => {
  delete_admin.value.open({ kind: 'admin', id })
}
</script>

<style lang="scss" scoped></style>
