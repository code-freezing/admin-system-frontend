<template>
  <el-dialog v-model="dialogPromoteVisible" title="提升权限" center width="30%">
    <el-radio-group v-model="radio" class="ml-4">
      <el-radio label="产品管理员" size="large">产品管理员</el-radio>
      <el-radio label="用户管理员" size="large">用户管理员</el-radio>
      <el-radio label="消息管理员" size="large">消息管理员</el-radio>
    </el-radio-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="yes">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { changeIdentityToAdmin } from '@/api/userinfor'

const emit = defineEmits(['success'])
const dialogPromoteVisible = ref(false)
const userid = ref<number | null>(null)
const radio = ref('')

const open = (id: number) => {
  userid.value = id
  radio.value = ''
  dialogPromoteVisible.value = true
}

const yes = async () => {
  if (!userid.value || !radio.value) {
    ElMessage.error('请选择要提升的身份')
    return
  }

  const res = await changeIdentityToAdmin(userid.value, radio.value)
  if (res.status == 0) {
    ElMessage.success('用户权限已更新')
    emit('success')
    dialogPromoteVisible.value = false
  } else {
    ElMessage.error('权限更新失败')
    dialogPromoteVisible.value = false
  }
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped>
.el-radio-group {
  display: flex;
  justify-content: center;
}
</style>
