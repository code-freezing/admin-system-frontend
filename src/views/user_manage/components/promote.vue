<template>
  <el-dialog v-model="dialogPromoteVisible" title="赋权操作" center width="30%">
    <el-radio-group v-model="radio" class="ml-4">
      <el-radio label="产品管理员" size="large">产品管理员</el-radio>
      <el-radio label="用户管理员" size="large">用户管理员</el-radio>
      <el-radio label="消息管理员" size="large">消息管理员</el-radio>
    </el-radio-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="yes"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { changeIdentityToAdmin } from '@/api/userinfor.js'
import { ElMessage } from 'element-plus'

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
  if (!userid.value) return
  const res = await changeIdentityToAdmin(userid.value, radio.value)
  if (res.status == 0) {
    ElMessage({
      message: '赋权管理员成功',
      type: 'success',
    })
    emit('success')
    dialogPromoteVisible.value = false
  } else {
    ElMessage.error('赋权管理员失败')
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

