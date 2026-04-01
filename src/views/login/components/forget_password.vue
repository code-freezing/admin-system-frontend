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
import { ElMessage } from 'element-plus'
import { reset, verify } from '@/api/login'

// 记录当前状态，方便后续逻辑统一读取和更新。
const labelPosition = ref('top')
// 校验表单，确保当前请求符合业务要求。
const verifyFormRef = ref()
// 重置表单，把当前流程恢复到干净初始状态。
const resetFormRef = ref()

// 记录显示状态，方便后续逻辑统一读取和更新。
const forgetVisible = ref(false)
// 重置显示状态，把当前流程恢复到干净初始状态。
const resetVisible = ref(false)
// 重置用户，把当前流程恢复到干净初始状态。
const resetUserId = ref(null)

// 校验表单，确保当前请求符合业务要求。
const verifyForm = reactive({
  account: '',
  email: '',
})

// 重置表单，把当前流程恢复到干净初始状态。
const resetForm = reactive({
  password: '',
  nextPassword: '',
})

const verifyRules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
}

const resetRules = {
  password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  nextPassword: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }],
}

// 清理表单，防止旧状态残留到下一次流程。
const clearResetForm = () => {
  resetForm.password = ''
  resetForm.nextPassword = ''
}

// 处理当前分支的核心逻辑，避免同类操作散落在多个位置。
const handleVerify = async () => {
  // 先验证账号和邮箱，再进入重置密码步骤，避免直接暴露重置入口。
  const valid = await verifyFormRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  const res = await verify(verifyForm)
  if (res.status === 0 && typeof res.data.id === 'number') {
    resetUserId.value = res.data.id
    forgetVisible.value = false
    resetVisible.value = true
    ElMessage.success('验证成功，请继续修改密码')
    return
  }

  ElMessage.error('账号或邮箱验证失败')
}

// 处理当前分支的核心逻辑，避免同类操作散落在多个位置。
const handleReset = async () => {
  // 重置密码前先校验两次输入一致，再把当前用户 id 和新密码一起提交给后端。
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
  if (res.status === 0) {
    ElMessage.success('密码修改成功')
    resetVisible.value = false
    clearResetForm()
    return
  }

  ElMessage.error('密码修改失败')
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = () => {
  forgetVisible.value = true
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped></style>
