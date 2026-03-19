<template>
  <el-dialog v-model="dialogFormVisible" title="撤回申请" width="30%" center>
    <span>确定取消此产品的出库申请吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="withdraw"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { withdrawApplyProduct } from '@/api/product'
import { ElMessage } from 'element-plus'

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
    ElMessage({ message: '撤回申请成功', type: 'success' })
    emit('success')
    dialogFormVisible.value = false
  } else {
    ElMessage.error('撤回申请失败')
    dialogFormVisible.value = false
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped></style>

