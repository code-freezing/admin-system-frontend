<template>
  <el-dialog v-model="dialogFormVisible" title="删除操作" width="30%" center>
    <span v-if="adminId">是否移除该用户的管理员职位？删除后该用户将重新显示在用户列表中。</span>
    <span v-else>请慎重操作，删除后该用户将永久失去登录资格。</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="deleteAdmin"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { changeIdentityToUser, deleteUser } from '@/api/userinfor.js'
import { ElMessage } from 'element-plus'
import { tracking } from '@/utils/operation.js'

type DeleteTarget =
  | { kind: 'admin'; id: number }
  | { kind: 'user'; id: number; account: string; name: string }

const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
const adminId = ref<number | null>(null)
const userid = ref<number | null>(null)
const account = ref('')
const name = ref('')

const open = (target: DeleteTarget) => {
  adminId.value = null
  userid.value = null
  account.value = ''
  name.value = ''

  if (target.kind === 'admin') {
    adminId.value = target.id
  } else {
    userid.value = target.id
    account.value = target.account
    name.value = target.name
  }
  dialogFormVisible.value = true
}

const deleteAdmin = async () => {
  if (adminId.value) {
    const res = await changeIdentityToUser(adminId.value)
    if (res.status == 0) {
      ElMessage({
        message: '管理员降职成功',
        type: 'success',
      })
      emit('success', 'delete')
      dialogFormVisible.value = false
    } else {
      ElMessage.error('管理员降职失败')
      dialogFormVisible.value = false
    }
  }
  if (userid.value) {
    const res = await deleteUser(userid.value, Number(account.value))
    if (res.status == 0) {
      ElMessage({
        message: '删除用户成功',
        type: 'success',
      })
      const userInfoStr = localStorage.getItem('userinfo')
      const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null
      const operatorName = userInfo?.name ?? ''

      await tracking('管理员', operatorName, name.value, 'high')
      dialogFormVisible.value = false
      emit('success', 'delete')
    } else {
      ElMessage.error('删除用户失败')
      dialogFormVisible.value = false
    }
  }
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped></style>



