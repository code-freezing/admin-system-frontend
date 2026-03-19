<template>
  <el-dialog v-model="dialogFormVisible" :title="title" width="30%" center>
    <span v-if="title.value == '删除信息'" v-html="tips"></span>
    <span v-else-if="title.value == '恢复消息'" v-html="tips"></span>
    <span v-else v-html="tips"></span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="operationMessage"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { firstDelete, recover, deleteMessage } from '@/api/message'
import { ElMessage } from 'element-plus'

const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
const title = ref<any>()
const tips = ref<string>()
const messageId = ref<number | null>()
const department = ref<string | null>()

const openDelete = (row: any) => {
  title.value = '删除信息'
  tips.value = '您确定要删除这个公告吗？'
  messageId.value = row.id
  department.value = row.message_receipt_object
  dialogFormVisible.value = true
}

const openRecover = (row: any) => {
  title.value = '恢复消息'
  tips.value = '您确定要恢复这个公告吗？'
  messageId.value = row.id
  department.value = row.message_receipt_object
  dialogFormVisible.value = true
}

const openRealDelete = (id: number) => {
  title.value = '真正删除信息'
  tips.value = '请慎重操作！您确定要真正删除这个公告吗？'
  messageId.value = id
  department.value = null
  dialogFormVisible.value = true
}

const operationMessage = async () => {
  if (title.value == '删除信息') {
    const res = await firstDelete(messageId.value as number)
    if (res.status == 0) {
      ElMessage({ message: '删除公告成功', type: 'success' })
      emit('success')
      dialogFormVisible.value = false
    } else {
      ElMessage.error('删除公告失败')
      dialogFormVisible.value = false
    }
  }
  if (title.value == '恢复消息') {
    const res = await recover(messageId.value as number)
    if (res.status == 0) {
      ElMessage({ message: '恢复公告成功', type: 'success' })
      emit('success')
      dialogFormVisible.value = false
    } else {
      ElMessage.error('恢复公告失败')
      dialogFormVisible.value = false
    }
  }
  if (title.value == '真正删除信息') {
    const res = await deleteMessage(messageId.value as number)
    if (res.status == 0) {
      ElMessage({ message: '删除公告成功', type: 'success' })
      emit('success')
      dialogFormVisible.value = false
    } else {
      ElMessage.error('删除公告失败')
      dialogFormVisible.value = false
    }
  }
}

defineExpose({
  openDelete,
  openRecover,
  openRealDelete,
})
</script>

<style lang="scss" scoped></style>

