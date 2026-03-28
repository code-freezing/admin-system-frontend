<!--
  组件说明：
  1. 出库申请弹窗。
  2. 从库存列表发起出库申请，填写申请编号、数量、申请人和备注。
  3. 提交后产品不会立即扣库，而是进入待审核状态。
-->
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
import type { FormProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { applyOutProduct } from '@/api/product'

// 出库申请弹窗从列表行带入当前库存和单价，用户只补充申请编号、数量和备注。
interface FormData {
  id: number | null
  product_name: string
  product_out_id: number | null
  product_in_warehouse_number: number | null
  product_single_price: number | null
  product_out_number: number | null
  product_out_apply_person: string | null
  apply_memo: string
}

const labelPosition = ref<FormProps['labelPosition']>('left')
const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])

const formDataInfo = reactive<FormData>({
  id: null,
  product_name: '',
  product_out_id: null,
  product_in_warehouse_number: null,
  product_single_price: null,
  product_out_number: null,
  product_out_apply_person: localStorage.getItem('name'),
  apply_memo: '',
})

const rules = reactive({
  product_out_id: [{ required: true, message: '请输入出库编号', trigger: 'blur' }],
  product_out_number: [{ required: true, message: '请输入出库数量', trigger: 'blur' }],
  product_out_apply_person: [{ required: true, message: '申请人不能为空', trigger: 'blur' }],
})

// 申请数量不能大于当前库存，这个判断放在前端先做一层快速限制。
const canSubmitOutApply = computed(() => {
  const warehouseNumber = formDataInfo.product_in_warehouse_number
  const outNumber = formDataInfo.product_out_number
  if (warehouseNumber == null || outNumber == null) return false
  return warehouseNumber >= outNumber
})

const open = (row: any) => {
  // 每次打开都重置“申请相关字段”，避免上一次弹窗留下的编号或备注串到下一条产品。
  formDataInfo.id = row.id
  formDataInfo.product_in_warehouse_number = row.product_in_warehouse_number
  formDataInfo.product_name = row.product_name
  formDataInfo.product_single_price = row.product_single_price
  formDataInfo.product_out_number = null
  formDataInfo.product_out_id = null
  formDataInfo.apply_memo = ''
  dialogFormVisible.value = true
}

// 提交成功后通过 success 事件通知父页面刷新库存和申请列表。
const addProduct = async () => {
  // 后端会把这次申请写回当前 product 记录，而不是立刻生成出库历史。
  // 真正的库存扣减要等审核弹窗提交“同意”后才发生。
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
