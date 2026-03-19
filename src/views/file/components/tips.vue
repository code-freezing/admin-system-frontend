<template>
  <el-dialog v-model="dialogFormVisible" title="删除文件" width="30%" center>
    <span>确认后将永久删除该文件，删除后无法恢复。</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="operationFiles">删除</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { deleteFile } from '@/api/file'

const emit = defineEmits(['success'])
const dialogFormVisible = ref(false)
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
    ElMessage.success('文件删除成功')
    emit('success')
  } else {
    ElMessage.error('文件删除失败')
  }
  dialogFormVisible.value = false
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped></style>
