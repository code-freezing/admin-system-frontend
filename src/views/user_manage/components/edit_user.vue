<!--
  组件说明：
  1. 编辑普通用户信息弹窗。
  2. 用于维护普通员工的基础资料，便于用户管理员执行日常信息修正。
  3. 它与管理员编辑流程类似，但服务对象不同。
-->
<template>
  <el-dialog v-model="dialogFormVisible" title="编辑用户" width="600px" align-center draggable>
    <div class="dialog-content">
      <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="formData.account" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="formData.sex" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="formData.department" placeholder="请选择部门">
            <el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="editUser">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { editAdmin, getUserInfo } from '@/api/userinfor'
import { getDepartment } from '@/api/setting'

interface FormData {
  id?: number
  account: number
  name: string
  sex: string
  email: string
  department: string
}

const emit = defineEmits(['success'])
const dialogFormVisible = ref(false)
const departmentData = ref<string[]>([])

const formData = reactive<FormData>({
  id: 0,
  account: 0,
  name: '',
  sex: '',
  email: '',
  department: '',
})

const rules = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'blur' }],
})

const loadDepartment = async () => {
  const res = await getDepartment()
  departmentData.value = res.data
}

const open = async (id: number) => {
  const res = await getUserInfo(id)
  formData.id = typeof res.data.id === 'number' ? res.data.id : 0
  formData.account =
    typeof res.data.account === 'number' ? res.data.account : Number(res.data.account ?? 0)
  formData.name = res.data.name ?? ''
  formData.sex = res.data.sex ?? ''
  formData.email = res.data.email ?? ''
  formData.department = res.data.department ?? ''
  dialogFormVisible.value = true
}

const editUser = async () => {
  const res = await editAdmin(formData)
  if (res.status == 0) {
    ElMessage.success('用户信息已更新')
    emit('success')
    dialogFormVisible.value = false
  } else {
    ElMessage.error('用户信息更新失败')
    dialogFormVisible.value = false
  }
}

loadDepartment()

defineExpose({
  open,
})
</script>

<style lang="scss" scoped>
.dialog-content {
  display: flex;
  padding: 20px 30px;
}

:deep(.el-form-item) {
  margin: 30px;
}
</style>
