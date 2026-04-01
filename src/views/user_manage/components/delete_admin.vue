<template>
  <el-dialog v-model="dialogFormVisible" title="删除用户" width="30%" center>
    <span v-if="adminId">确认后会将管理员降级为普通用户。</span>
    <span v-else>确认后会永久删除该用户。</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="deleteAdmin">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { changeIdentityToUser, deleteUser } from '@/api/userinfor'
import { useUserInfo } from '@/stores/userinfor'
import { tracking } from '@/utils/operation'

// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
const userStore = useUserInfo()
// 记录当前状态，方便后续逻辑统一读取和更新。
const adminId = ref(null)
// 记录用户，方便后续逻辑统一读取和更新。
const userId = ref(null)
// 记录当前状态，方便后续逻辑统一读取和更新。
const account = ref('')
// 记录名称，方便后续逻辑统一读取和更新。
const name = ref('')

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = (target) => {
  // 一个弹窗同时服务管理员降级和普通用户删除两种动作，打开时先清空上一次目标信息。
  adminId.value = null
  userId.value = null
  account.value = ''
  name.value = ''

  if (target.kind === 'admin') {
    adminId.value = target.id
  } else {
    userId.value = target.id
    account.value = target.account
    name.value = target.name
  }

  dialogFormVisible.value = true
}

// 删除当前记录，避免旧数据继续影响后续流程。
const deleteAdmin = async () => {
  // 管理员删除本质是降级成普通用户，只有普通用户删除才会真正删账号。
  if (adminId.value) {
    const res = await changeIdentityToUser(adminId.value)
    if (res.status == 0) {
      ElMessage.success('管理员已降级')
      emit('success', 'delete')
    } else {
      ElMessage.error('管理员降级失败')
    }
    dialogFormVisible.value = false
    return
  }

  if (userId.value) {
    const res = await deleteUser(userId.value, account.value)
    if (res.status == 0) {
      await tracking('删除用户', userStore.name, name.value, '高级')
      ElMessage.success('用户已删除')
      emit('success', 'delete')
    } else {
      ElMessage.error('用户删除失败')
    }
    dialogFormVisible.value = false
  }
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped></style>
