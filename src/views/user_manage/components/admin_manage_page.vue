<template>
  <breadCrumb ref="breadcrumb" :item="breadcrumbItem" />
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <div class="search-wrapped">
          <el-input
            v-model="adminAccount"
            class="w-50 m-2"
            size="large"
            placeholder="按账号搜索"
            clearable
            @change="searchAdmin()"
            @clear="clearInput()"
          >
            <template #prefix>
              <Search />
            </template>
          </el-input>
        </div>
        <div class="button-wrapped">
          <el-button v-permission="'button.user.admin.create'" type="primary" @click="openCreate">
            {{ createButtonText }}
          </el-button>
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
                <el-button v-permission="'button.user.admin.edit'" type="success" @click="openEdit(row.id)">
                  编辑
                </el-button>
                <el-button v-permission="'button.user.admin.delete'" type="danger" @click="openDelete(row.id)">
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
import { computed, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import breadCrumb from '@/components/bread_crumb.vue'
import { usePermission } from '@/hooks/usePermission'
import { useTable } from '@/hooks'
import createA from './create_admin.vue'
import deleteA from './delete_admin.vue'
import editA from './edit_admin.vue'

const props = defineProps(['identity', 'title', 'createType'])

const { hasPermission } = usePermission()
const {
  adminAccount,
  paginationData,
  adminTotal,
  tableData,
  currentChange,
  searchAdmin,
  clearInput,
  refreshTable,
} = useTable(props.identity)

// 记录当前状态，方便后续逻辑统一读取和更新。
const breadcrumb = ref()
// 基于现有状态派生单项数据，避免同一份结果在多个地方重复计算。
const breadcrumbItem = computed(() => ({
  first: '用户管理',
  second: props.title,
}))
// 创建新记录，把当前输入正式写成业务数据。
const createButtonText = computed(() => `新增${props.title}`)

// 创建新记录，把当前输入正式写成业务数据。
const create_admin = ref()
// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openCreate = () => {
  // 页面差异通过 createType 传给创建弹窗，弹窗内部再决定创建哪类管理员。
  if (!hasPermission('button.user.admin.create')) return
  create_admin.value.open(props.createType)
}

// 更新当前记录，确保最新输入能覆盖旧数据。
const edit_admin = ref()
// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openEdit = (id) => {
  if (!hasPermission('button.user.admin.edit')) return
  edit_admin.value.open(id)
}

// 删除当前记录，避免旧数据继续影响后续流程。
const delete_admin = ref()
// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openDelete = (id) => {
  if (!hasPermission('button.user.admin.delete')) return
  delete_admin.value.open({ kind: 'admin', id })
}
</script>

<style lang="scss" scoped></style>
