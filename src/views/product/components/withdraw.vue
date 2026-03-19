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
  if (!withdrawId.value) return

  const res = await withdrawApplyProduct(withdrawId.value)
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
