<template>
  <el-dialog v-model="dialogFormVisible" :title="title" width="600px" align-center draggable>
    <div class="dialog-content">
      <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="formData.account" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" show-password />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="formData.sex" placeholder="请选择性别">
            <el-option label="男 value=" 男 />
            <el-option label="女 value=" 女 />
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
        <el-button type="primary" @click="addAdmin"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { createAdmin } from '@/api/userinfor.js'
import { getDepartment } from '@/api/setting'
import { ElMessage } from 'element-plus'

const title = ref('')
const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])

const identityMap: Record<number, { title: string; identity: string }> = {
  1: { title: '新建产品管理员', identity: '产品管理员' },
  2: { title: '新建用户管理员', identity: '用户管理员' },
  3: { title: '新建消息管理员', identity: '消息管理员' },
}

interface FormData {
  account: string
  password: string
  name: string
  sex: string
  email: string
  department: string
  identity: string
}

const formData: FormData = reactive({
  account: '',
  password: '',
  name: '',
  sex: '',
  email: '',
  department: '',
  identity: '',
})

const departmentData = ref<string[]>([])
const returnDepartment = async () => {
  const res = (await getDepartment()) as any
  departmentData.value = Array.isArray(res) ? res : (res?.results ?? [])
}
returnDepartment()

const rules = reactive({
  account: [{ required: true, message: '请输入管理员的注册账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入管理员的注册密码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入管理员的名字', trigger: 'blur' }],
  sex: [{ required: true, message: '请输入管理员的性别', trigger: 'blur' }],
  email: [{ required: true, message: '请输入管理员的邮箱', trigger: 'blur' }],
  department: [{ required: true, message: '请输入管理员的部门', trigger: 'blur' }],
})

const open = (id: number) => {
  Object.assign(formData, {
    account: '',
    password: '',
    name: '',
    sex: '',
    email: '',
    department: '',
    identity: '',
  })
  const config = identityMap[id]
  if (config) {
    title.value = config.title
    formData.identity = config.identity
  }
  dialogFormVisible.value = true
}

const addAdmin = async () => {
  const res = await createAdmin(formData)
  if (res.status == 0) {
    ElMessage({
      message: '创建管理员成功',
      type: 'success',
    })
    emit('success', 'create')
    dialogFormVisible.value = false
  } else {
    ElMessage.error('创建管理员失败')
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
