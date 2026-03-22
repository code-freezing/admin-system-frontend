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

// 重新申请弹窗复用原申请数据，适合被否决后按原信息再次提交。
interface FormData {
  id: number | null
  product_name: string
  product_out_id: number | null
  product_in_warehouse_number: number | null
  product_single_price: number | null
  product_out_number: number | null
  product_out_apply_person: string
  apply_memo: string
}

const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])

const formData = reactive<FormData>({
  id: null,
  product_name: '',
  product_out_id: null,
  product_in_warehouse_number: null,
  product_single_price: null,
  product_out_number: null,
  product_out_apply_person: '',
  apply_memo: '',
})

// 打开时直接把上一条申请的快照带入，用户无需重新填写整份表单。
const open = (row: any) => {
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

// 成功后仍然通过 success 通知父页面刷新申请列表。
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
