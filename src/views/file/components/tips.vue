<template>
  <el-dialog v-model="dialogFormVisible" title="删除文件" width="30%" center>
    <span>请慎重操作！您确定要真正删除这个文件吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="operationFiles"> 删除 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { deleteFile } from '@/api/file'
import { ElMessage } from 'element-plus'

const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
const fileId = ref<number>()
const fileName = ref<string>()

const open = (row: any) => {
  fileId.value = row.id
  fileName.value = row.file_name
  dialogFormVisible.value = true
}

const operationFiles = async () => {
  const res = await deleteFile(fileId.value as number, fileName.value as string)
  if (res.status == 0) {
    ElMessage({
      message: '删除文件成功',
      type: 'success',
    })
    emit('success')
    dialogFormVisible.value = false
  } else {
    ElMessage.error('删除文件失败')
    dialogFormVisible.value = false
  }
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped></style>
