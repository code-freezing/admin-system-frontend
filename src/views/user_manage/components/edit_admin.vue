<!--
  组件说明：
  1. 编辑管理员信息弹窗。
  2. 负责修改管理员的姓名、性别、邮箱、部门等资料。
  3. 若部门变更，后端还会顺带调整部门消息已读状态。
-->
<template>
  <el-dialog v-model="dialogFormVisible" title="编辑管理员" width="600px" align-center draggable>
    <div class="dialog-content">
      <el-form ref="ruleFormRef" :model="formDataInfo" :rules="rules" label-width="100px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="formDataInfo.account" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formDataInfo.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="formDataInfo.sex" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formDataInfo.email" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="formDataInfo.department" placeholder="请选择部门">
            <el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="edit">确认</el-button>
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
  id: number | null
  account: number | null
  name: string
  sex: string
  email: string
  department: string
}

const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
const departmentData = ref<string[]>([])

const formDataInfo = reactive<FormData>({
  id: null,
  account: null,
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
  departmentData.value = Array.isArray(res) ? (res as string[]) : []
}

const open = async (id: number) => {
  const res = await getUserInfo(id)
  formDataInfo.id = res.id
  formDataInfo.account = res.account
  formDataInfo.name = res.name
  formDataInfo.sex = res.sex
  formDataInfo.email = res.email
  formDataInfo.department = res.department
  dialogFormVisible.value = true
}

const edit = async () => {
  const res = await editAdmin(formDataInfo)
  if (res.status == 0) {
    ElMessage.success('管理员信息已更新')
    emit('success', 'edit')
    dialogFormVisible.value = false
  } else {
    ElMessage.error('管理员信息更新失败')
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
