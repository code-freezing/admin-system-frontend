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

// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])
// 记录部门数据，方便后续逻辑统一读取和更新。
const departmentData = ref([])

// 记录表单数据信息，方便后续逻辑统一读取和更新。
const formDataInfo = reactive({
  id: null,
  account: null,
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
  // 部门字典来自系统设置，管理员编辑和用户编辑共用同一份选项。
  const res = await getDepartment()
  departmentData.value = res.data
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = async (id) => {
  // 打开编辑弹窗时先拉一份最新用户资料，避免列表展示字段和真实资料发生偏差。
  const res = await getUserInfo(id)
  formDataInfo.id = res.data.id
  formDataInfo.account = Number(res.data.account)
  formDataInfo.name = res.data.name
  formDataInfo.sex = res.data.sex
  formDataInfo.email = res.data.email
  formDataInfo.department = res.data.department
  dialogFormVisible.value = true
}

// 更新当前记录，确保最新输入能覆盖旧数据。
const edit = async () => {
  // 编辑成功后只通知父列表刷新，具体分页回填逻辑交给外层页面处理。
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
