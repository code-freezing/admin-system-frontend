<template>
  <el-dialog v-model="dialogFormVisible" title="删除产品" width="30%" center>
    <span>请慎重操作，删除后将失去此产品的记录</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="remove"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { deleteProduct } from '@/api/product'
import { ElMessage } from 'element-plus'

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
    ElMessage({ message: '删除产品成功', type: 'success' })
    emit('success')
    dialogFormVisible.value = false
  } else {
    ElMessage.error('删除产品失败')
    dialogFormVisible.value = false
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped></style>

