<!--
  组件说明：
  1. 消息删除确认弹窗。
  2. 用于把消息放入回收站或执行删除前的二次确认。
  3. 把危险操作单独封装，便于统一处理提示文案。
-->
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

// 删除弹窗同时服务三种动作：放入回收站、从回收站恢复、永久删除。
const emit = defineEmits(['success'])
const dialogFormVisible = ref(false)
const mode = ref<'delete' | 'recover' | 'real-delete'>('delete')
const messageId = ref<number | null>(null)
const department = ref<string | null>(null)

const titleText = computed(() => {
  if (mode.value === 'recover') return '恢复消息'
  if (mode.value === 'real-delete') return '永久删除消息'
  return '删除消息'
})

const tips = computed(() => {
  if (mode.value === 'recover') return '确认后会把消息恢复到原来的列表。'
  if (mode.value === 'real-delete') return '确认后会永久删除这条消息，无法恢复。'
  return '确认后会先把消息放入回收站。'
})

// 列表页通过不同的 open 方法切换模式，组件内部再决定调用哪个接口。
const openDelete = (row: any) => {
  mode.value = 'delete'
  messageId.value = row.id
  department.value = row.message_receipt_object
  dialogFormVisible.value = true
}

const openRecover = (row: any) => {
  mode.value = 'recover'
  messageId.value = row.id
  department.value = row.message_receipt_object
  dialogFormVisible.value = true
}

const openRealDelete = (id: number) => {
  mode.value = 'real-delete'
  messageId.value = id
  department.value = null
  dialogFormVisible.value = true
}

// 三种模式最终都复用同一个确认按钮，避免页面层重复写删除逻辑。
const operationMessage = async () => {
  let res: any

  if (mode.value === 'delete') {
    res = await firstDelete(messageId.value as number)
  } else if (mode.value === 'recover') {
    res = await recover(messageId.value as number)
  } else {
    res = await deleteMessage(messageId.value as number)
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
