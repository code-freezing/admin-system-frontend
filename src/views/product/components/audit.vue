<!--
  组件说明：
  1. 出库审核弹窗。
  2. 供审核人查看申请详情并给出同意或否决结果。
  3. 审核通过后会真正扣减库存并写入出库历史。
-->
<template>
  <el-dialog v-model="dialogFormVisible" title="审核出库申请" width="30%" center>
    <div class="describe">确认审核结果后再提交。</div>
    <el-radio-group v-model="formData.product_out_status" class="ml-4">
      <el-radio label="待出库" size="large">待出库</el-radio>
      <el-radio label="已驳回" size="large">已驳回</el-radio>
    </el-radio-group>
    <el-input v-model="formData.audit_memo" type="textarea" placeholder="请输入审核备注" />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="audit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { auditProduct } from '@/api/product'
import { tracking } from '@/utils/operation'

// 审核弹窗直接消费申请行数据，审批结果只有“同意/否决”两种。
interface AuditForm {
  id: number
  product_name: string
  product_out_id: number
  product_out_status: string
  audit_memo: string
  product_out_price: number
  product_out_audit_person: string | null
  product_out_apply_person: string
  product_in_warehouse_number: number
  product_single_price: number
  product_out_number: string
  product_apply_time: string
}

const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])

const formData = reactive<AuditForm>({
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

// 打开弹窗时把当前申请快照拷进表单，确保提交时后端有完整审核上下文。
const open = (row: any) => {
  // 审核时需要的不只是申请结果，还包括当前库存、申请数量、单价、申请时间等上下文。
  // 因此这里直接保存整条申请快照，避免后端再次做额外查询拼装。
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

// 审核成功后除了刷新列表，还会记录一条操作日志，便于后台追溯。
const audit = async () => {
  const res = await auditProduct(formData)
  if (res.status == 0) {
    // 操作日志记录的是“谁对哪个产品做了什么审核”，
    // 这样之后在操作日志页里可以直接回溯审批行为。
    const userInfoStr = localStorage.getItem('userinfo')
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null
    const operatorName = userInfo?.name ?? ''
    await tracking('产品审核', operatorName, formData.product_name, '高级', formData.product_out_status)
    ElMessage.success('审核成功')
    emit('success')
    dialogFormVisible.value = false
  } else {
    ElMessage.error('审核失败')
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
