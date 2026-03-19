<template>
  <el-dialog v-model="dialogFormVisible" title="清空登录日志" width="30%" center>
    <span>确认后会清空全部登录日志，无法恢复。</span>
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
import { clearLoginLogList } from '@/api/log'

const emit = defineEmits(['success'])
const dialogFormVisible = ref(false)

const open = () => {
  dialogFormVisible.value = true
}

const clearList = async () => {
  const res = await clearLoginLogList()
  if (res.status == 0) {
    ElMessage.success('登录日志已清空')
    emit('success')
  } else {
    ElMessage.error('清空登录日志失败')
  }
  dialogFormVisible.value = false
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped></style>
