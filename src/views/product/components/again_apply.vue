<template>
  <el-dialog v-model="dialogFormVisible" title="重新申请出库" width="30%" center>
    <span>确认后将按当前信息重新提交申请。</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="applyProduct">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { applyOutProduct } from '@/api/product'

// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])

// 记录表单数据，方便后续逻辑统一读取和更新。
const formData = reactive({
  id: null,
  product_name: '',
  product_out_id: null,
  product_in_warehouse_number: null,
  product_single_price: null,
  product_out_number: null,
  product_out_apply_person: '',
  apply_memo: '',
})

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = (row: any) => {
  // 重新申请直接复用上一条申请快照，避免用户再重填一整份申请表单。
  formData.id = row.id
  formData.product_in_warehouse_number = row.product_in_warehouse_number
  formData.product_name = row.product_name
  formData.product_single_price = row.product_single_price
  formData.product_out_apply_person = row.product_out_apply_person
  formData.product_out_number = row.product_out_number
  formData.product_out_id = row.product_out_id
  formData.apply_memo = row.apply_memo ?? ''
  dialogFormVisible.value = true
}

// 处理产品，把当前操作正式提交到业务流程里。
const applyProduct = async () => {
  const res = await applyOutProduct(formData)
  if (res.status == 0) {
    ElMessage.success('重新申请成功')
    emit('success')
    dialogFormVisible.value = false
  } else {
    ElMessage.error('重新申请失败')
    dialogFormVisible.value = false
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped></style>
