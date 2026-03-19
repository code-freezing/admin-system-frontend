<template>
  <breadCrumb ref="breadcrumb" :item="item" />
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <div class="search-wrapped">
          <el-input
            v-model="productOutId"
            class="w-50 m-2"
            size="large"
            placeholder="按出库编号搜索"
            clearable
            @change="searchProductOutId()"
            @clear="getFirstPageList"
          >
            <template #prefix>
              <Search />
            </template>
          </el-input>
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="product_out_id" label="出库编号" width="200" />
          <el-table-column prop="product_out_number" label="出库数量" />
          <el-table-column prop="product_out_price" label="出库价格" />
          <el-table-column prop="product_out_apply_person" label="申请人" />
          <el-table-column prop="product_apply_time" label="申请时间" width="180">
            <template #default="{ row }">
              <div>{{ row.product_apply_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="product_out_audit_person" label="审核人" />
          <el-table-column prop="product_audit_time" label="审核时间" width="180">
            <template #default="{ row }">
              <div>{{ row.product_audit_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="audit_memo" label="审核备注" width="200" />
        </el-table>
      </div>
    </div>
    <div class="table-footer">
      <el-pagination
        :page-size="1"
        :current-page="paginationData.currentPage"
        :pager-count="7"
        :total="outProductTotal"
        :page-count="paginationData.pageCount"
        layout="prev, pager, next"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import breadCrumb from '@/components/bread_crumb.vue'
import { getOutProductLength, returnOutProductListData, searchProductForOutId } from '@/api/product'

interface OutProductRow {
  product_apply_time?: string
  product_audit_time?: string
  [key: string]: unknown
}

const breadcrumb = ref()
const item = ref({
  first: '产品管理',
  second: '出库列表',
})

const productOutId = ref<number>()
const tableData = ref<OutProductRow[]>([])
const outProductTotal = ref(0)

const paginationData = reactive({
  pageCount: 0,
  currentPage: 1,
})

const loadOutProductLength = async () => {
  const res = await getOutProductLength()
  const total = Array.isArray(res) ? res.length : 0
  outProductTotal.value = total
  paginationData.pageCount = Math.max(1, Math.ceil(total / 10))
}

const getFirstPageList = async () => {
  tableData.value = (await returnOutProductListData(1)) as OutProductRow[]
}

const currentChange = async (value: number) => {
  paginationData.currentPage = value
  tableData.value = (await returnOutProductListData(value)) as OutProductRow[]
}

const searchProductOutId = async () => {
  tableData.value = (await searchProductForOutId(productOutId.value as number)) as OutProductRow[]
}

onMounted(async () => {
  await Promise.all([loadOutProductLength(), getFirstPageList()])
})
</script>

<style lang="scss" scoped>
.table-wrapped {
  padding: 8px;
  height: calc(100vh - 101px);
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .table-top {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .table-header {
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 48px;
      background: #fff;
    }

    .table-content {
      min-height: 10px;
      padding: 10px 20px 20px;
      margin-bottom: 8px;
      background: #fff;
    }
  }

  .table-footer {
    display: flex;
    justify-content: flex-end;
    background: #fff;
  }
}

:deep(.el-table .cell) {
  font-weight: 400;
}
</style>
