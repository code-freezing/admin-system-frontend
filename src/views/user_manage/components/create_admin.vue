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
        <el-button type="primary" @click="addAdmin">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createAdmin } from '@/api/userinfor'
import { getDepartment } from '@/api/setting'

// 记录当前状态，方便后续逻辑统一读取和更新。
const title = ref('')
// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
// 记录部门数据，方便后续逻辑统一读取和更新。
const departmentData = ref([])

// 记录表单数据，方便后续逻辑统一读取和更新。
const formData = reactive({
  account: '',
  password: '',
  name: '',
  sex: '',
  email: '',
  department: '',
  identity: '',
})

const identityMap = {
  1: { title: '新增用户管理员', identity: '用户管理员' },
  2: { title: '新增产品管理员', identity: '产品管理员' },
  3: { title: '新增消息管理员', identity: '消息管理员' },
}

// 记录校验规则，方便后续逻辑统一读取和更新。
const rules = reactive({
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'blur' }],
})

// 加载部门，让后续逻辑直接复用准备好的数据。
const loadDepartment = async () => {
  // 部门选项来自系统设置里的字典配置，创建管理员时直接复用。
  const res = await getDepartment()
  departmentData.value = res.data
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = (id) => {
  // 每次打开前先清空旧表单，避免上一位管理员的资料残留到下一次创建。
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

// 把新结果并入当前状态，避免调用方手动维护同一份数据。
const addAdmin = async () => {
  // 创建成功后只通知父列表刷新，弹窗本身不接管外层列表状态。
  const res = await createAdmin(formData)
  if (res.status == 0) {
    ElMessage.success('管理员创建成功')
    emit('success', 'create')
    dialogFormVisible.value = false
  } else {
    ElMessage.error('管理员创建失败')
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
