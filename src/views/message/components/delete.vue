<template>
  <el-dialog v-model="dialogFormVisible" :title="titleText" width="30%" center>
    <span>{{ tips }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="operationMessage">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { deleteMessage, firstDelete, recover } from '@/api/message'

const emit = defineEmits(['success'])
// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)
// 记录当前状态，方便后续逻辑统一读取和更新。
const mode = ref('delete')
// 记录消息，方便后续逻辑统一读取和更新。
const messageId = ref(null)

// 基于现有状态派生当前结果，避免同一份数据在多个地方重复计算。
const titleText = computed(() => {
  if (mode.value === 'recover') return '恢复消息'
  if (mode.value === 'real-delete') return '永久删除消息'
  return '删除消息'
})

// 基于现有状态派生当前结果，避免同一份数据在多个地方重复计算。
const tips = computed(() => {
  if (mode.value === 'recover') return '确认后会把消息恢复到原来的列表。'
  if (mode.value === 'real-delete') return '确认后会永久删除这条消息，无法恢复。'
  return '确认后会先把消息放入回收站。'
})

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openDelete = (row: any) => {
  mode.value = 'delete'
  messageId.value = row.id
  dialogFormVisible.value = true
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openRecover = (row: any) => {
  mode.value = 'recover'
  messageId.value = row.id
  dialogFormVisible.value = true
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openRealDelete = (id) => {
  mode.value = 'real-delete'
  messageId.value = id
  dialogFormVisible.value = true
}

// 处理消息，把当前模块的关键逻辑集中在这里。
const operationMessage = async () => {
  // 三种模式最终都复用同一个确认按钮，组件内部再决定调用哪个删除接口。
  let res

  if (mode.value === 'delete') {
    res = await firstDelete(messageId.value)
  } else if (mode.value === 'recover') {
    res = await recover(messageId.value)
  } else {
    res = await deleteMessage(messageId.value)
  }

  if (res.status == 0) {
    ElMessage.success('操作成功')
    emit('success')
  } else {
    ElMessage.error('操作失败')
  }

  dialogFormVisible.value = false
}

defineExpose({
  openDelete,
  openRecover,
  openRealDelete,
})
</script>

<style lang="scss" scoped></style>
