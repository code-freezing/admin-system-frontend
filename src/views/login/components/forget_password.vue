<!--
  组件说明：
  1. 登录页找回密码弹窗。
  2. 用户先校验账号与邮箱，再通过该组件完成密码重置。
  3. 它复用后端的账号安全接口，但不依赖已登录状态。
-->
<template>
  <el-dialog v-model="forgetVisible" title="忘记密码" width="400px" destroy-on-close>
    <el-form
      ref="verifyFormRef"
      class="login-form"
      :model="verifyForm"
      :label-position="labelPosition"
      :rules="verifyRules"
    >
      <el-form-item label="账号" prop="account">
        <el-input v-model="verifyForm.account" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="verifyForm.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="forgetVisible = false">取消</el-button>
        <el-button type="primary" @click="handleVerify">下一步</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="resetVisible" title="修改密码" width="400px" destroy-on-close>
    <el-form
      ref="resetFormRef"
      class="login-form"
      :model="resetForm"
      :label-position="labelPosition"
      :rules="resetRules"
    >
      <el-form-item label="新密码" prop="password">
        <el-input v-model="resetForm.password" placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="nextPassword">
        <el-input v-model="resetForm.nextPassword" placeholder="请再次输入新密码" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReset">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormProps, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reset, verify } from '@/api/login'

interface VerifyFormModel {
  account: string
  email: string
}

interface ResetFormModel {
  password: string
  nextPassword: string
}

const labelPosition = ref<FormProps['labelPosition']>('top')
const verifyFormRef = ref<FormInstance>()
const resetFormRef = ref<FormInstance>()

const forgetVisible = ref(false)
const resetVisible = ref(false)
const resetUserId = ref<number | null>(null)

const verifyForm = reactive<VerifyFormModel>({
  account: '',
  email: '',
})

const resetForm = reactive<ResetFormModel>({
  password: '',
  nextPassword: '',
})

const verifyRules: FormRules<VerifyFormModel> = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
}

const resetRules: FormRules<ResetFormModel> = {
  password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  nextPassword: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }],
}

const clearResetForm = () => {
  resetForm.password = ''
  resetForm.nextPassword = ''
}

const handleVerify = async () => {
  const valid = await verifyFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  const res = (await verify(verifyForm)) as { status?: number; id?: number }
  if (res.status === 0 && typeof res.id === 'number') {
    resetUserId.value = res.id
    forgetVisible.value = false
    resetVisible.value = true
    ElMessage.success('验证成功，请继续修改密码')
    return
  }

  ElMessage.error('账号或邮箱验证失败')
}

const handleReset = async () => {
  const valid = await resetFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  if (resetForm.password !== resetForm.nextPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  if (resetUserId.value === null) {
    ElMessage.error('未找到可重置的用户信息')
    return
  }

  const res = await reset(resetUserId.value, resetForm.nextPassword)
  if ((res as { status?: number }).status === 0) {
    ElMessage.success('密码修改成功')
    resetVisible.value = false
    clearResetForm()
    return
  }

  ElMessage.error('密码修改失败')
}

const open = () => {
  forgetVisible.value = true
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped></style>
