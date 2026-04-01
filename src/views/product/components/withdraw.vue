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

// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
// 记录当前状态，方便后续逻辑统一读取和更新。
const withdrawId = ref(null)

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = (id) => {
  withdrawId.value = id
  dialogFormVisible.value = true
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const withdraw = async () => {
  // 撤回成功后后端会清空当前产品记录上的申请字段，让库存回到未申请状态。
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
