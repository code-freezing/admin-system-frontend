<!--
  组件说明：
  1. 操作日志提示弹窗。
  2. 用于展示日志详情或页面辅助说明。
  3. 它让主页面可以专注于筛选和列表呈现。
-->
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
const dialogFormVisible = ref(false)

const open = () => {
  dialogFormVisible.value = true
}

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
