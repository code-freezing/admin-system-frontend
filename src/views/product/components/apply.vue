<template>
  <el-dialog v-model="dialogFormVisible" title="产品出库申请" width="600px" align-center draggable>
    <div class="product-name">产品名称：{{ formDataInfo.product_name }}</div>
    <div class="product-name">
      当前库存：{{ formDataInfo.product_in_warehouse_number }}
    </div>
    <div class="dialog-content">
      <el-form
        ref="ruleFormRef"
        :model="formDataInfo"
        :label-position="labelPosition"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="出库编号" prop="product_out_id">
          <el-input v-model="formDataInfo.product_out_id" />
        </el-form-item>
        <el-form-item label="出库数量" prop="product_out_number">
          <el-input v-model="formDataInfo.product_out_number" />
        </el-form-item>
        <el-form-item label="申请人" prop="product_out_apply_person">
          <el-input v-model="formDataInfo.product_out_apply_person" disabled />
        </el-form-item>
        <el-form-item label="单价" prop="product_single_price">
          <el-input v-model="formDataInfo.product_single_price" disabled />
        </el-form-item>
        <el-form-item label="申请备注" prop="apply_memo">
          <el-input v-model="formDataInfo.apply_memo" :rows="2" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :disabled="!canSubmitOutApply" @click="addProduct">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { applyOutProduct } from '@/api/product'
import { useUserInfo } from '@/stores/userinfor'

// 记录当前状态，方便后续逻辑统一读取和更新。
const labelPosition = ref('left')
// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
const userStore = useUserInfo()

// 记录表单数据信息，方便后续逻辑统一读取和更新。
const formDataInfo = reactive({
  id: null,
  product_name: '',
  product_out_id: null,
  product_in_warehouse_number: null,
  product_single_price: null,
  product_out_number: null,
  product_out_apply_person: userStore.name,
  apply_memo: '',
})

// 记录校验规则，方便后续逻辑统一读取和更新。
const rules = reactive({
  product_out_id: [{ required: true, message: '请输入出库编号', trigger: 'blur' }],
  product_out_number: [{ required: true, message: '请输入出库数量', trigger: 'blur' }],
  product_out_apply_person: [{ required: true, message: '申请人不能为空', trigger: 'blur' }],
})

// 基于现有状态派生申请，避免同一份结果在多个地方重复计算。
const canSubmitOutApply = computed(() => {
  // 申请数量不能超过当前库存，前端先做一层即时限制减少无效提交。
  const warehouseNumber = formDataInfo.product_in_warehouse_number
  const outNumber = formDataInfo.product_out_number
  if (warehouseNumber == null || outNumber == null) return false
  return warehouseNumber >= outNumber
})

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = (row) => {
  // 每次打开都重置申请字段，避免上一条库存记录的编号和备注串到下一次申请。
  formDataInfo.id = row.id
  formDataInfo.product_in_warehouse_number = row.product_in_warehouse_number
  formDataInfo.product_name = row.product_name
  formDataInfo.product_single_price = row.product_single_price
  formDataInfo.product_out_number = null
  formDataInfo.product_out_id = null
  formDataInfo.product_out_apply_person = userStore.name
  formDataInfo.apply_memo = ''
  dialogFormVisible.value = true
}

// 添加产品，把新结果并入当前状态。
const addProduct = async () => {
  // 申请只会写回当前 product 记录，真正扣库存要等审核通过后才发生。
  const res = await applyOutProduct(formDataInfo)
  if (res.status == 0) {
    ElMessage.success('出库申请已提交')
    emit('success')
    dialogFormVisible.value = false
  } else {
    ElMessage.error('出库申请提交失败')
    dialogFormVisible.value = false
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.dialog-content {
  display: flex;
  padding: 0 30px 20px 30px;
}

.product-name {
  display: flex;
  justify-content: center;
  font-size: 16px;
  margin: 10px;
  color: #333;
}

:deep(.el-form-item) {
  margin: 30px;
}
</style>
