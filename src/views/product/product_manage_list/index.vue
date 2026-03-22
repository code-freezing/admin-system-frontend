<template>
  <breadCrumb ref="breadcrumb" :item="item" />
  <div class="module-common-wrapped">
    <div class="module-common-content">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="入库管理" name="first">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped">
                  <el-input
                    v-model="productId"
                    class="w-50 m-2"
                    size="large"
                    placeholder="按产品编号搜索"
                    clearable
                    @change="searchProduct()"
                    @clear="getProductFirstPageList"
                  >
                    <template #prefix>
                      <Search />
                    </template>
                  </el-input>
                </div>
                <div class="button-wrapped">
                  <el-button type="primary" @click="productInWarehouse">产品入库</el-button>
                </div>
              </div>
              <div class="module-common-table">
                <el-table :data="tableData" border style="width: 100%">
                  <el-table-column type="index" width="50" />
                  <el-table-column prop="product_id" label="产品编号" width="200" />
                  <el-table-column prop="product_name" label="产品名称" width="160" />
                  <el-table-column prop="product_category" label="产品分类" width="100" />
                  <el-table-column prop="product_unit" label="单位" />
                  <el-table-column prop="product_in_warehouse_number" label="入库数量" width="100" />
                  <el-table-column prop="product_single_price" label="单价" width="150" />
                  <el-table-column prop="product_all_price" label="总价" width="100" />
                  <el-table-column prop="product_status" label="库存状态" width="100">
                    <template #default="{ row }">
                      <el-tag
                        v-if="row.product_in_warehouse_number < 100"
                        class="ml-2"
                        type="success"
                      >
                        库存紧张
                      </el-tag>
                      <el-tag
                        v-else-if="
                          row.product_in_warehouse_number > 100 &&
                          row.product_in_warehouse_number < 300
                        "
                        class="ml-2"
                        type="success"
                      >
                        库存正常
                      </el-tag>
                      <el-tag v-else class="ml-2" type="success">库存充足</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="product_create_person" label="创建人" width="100" />
                  <el-table-column prop="product_create_time" label="创建时间" width="200">
                    <template #default="{ row }">
                      <div>{{ row.product_create_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="product_update_time" label="更新时间" width="200">
                    <template #default="{ row }">
                      <div>{{ row.product_update_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="in_memo" label="备注" width="200" />
                  <el-table-column label="操作" width="300" fixed="right">
                    <template #default="{ row }">
                      <div>
                        <el-button
                          type="primary"
                          :disabled="
                            row.product_out_status == '产品已出库' || row.product_in_warehouse_number == 0
                          "
                          @click="applyOut(row)"
                        >
                          产品出库
                        </el-button>
                        <el-button
                          type="success"
                          :disabled="row.product_out_status == '产品已出库'"
                          @click="editProduct(row)"
                        >
                          编辑
                        </el-button>
                        <el-button
                          type="danger"
                          :disabled="row.product_out_status == '产品已出库'"
                          @click="deleteProduct(row.id)"
                        >
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
                :current-page="paginationData.productCurrentPage"
                :pager-count="7"
                :total="paginationData.productTotal"
                :page-count="paginationData.productPageCount"
                layout="prev, pager, next"
                @current-change="productCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="出库管理" name="second">
          <div class="pane-content">
            <div class="pane-top">
              <div class="module-common-header">
                <div class="search-wrapped">
                  <el-input
                    v-model="productOutId"
                    class="w-50 m-2"
                    size="large"
                    clearable
                    placeholder="按出库编号搜索"
                    @change="searchApplyProduct()"
                    @clear="getApplyProductFirstPageList"
                  >
                    <template #prefix>
                      <Search />
                    </template>
                  </el-input>
                </div>
                <div class="button-wrapped" />
              </div>
              <div class="module-common-table">
                <el-table :data="applyTableData" border style="width: 100%">
                  <el-table-column type="index" width="50" />
                  <el-table-column prop="product_out_id" label="出库编号" width="200" />
                  <el-table-column prop="product_name" label="产品名称" width="200" />
                  <el-table-column prop="product_out_number" label="出库数量" width="180" />
                  <el-table-column prop="product_out_price" label="出库价格" width="180" />
                  <el-table-column prop="product_out_apply_person" label="申请人" width="100" />
                  <el-table-column prop="product_apply_time" label="申请时间" width="180">
                    <template #default="{ row }">
                      <div>{{ row.product_apply_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="product_out_audit_person" label="审核人" width="150" />
                  <el-table-column prop="product_audit_time" label="审核时间" width="180">
                    <template #default="{ row }">
                      <div>{{ row.product_audit_time?.slice(0, 10) }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="product_out_status" label="状态" width="100" />
                  <el-table-column prop="apply_memo" label="申请备注" width="200" />
                  <el-table-column prop="audit_memo" label="审核备注" width="200" />
                  <el-table-column label="操作" width="300" fixed="right">
                    <template #default="{ row }">
                      <div>
                        <el-button type="primary" @click="withdrawProduct(row.id)">撤回申请</el-button>
                        <el-button
                          type="success"
                          :disabled="row.product_out_status == '产品已出库'"
                          @click="againApply(row)"
                        >
                          重新申请
                        </el-button>
                        <el-button type="danger" @click="auditProduct(row)">审核</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="table-footer">
              <el-pagination
                :page-size="1"
                :current-page="paginationData.applyProductCurrentPage"
                :pager-count="7"
                :total="paginationData.applyProductTotal"
                :page-count="paginationData.applyProductCount"
                layout="prev, pager, next"
                @current-change="applyProductCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <warehousing ref="in_warehouse" @success="getProductFirstPageList" />
  <apply ref="apply_product" @success="changeTwoPageList" />
  <edit ref="edit_product" @success="getProductFirstPageList" />
  <remove ref="delete_product" @success="getProductFirstPageList" />
  <audit ref="audit_product" @success="changeTwoPageList" />
  <withdraw ref="withdraw_product" @success="changeTwoPageList" />
  <again ref="again_product" @success="getApplyProductFirstPageList" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus'
import breadCrumb from '@/components/bread_crumb.vue'
import {
  getApplyProductLength,
  getProductLength,
  returnApplyProductListData,
  returnProductListData,
  searchProductForApplyId,
  searchProductForId,
} from '@/api/product'
import warehousing from '../components/product_in_warehouse.vue'
import apply from '../components/apply.vue'
import edit from '../components/edit_product.vue'
import remove from '../components/delete_product.vue'
import audit from '../components/audit.vue'
import withdraw from '../components/withdraw.vue'
import again from '../components/again_apply.vue'

// 产品列表页分成两个标签页：
// 1. 入库管理负责当前库存维护
// 2. 出库管理负责待审核申请和撤回/重提
interface ProductRow {
  id: number
  product_out_status?: string
  product_in_warehouse_number?: number
  product_create_time?: string
  product_update_time?: string
  product_apply_time?: string
  product_audit_time?: string
  [key: string]: unknown
}

const breadcrumb = ref()
const item = ref({
  first: '产品管理',
  second: '产品列表',
})

const activeName = ref('first')
const productId = ref<number>()
const productOutId = ref<number>()
const tableData = ref<ProductRow[]>([])
const applyTableData = ref<ProductRow[]>([])

// 两套分页状态分别服务于库存列表和出库申请列表。
const paginationData = reactive({
  productTotal: 0,
  productPageCount: 0,
  productCurrentPage: 1,
  applyProductTotal: 0,
  applyProductCount: 0,
  applyProductCurrentPage: 1,
})

const toArray = <T,>(data: unknown): T[] => {
  return Array.isArray(data) ? (data as T[]) : []
}

// 后端分页接口固定每页 10 条，这里只负责同步总数和页码。
const loadProductLength = async () => {
  const res = await getProductLength()
  const total = Array.isArray(res) ? res.length : 0
  paginationData.productTotal = total
  paginationData.productPageCount = Math.max(1, Math.ceil(total / 10))
}

const loadApplyProductLength = async () => {
  const res = await getApplyProductLength()
  const total = Array.isArray(res) ? res.length : 0
  paginationData.applyProductTotal = total
  paginationData.applyProductCount = Math.max(1, Math.ceil(total / 10))
}

const getProductFirstPageList = async () => {
  tableData.value = toArray<ProductRow>(await returnProductListData(1))
}

const getApplyProductFirstPageList = async () => {
  applyTableData.value = toArray<ProductRow>(await returnApplyProductListData(1))
}

const changeTwoPageList = async () => {
  await Promise.all([getProductFirstPageList(), getApplyProductFirstPageList()])
}

// 标签切换时只刷新当前视图对应的数据，避免每次切页都全量请求。
const handleClick = (tab: TabsPaneContext) => {
  if (tab.props.label === '入库管理') {
    getProductFirstPageList()
  }
  if (tab.props.label === '出库管理') {
    getApplyProductFirstPageList()
  }
}

const productCurrentChange = async (value: number) => {
  paginationData.productCurrentPage = value
  tableData.value = toArray<ProductRow>(await returnProductListData(value))
}

const applyProductCurrentChange = async (value: number) => {
  paginationData.applyProductCurrentPage = value
  applyTableData.value = toArray<ProductRow>(await returnApplyProductListData(value))
}

const searchProduct = async () => {
  tableData.value = toArray<ProductRow>(await searchProductForId(productId.value as number))
}

const searchApplyProduct = async () => {
  applyTableData.value = toArray<ProductRow>(
    await searchProductForApplyId(productOutId.value as number),
  )
}

// 这些 ref 对应各个弹窗组件，页面本身只负责打开弹窗和在成功后刷新列表。
const in_warehouse = ref()
const productInWarehouse = () => {
  in_warehouse.value.open()
}

const apply_product = ref()
const applyOut = (row: ProductRow) => {
  apply_product.value.open(row)
}

const edit_product = ref()
const editProduct = (row: ProductRow) => {
  edit_product.value.open(row)
}

const delete_product = ref()
const deleteProduct = (id: number) => {
  delete_product.value.open(id)
}

const audit_product = ref()
const auditProduct = (row: ProductRow) => {
  audit_product.value.open(row)
}

const withdraw_product = ref()
const withdrawProduct = (id: number) => {
  withdraw_product.value.open(id)
}

const again_product = ref()
const againApply = (row: ProductRow) => {
  again_product.value.open(row)
}

onMounted(async () => {
  await Promise.all([loadProductLength(), loadApplyProductLength(), getProductFirstPageList(), getApplyProductFirstPageList()])
})
</script>

<style lang="scss" scoped>
:deep(.el-table .cell) {
  font-weight: 400;
}
</style>
