<template>
  <!-- 忘记密码 -->
  <el-dialog v-model="state.forgetPasswordDialog" title="忘记密码" width="400px">
    <el-form class="login-form" :label-position="labelPosition" :rules="rules">
      <el-form-item label="输入您的注册账号" prop="account">
        <el-input v-model="forgetData.account" placeholder="输入您的注册账号" />
      </el-form-item>
      <el-form-item label="输入您的个人邮箱" prop="email">
        <el-input v-model="forgetData.email" placeholder="输入您的个人邮箱" />
      </el-form-item>
    </el-form>
    <!-- 底部内容 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.forgetPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="verifyAccount"> 下一步 </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 修改密码 -->
  <el-dialog v-model="state.changePasswordDialog" title="修改密码" width="400px">
    <el-form class="login-form" :label-position="labelPosition" :rules="rules">
      <el-form-item label="输入您的新密码" prop="password">
        <el-input v-model="forgetData.password" placeholder="输入您的新密码" show-password />
      </el-form-item>
      <el-form-item label="再次确认您的新密码" prop="nextPassword">
        <el-input
          v-model="forgetData.nextPassword"
          placeholder="再次确认您的新密码"
          show-password
        />
      </el-form-item>
    </el-form>
    <!-- 底部内容 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.changePasswordDialog = false">取消</el-button>
        <el-button type="primary"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormProps } from 'element-plus'
// 表单对齐方式
const labelPosition = ref<FormProps['labelPosition']>('top')
// 表单对象接口
interface Forget {
  account: number | null
  email: string
  password: string
  nextPassword: string
}
// 表单对象
const forgetData: Forget = reactive({
  account: null,
  email: '',
  password: '',
  nextPassword: '',
})
// 表单规则
const rules = reactive({
  account: [{ required: true, message: '请输入您的注册账号', trigger: 'blur' }],
  email: [{ required: true, message: '请输入您的注册邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入您想修改的密码', trigger: 'blur' }],
  nextPassword: [{ required: true, message: '请再次确认您的新密码', trigger: 'blur' }],
})
// 控制弹窗 默认关闭
const state = reactive({
  forgetPasswordDialog: false,
  changePasswordDialog: false,
})

// 打开验证邮箱和账号的弹窗
const verifyAccount = async () => {
  state.forgetPasswordDialog = false
  state.changePasswordDialog = true
}
// 打开弹窗
const open = () => {
  state.forgetPasswordDialog = true
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped></style>
