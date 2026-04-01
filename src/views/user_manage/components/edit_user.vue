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

const emit = defineEmits(['success'])
// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)
// 记录部门数据，方便后续逻辑统一读取和更新。
const departmentData = ref([])

// 记录表单数据，方便后续逻辑统一读取和更新。
const formData = reactive({
  id: 0,
  account: 0,
  name: '',
  sex: '',
  email: '',
  department: '',
})

// 记录校验规则，方便后续逻辑统一读取和更新。
const rules = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'blur' }],
})

// 加载部门，让后续逻辑直接复用准备好的数据。
const loadDepartment = async () => {
  // 普通用户编辑也直接复用系统设置里的部门字典。
  const res = await getDepartment()
  departmentData.value = res.data
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = async (id) => {
  // 进入编辑态前先拉最新资料，避免弹窗展示旧列表里的过期字段。
  const res = await getUserInfo(id)
  formData.id = res.data.id
  formData.account = Number(res.data.account)
  formData.name = res.data.name
  formData.sex = res.data.sex
  formData.email = res.data.email
  formData.department = res.data.department
  dialogFormVisible.value = true
}

// 更新用户，让当前记录按最新输入重新保存。
const editUser = async () => {
  // 普通用户和管理员编辑共用后端编辑接口，这里只负责提交当前表单数据。
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
