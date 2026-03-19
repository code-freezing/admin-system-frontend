<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="编辑管理员信息"
    width="600px"
    align-center
    draggable
  >
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
        <el-button type="primary" @click="edit"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { getUserInfo, editAdmin } from '@/api/userinfor'
import { getDepartment } from '@/api/setting'
import { ElMessage } from 'element-plus'

const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])

interface FormData {
  id: number | null
  account: number | null
  name: string
  sex: string
  email: string
  department: string
}

const formDataInfo: FormData = reactive({
  id: null,
  account: null,
  name: '',
  sex: '',
  email: '',
  department: '',
})

const departmentData = ref([])
const getDepartmentData = async () => {
  departmentData.value = (await getDepartment()) as any
}
getDepartmentData()

const rules = reactive({
  account: [{ required: true, message: '请输入管理员的注册账号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入管理员的名字', trigger: 'blur' }],
  sex: [{ required: true, message: '请输入管理员的性别', trigger: 'blur' }],
  email: [{ required: true, message: '请输入管理员的邮箱', trigger: 'blur' }],
  department: [{ required: true, message: '请输入管理员的部门', trigger: 'blur' }],
})

const open = async (id: number) => {
  const res = (await getUserInfo(id)) as any
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
  console.log(res)
  if (res.status == 0) {
    ElMessage({
      message: '编辑管理员信息成功',
      type: 'success',
    })
    emit('success', 'edit')
    dialogFormVisible.value = false
  } else {
    ElMessage.error('编辑管理员信息失败')
    dialogFormVisible.value = false
  }
}

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
