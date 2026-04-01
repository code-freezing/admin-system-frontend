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
// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)
// 记录文件，方便后续逻辑统一读取和更新。
const fileId = ref()

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = (row) => {
  fileId.value = row.id
  dialogFormVisible.value = true
}

// 处理文件，把当前模块的关键逻辑集中在这里。
const operationFiles = async () => {
  // 文件删除成功后只通知父页面刷新文件列表，弹窗本身不接管分页状态。
  const res = await deleteFile(fileId.value)
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
