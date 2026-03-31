<!--
  组件说明：
  1. 修改密码弹窗。
  2. 已登录用户通过这里校验旧密码并提交新密码。
  3. 密码相关规则由后端 Joi 校验和 bcrypt 哈希共同保证。
-->
<template>
  <el-dialog v-model="state.changePasswordDialog" title="修改密码" width="400px">
    <el-form class="login-form" :label-position="labelPosition" :rules="rules">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="passwordData.oldPassword" placeholder="请输入旧密码" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordData.newPassword" placeholder="请输入新密码" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.changePasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="changeUserPassword">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { changePassword } from '@/api/userinfor'
import { useMenu } from '@/stores/menu'
import { useUserInfo } from '@/stores/userinfor'

interface PasswordData {
  oldPassword: string
  newPassword: string
}

const router = useRouter()
const userStore = useUserInfo()
const menuStore = useMenu()

const labelPosition = ref('top')
const state = reactive({
  changePasswordDialog: false,
})

const passwordData = reactive<PasswordData>({
  oldPassword: '',
  newPassword: '',
})

const rules = reactive({
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
})

const changeUserPassword = async () => {
  // 修改密码成功后强制重新登录，避免继续复用旧会话和旧动态路由。
  if (!passwordData.oldPassword || !passwordData.newPassword) {
    ElMessage.error('请先输入完整的密码信息')
    return
  }

  const userId = userStore.id
  if (!userId) {
    ElMessage.error('当前用户信息不完整')
    return
  }

  const res = await changePassword(userId, passwordData.oldPassword, passwordData.newPassword)
  if (res.status == 0) {
    ElMessage.success('密码修改成功')
    state.changePasswordDialog = false
    menuStore.clearRouter()
    router.push('/login')
  } else {
    ElMessage.error('密码修改失败')
  }
}

const open = () => {
  state.changePasswordDialog = true
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped></style>
