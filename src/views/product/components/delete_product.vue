<template>
  <el-dialog v-model="dialogFormVisible" title="删除产品" width="30%" center>
    <span>确认后将删除该产品，无法恢复。</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="remove">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { deleteProduct } from '@/api/product'

// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
// 记录产品，方便后续逻辑统一读取和更新。
const productId = ref(null)

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = (id) => {
  productId.value = id
  dialogFormVisible.value = true
}

// 移除不再需要的记录，避免脏数据继续留在当前流程里。
const remove = async () => {
  // 删除成功后只通知父页面刷新当前列表，弹窗本身不接管表格状态。
  const res = await deleteProduct(productId.value)
  if (res.status == 0) {
    ElMessage.success('产品删除成功')
    emit('success')
  } else {
    ElMessage.error('产品删除失败')
  }
  dialogFormVisible.value = false
}

defineExpose({ open })
</script>

<style lang="scss" scoped></style>
