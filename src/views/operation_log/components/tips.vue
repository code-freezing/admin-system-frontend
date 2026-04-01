<template>
  <el-dialog v-model="dialogFormVisible" title="清空操作日志" width="30%" center>
    <span>确认后会清空全部操作日志，无法恢复。</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="clearList">清空</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { clearOperationLogList } from '@/api/log'

const emit = defineEmits(['success'])
// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = () => {
  dialogFormVisible.value = true
}

// 清理列表，防止旧状态残留到下一次流程。
const clearList = async () => {
  // 清空成功后只通知父页面重拉日志列表，弹窗本身不维护外层分页状态。
  const res = await clearOperationLogList()
  if (res.status == 0) {
    ElMessage.success('操作日志已清空')
    emit('success')
  } else {
    ElMessage.error('清空操作日志失败')
  }
  dialogFormVisible.value = false
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped></style>
