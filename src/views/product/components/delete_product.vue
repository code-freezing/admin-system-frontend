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
