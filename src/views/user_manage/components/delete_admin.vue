<!--
  组件说明：
  1. 删除管理员确认弹窗。
  2. 用于删除管理员账号前的二次确认。
  3. 与列表页解耦后，可以统一危险操作反馈。
-->
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

type DeleteTarget =
  | { kind: 'admin'; id: number }
  | { kind: 'user'; id: number; account: string; name: string }

const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
const userStore = useUserInfo()
const adminId = ref<number | null>(null)
const userId = ref<number | null>(null)
const account = ref('')
const name = ref('')

const open = (target: DeleteTarget) => {
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

const deleteAdmin = async () => {
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
