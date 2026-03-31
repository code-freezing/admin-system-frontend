<!--
  组件说明：
  1. 撤回出库申请弹窗。
  2. 允许申请人在审核前撤销已提交的出库申请。
  3. 撤回后产品记录会回到未申请状态。
-->
<template>
  <el-dialog v-model="dialogFormVisible" title="撤回出库申请" width="30%" center>
    <span>确认后将撤回该出库申请。</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="withdraw">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { withdrawApplyProduct } from '@/api/product'

const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
const withdrawId = ref<number | null>(null)

const open = (id: number) => {
  withdrawId.value = id
  dialogFormVisible.value = true
}

const withdraw = async () => {
  // 撤回成功后后端会清空当前产品记录上的申请字段，让库存回到未申请状态。
  const res = await withdrawApplyProduct(withdrawId.value as number)
  if (res.status == 0) {
    ElMessage.success('撤回成功')
    emit('success')
  } else {
    ElMessage.error('撤回失败')
  }
  dialogFormVisible.value = false
}

defineExpose({ open })
</script>

<style lang="scss" scoped></style>
