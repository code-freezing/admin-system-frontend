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

const canSubmitOutApply = computed(() => {
  const warehouseNumber = formDataInfo.product_in_warehouse_number
  const outNumber = formDataInfo.product_out_number
  if (warehouseNumber == null || outNumber == null) return false
  return warehouseNumber >= outNumber
})

const open = (row: any) => {
  formDataInfo.id = row.id
  formDataInfo.product_in_warehouse_number = row.product_in_warehouse_number
  formDataInfo.product_name = row.product_name
  formDataInfo.product_single_price = row.product_single_price
  formDataInfo.product_out_number = null
  formDataInfo.product_out_id = null
  formDataInfo.apply_memo = ''
  dialogFormVisible.value = true
}

const addProduct = async () => {
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
