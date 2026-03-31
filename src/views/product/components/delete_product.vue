<!--
  组件说明：
  1. 产品删除确认弹窗。
  2. 用于删除库存记录前的二次确认，避免误操作直接影响列表数据。
  3. 危险操作与主表格拆开后，页面逻辑会更清晰。
-->
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

const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
const productId = ref<number | null>(null)

const open = (id: number) => {
  productId.value = id
  dialogFormVisible.value = true
}

const remove = async () => {
  // 删除成功后只通知父页面刷新当前列表，弹窗本身不接管表格状态。
  const res = await deleteProduct(productId.value as number)
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
