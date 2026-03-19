<template>
  <!-- 修改密码 -->
  <el-dialog v-model="state.changePasswordDialog" title="修改密码" width="400px">
    <el-form class="login-form" :label-position="labelPosition" :rules="rules">
      <el-form-item label="请输入您的旧密码" prop="oldPassword">
        <el-input v-model="passwordData.oldPassword" placeholder="请输入您的旧密码" show-password />
      </el-form-item>
      <el-form-item label="请输入您的新密码" prop="newPassword">
        <el-input v-model="passwordData.newPassword" placeholder="请输入您的新密码" show-password />
      </el-form-item>
    </el-form>
    <!-- 底部内容 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.changePasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="changeUserPassword"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { changePassword } from '@/api/userinfor.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserInfo } from '@/stores/userinfor'
import { useMenu } from '@/stores/menu'

const router = useRouter()
const userStore = useUserInfo()
const menuStore = useMenu()

// 表单对齐方式
const labelPosition = ref('top')
// 表单对象接口
// 瀵嗙爜鏄湁瀛楁瘝璺熸暟瀛?鎵€鏈夋槸string
interface passwordData {
  oldPassword: string
  newPassword: string
}
// 表单对象
const passwordData: passwordData = reactive({
  oldPassword: '',
  newPassword: '',
})
// 表单规则
const rules = reactive({
  oldPassword: [{ required: true, message: '请输入您的旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入您的新密码', trigger: 'blur' }],
})
// 控制弹窗 默认关闭
const state = reactive({
  changePasswordDialog: false,
})

// 淇敼瀵嗙爜 id 璺?涓や釜 password
const changeUserPassword = async () => {
  if (passwordData.oldPassword && passwordData.newPassword) {
    const userId = userStore.id
    if (!userId) {
      ElMessage.error('用户ID缺失，请重新登录')
      return
    }

    // 调用接口
    const res = await changePassword(userId, passwordData.oldPassword, passwordData.newPassword)
    console.log(res)
    if (res.status == 0) {
      ElMessage({
        message: '修改成功',
        type: 'success',
      })
      state.changePasswordDialog = false
      menuStore.clearRouter()
      router.push('/login')
    } else {
      ElMessage.error('淇敼瀵嗙爜澶辫触锛岃閲嶆柊杈撳叆锛?')
    }
  } else {
    ElMessage.error('请检查输入的数据！')
  }
}
// 鎵撳紑淇敼瀵嗙爜鐨勫脊绐?
const open = () => {
  state.changePasswordDialog = true
}

defineExpose({
  open,
})

// onBeforeUnmount(()=>{
// })
</script>

<style lang="scss" scoped></style>
