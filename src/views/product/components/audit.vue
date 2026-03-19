<template>
  <el-dialog v-model="dialogFormVisible" title="审核产品" width="30%" center>
    <div class="describe">确定审核此产品的出库吗？</div>
    <el-radio-group v-model="formData.product_out_status" class="ml-4">
      <el-radio label="同意" size="large">同意</el-radio>
      <el-radio label="否决" size="large">否决</el-radio>
    </el-radio-group>
    <el-input v-model="formData.audit_memo" type="textarea" placeholder="请输入审核备注" />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="audit"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { auditProduct } from '@/api/product'
import { ElMessage } from 'element-plus'
import { tracking } from '@/utils/operation'

const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])

const formData = reactive({
  id: 0,
  product_name: '',
  product_out_id: 0,
  product_out_status: '',
  audit_memo: '',
  product_out_price: 0,
  product_out_audit_person: localStorage.getItem('name'),
  product_out_apply_person: '',
  product_in_warehouse_number: 0,
  product_single_price: 0,
  product_out_number: '',
  product_apply_time: '',
})

const open = (row: any) => {
  formData.id = row.id
  formData.product_out_id = row.product_out_id
  formData.product_name = row.product_name
  formData.product_out_status = row.product_out_status
  formData.audit_memo = row.audit_memo
  formData.product_out_price = row.product_out_price
  formData.product_out_apply_person = row.product_out_apply_person
  formData.product_in_warehouse_number = row.product_in_warehouse_number
  formData.product_single_price = row.product_single_price
  formData.product_out_number = row.product_out_number
  formData.product_apply_time = row.product_apply_time
  dialogFormVisible.value = true
}

const audit = async () => {
  const res = await auditProduct(formData)
  console.log(res)
  if (res.status == 0) {
    ElMessage({ message: '审核产品成功', type: 'success' })
    emit('success')
    const userInfoStr = localStorage.getItem('userinfo')
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null
    const operatorName = userInfo?.name ?? ''
    await tracking('产品', operatorName, formData.product_name, '高级', formData.product_out_status)
    dialogFormVisible.value = false
  } else {
    ElMessage.error('审核产品失败')
    dialogFormVisible.value = false
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.describe {
  margin-bottom: 8px;
}
</style>
