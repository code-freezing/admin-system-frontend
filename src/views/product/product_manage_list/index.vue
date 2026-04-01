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
                    @clear="reloadProductList"
                  >
                    <template #prefix>
                      <Search />
                    </template>
                  </el-input>
                </div>
                <div class="button-wrapped">
                  <el-button v-permission="'button.product.create'" type="primary" @click="productInWarehouse">
                    产品入库
                  </el-button>
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
                          v-permission="'button.product.apply'"
                          type="primary"
                          :disabled="
                            row.product_out_status == '产品已出库' || row.product_in_warehouse_number == 0
                          "
                          @click="applyOut(row)"
                        >
                          产品出库
                        </el-button>
                        <el-button
                          v-permission="'button.product.edit'"
                          type="success"
                          :disabled="row.product_out_status == '产品已出库'"
                          @click="editProduct(row)"
                        >
                          编辑
                        </el-button>
                        <el-button
                          v-permission="'button.product.delete'"
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
                :page-size="10"
                :current-page="productPagination.currentPage"
                :pager-count="7"
                :total="productTotal"
                :page-count="productPagination.pageCount"
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
                    @clear="reloadApplyProductList"
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
                        <el-button
                          v-permission="'button.product.withdraw'"
                          type="primary"
                          @click="withdrawProduct(row.id)"
                        >
                          撤回申请
                        </el-button>
                        <el-button
                          v-permission="'button.product.reapply'"
                          type="success"
                          :disabled="row.product_out_status == '产品已出库'"
                          @click="againApply(row)"
                        >
                          重新申请
                        </el-button>
                        <el-button v-permission="'button.product.audit'" type="danger" @click="auditProduct(row)">
                          审核
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
                :current-page="applyProductPagination.currentPage"
                :pager-count="7"
                :total="applyProductTotal"
                :page-count="applyProductPagination.pageCount"
                layout="prev, pager, next"
                @current-change="applyProductCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <warehousing ref="in_warehouse" @success="reloadProductList" />
  <apply ref="apply_product" @success="reloadTwoPageList" />
  <edit ref="edit_product" @success="reloadProductList" />
  <remove ref="delete_product" @success="reloadProductList" />
  <audit ref="audit_product" @success="reloadTwoPageList" />
  <withdraw ref="withdraw_product" @success="reloadTwoPageList" />
  <again ref="again_product" @success="reloadApplyProductList" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import breadCrumb from '@/components/bread_crumb.vue'
import { usePagedTable } from '@/hooks/usePagedTable'
import {
  getApplyProductLength,
  getProductLength,
  returnApplyProductListData,
  returnProductListData,
  searchProductForApplyId,
  searchProductForId,
} from '@/api/product'
import { usePermission } from '@/hooks/usePermission'
import warehousing from '../components/product_in_warehouse.vue'
import apply from '../components/apply.vue'
import edit from '../components/edit_product.vue'
import remove from '../components/delete_product.vue'
import audit from '../components/audit.vue'
import withdraw from '../components/withdraw.vue'
import again from '../components/again_apply.vue'

// 记录当前状态，方便后续逻辑统一读取和更新。
const breadcrumb = ref()
// 记录单项数据，方便后续逻辑统一读取和更新。
const item = ref({
  first: '产品管理',
  second: '产品列表',
})

// 记录名称，方便后续逻辑统一读取和更新。
const activeName = ref('first')
const { hasPermission } = usePermission()
// 记录产品，方便后续逻辑统一读取和更新。
const productId = ref()
// 记录产品，方便后续逻辑统一读取和更新。
const productOutId = ref()
const {
  tableData,
  total: productTotal,
  pagination: productPagination,
  loadFirstPage: getProductFirstPageList,
  reload: reloadProductList,
  loadPage: productCurrentChange,
  replaceWithList: replaceProductList,
} = usePagedTable({
  loadList: async (page) => (await returnProductListData(page)).data,
  loadTotal: async () => (await getProductLength()).data.length,
})

const {
  tableData: applyTableData,
  total: applyProductTotal,
  pagination: applyProductPagination,
  loadFirstPage: getApplyProductFirstPageList,
  reload: reloadApplyProductList,
  loadPage: applyProductCurrentChange,
  replaceWithList: replaceApplyProductList,
} = usePagedTable({
  loadList: async (page) => (await returnApplyProductListData(page)).data,
  loadTotal: async () => (await getApplyProductLength()).data.length,
})

// 处理页码列表，把当前模块的关键逻辑集中在这里。
const reloadTwoPageList = async () => {
  // 出库申请、审核和撤回都会同时影响两个标签页，所以这里统一刷新两套列表。
  await Promise.all([reloadProductList(), reloadApplyProductList()])
}

// 处理当前分支的核心逻辑，避免同类操作散落在多个位置。
const handleClick = (tab) => {
  // 标签切换时只刷新当前页签，避免每次切页都把两套列表重拉一遍。
  if (tab.props.label === '入库管理') {
    getProductFirstPageList()
  }
  if (tab.props.label === '出库管理') {
    getApplyProductFirstPageList()
  }
}

// 查询产品，按当前条件筛出目标结果。
const searchProduct = async () => {
  // 搜索结果会直接覆盖分页表格，清空输入框后再恢复默认分页列表。
  if (productId.value === undefined || productId.value === null || productId.value === '') {
    await reloadProductList()
    return
  }

  replaceProductList((await searchProductForId(productId.value)).data)
}

// 查询申请产品，按当前条件筛出目标结果。
const searchApplyProduct = async () => {
  if (productOutId.value === undefined || productOutId.value === null || productOutId.value === '') {
    await reloadApplyProductList()
    return
  }

  replaceApplyProductList((await searchProductForApplyId(productOutId.value)).data)
}

// 记录库存，方便后续逻辑统一读取和更新。
const in_warehouse = ref()
// 处理产品库存，把当前模块的关键逻辑集中在这里。
const productInWarehouse = () => {
  if (!hasPermission('button.product.create')) return
  in_warehouse.value.open()
}

// 处理产品，把当前操作正式提交到业务流程里。
const apply_product = ref()
// 处理当前操作，让页面动作真正进入业务流程。
const applyOut = (row) => {
  // 出库弹窗直接复用当前库存行，避免页面再手动拆字段。
  if (!hasPermission('button.product.apply')) return
  apply_product.value.open(row)
}

// 更新产品，让当前记录按最新输入重新保存。
const edit_product = ref()
// 更新产品，让当前记录按最新输入重新保存。
const editProduct = (row) => {
  if (!hasPermission('button.product.edit')) return
  edit_product.value.open(row)
}

// 删除产品，避免旧数据继续影响后续流程。
const delete_product = ref()
// 删除产品，避免旧数据继续影响后续流程。
const deleteProduct = (id) => {
  if (!hasPermission('button.product.delete')) return
  delete_product.value.open(id)
}

// 处理产品，确保审核动作按当前规则落地。
const audit_product = ref()
// 处理产品，确保审核动作按当前规则落地。
const auditProduct = (row) => {
  if (!hasPermission('button.product.audit')) return
  audit_product.value.open(row)
}

// 记录产品，方便后续逻辑统一读取和更新。
const withdraw_product = ref()
// 处理产品，把当前模块的关键逻辑集中在这里。
const withdrawProduct = (id) => {
  if (!hasPermission('button.product.withdraw')) return
  withdraw_product.value.open(id)
}

// 记录产品，方便后续逻辑统一读取和更新。
const again_product = ref()
// 处理申请，把当前模块的关键逻辑集中在这里。
const againApply = (row) => {
  // 重新申请只针对被否决的出库记录，弹窗会沿用原申请内容做二次提交。
  if (!hasPermission('button.product.reapply')) return
  again_product.value.open(row)
}

// 页面首次进入后从这里拉起首屏数据或初始化流程。
onMounted(async () => {
  // 首次进入时同时准备两套列表，切到第二个标签页时就不需要额外等待。
  await reloadTwoPageList()
})
</script>

<style lang="scss" scoped>
:deep(.el-table .cell) {
  font-weight: 400;
}
</style>
