<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    width="50%"
    align-center
    append-to-body
    :destroy-on-close="true"
  >
    <div class="dialog-content">
      <el-form
        :model="formData"
        label-width="120px"
        style="max-width: 600px"
        :rules="rules"
        :label-position="labelPosition"
      >
        <el-form-item label="消息标题" prop="message_title">
          <el-input v-model="formData.message_title" />
        </el-form-item>
        <el-form-item
          v-if="needsDepartmentFields"
          label="发布部门"
          prop="message_publish_department"
        >
          <el-select v-model="formData.message_publish_department" placeholder="请选择发布部门">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发布人" prop="message_publish_name">
          <el-input v-model="formData.message_publish_name" disabled />
        </el-form-item>
        <el-form-item v-if="needsDepartmentFields" label="接收对象" prop="message_receipt_object">
          <el-select v-model="formData.message_receipt_object" placeholder="请选择接收对象">
            <el-option
              v-for="item in allOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="needsDepartmentFields" label="消息级别" prop="message_level">
          <el-select v-model="formData.message_level" placeholder="请选择消息级别">
            <el-option label="一般" value="一般" />
            <el-option label="重要" value="重要" />
            <el-option label="紧急" value="紧急" />
          </el-select>
        </el-form-item>
        <el-form-item label="消息内容" prop="message_content">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc; width: 600px"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 300px; overflow-y: hidden; width: 600px"
              v-model="valueHtml"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="yes">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElMessage } from 'element-plus'
import { changeUserReadList } from '@/api/dep_msg'
import { editMessage as editMessageApi, publishMessage } from '@/api/message'
import { getDepartment } from '@/api/setting'
import { useMsg } from '@/stores/message'
import { useUserInfo } from '@/stores/userinfor'

const msgStore = useMsg()
const userStore = useUserInfo()
// 记录当前状态，方便后续逻辑统一读取和更新。
const title = ref('')
// 记录当前状态，方便后续逻辑统一读取和更新。
const labelPosition = ref('left')
// 记录弹窗状态表单显示状态，方便后续逻辑统一读取和更新。
const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])

// 记录选项，方便后续逻辑统一读取和更新。
const options = ref([])
// 记录选项，方便后续逻辑统一读取和更新。
const allOptions = ref([])
const editorRef = shallowRef(null)
// 记录当前状态，方便后续逻辑统一读取和更新。
const mode = ref('default')
// 记录当前状态，方便后续逻辑统一读取和更新。
const valueHtml = ref('')

// 记录表单数据，方便后续逻辑统一读取和更新。
const formData = reactive({
  id: null,
  message_title: '',
  message_publish_department: '',
  message_publish_name: userStore.name,
  message_category: '',
  message_receipt_object: '',
  message_level: '',
  message_content: '',
})

// 基于现有状态派生部门，避免同一份结果在多个地方重复计算。
const needsDepartmentFields = computed(() => {
  return title.value === '发布公司消息' || title.value === '编辑公司消息'
})

// 记录校验规则，方便后续逻辑统一读取和更新。
const rules = reactive({
  message_title: [{ required: true, message: '请输入消息标题', trigger: 'blur' }],
  message_publish_department: [{ required: true, message: '请选择发布部门', trigger: 'blur' }],
  message_publish_name: [{ required: true, message: '发布人不能为空', trigger: 'blur' }],
  message_receipt_object: [{ required: true, message: '请选择接收对象', trigger: 'blur' }],
  message_level: [{ required: true, message: '请选择消息级别', trigger: 'blur' }],
  message_content: [{ required: true, message: '请输入消息内容', trigger: 'blur' }],
})

const toolbarConfig = {
  excludeKeys: [
    'blockquote',
    'bgColor',
    'color',
    'group-more-style',
    'fontFamily',
    'bulletedList',
    'numberedList',
    'lineHeight',
    'todo',
    'emotion',
    'insertLink',
    'group-video',
    'insertTable',
    'codeBlock',
    'divider',
    'fullScreen',
  ] as never[],
}

const editorConfig = {
  placeholder: '请输入消息内容',
  MENU_CONF: {},
}

// 加载部门列表，让后续逻辑直接复用准备好的数据。
const loadDepartmentList = async () => {
  // 部门选项来自系统设置，“全体员工”是前端额外补上的特殊接收对象。
  const res = await getDepartment()
  const list = res.data
  options.value = list.map((value) => ({ value }))
  allOptions.value = [...options.value, { value: '全体员工' }]
}

// 重置表单，把当前流程恢复到干净初始状态。
const resetForm = () => {
  // 弹窗复用于四种模式，所以每次进创建态前都要把表单和富文本内容完全清空。
  Object.assign(formData, {
    id: null,
    message_title: '',
    message_publish_department: '',
    message_publish_name: userStore.name,
    message_category: '',
    message_receipt_object: '',
    message_level: '',
    message_content: '',
  })
  valueHtml.value = ''
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openCreate = (id) => {
  resetForm()
  // 父页面只传一个简单编号，弹窗内部再决定当前属于公司消息还是系统消息。
  title.value = id == 1 ? '发布公司消息' : '发布系统消息'
  dialogFormVisible.value = true
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openEdit = (row) => {
  title.value = '编辑公司消息'
  formData.id = row.id
  formData.message_title = row.message_title
  formData.message_publish_department = row.message_publish_department
  formData.message_publish_name = row.message_publish_name
  formData.message_receipt_object = row.message_receipt_object
  formData.message_level = row.message_level
  formData.message_content = row.message_content
  valueHtml.value = row.message_content
  dialogFormVisible.value = true
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openEditSystem = (row) => {
  title.value = '编辑系统消息'
  formData.id = row.id
  formData.message_title = row.message_title
  formData.message_publish_name = row.message_publish_name
  formData.message_content = row.message_content
  valueHtml.value = row.message_content
  dialogFormVisible.value = true
}

// 处理当前分支的核心逻辑，避免同类操作散落在多个位置。
const handleCreated = (editor) => {
  // 编辑器实例需要在组件卸载时手动销毁，这里先缓存引用。
  editorRef.value = editor
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const yes = async () => {
  // 保存逻辑按标题分支，是因为公司消息和系统消息在字段要求和联动上不完全一样。
  formData.message_content = valueHtml.value

  if (title.value === '发布公司消息') {
    formData.message_category = '公司消息'
    const res = await publishMessage(formData)
    if (res.status == 0) {
      // 公司消息发布后要同步部门未读列表，并刷新当前用户顶部消息状态。
      await changeUserReadList(res.data.id, formData.message_receipt_object)
      await msgStore.returnReadList()
      ElMessage.success('公司消息发布成功')
      emit('success')
    } else {
      ElMessage.error('公司消息发布失败')
    }
    dialogFormVisible.value = false
    return
  }

  if (title.value === '编辑公司消息') {
    const res = await editMessageApi(formData)
    // 编辑公司消息后也要刷新部门消息状态，因为接收范围或内容可能已经变化。
    await msgStore.returnReadList()
    if (res.status == 0) {
      ElMessage.success('公司消息编辑成功')
      emit('success')
    } else {
      ElMessage.error('公司消息编辑失败')
    }
    dialogFormVisible.value = false
    return
  }

  if (title.value === '发布系统消息') {
    formData.message_category = '系统消息'
    const res = await publishMessage(formData)
    if (res.status == 0) {
      ElMessage.success('系统消息发布成功')
      emit('success')
    } else {
      ElMessage.error('系统消息发布失败')
    }
    dialogFormVisible.value = false
    return
  }

  if (title.value === '编辑系统消息') {
    const res = await editMessageApi(formData)
    if (res.status == 0) {
      ElMessage.success('系统消息编辑成功')
      emit('success')
    } else {
      ElMessage.error('系统消息编辑失败')
    }
    dialogFormVisible.value = false
  }
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) {
    editor.destroy()
  }
})

loadDepartmentList()

defineExpose({
  openCreate,
  openEdit,
  openEditSystem,
})
</script>

<style lang="scss" scoped>
.dialog-content {
  display: flex;
  padding: 20px 30px;
  flex: 1;
  max-height: 800px;
  overflow: auto;
}

.el-dialog__body {
  padding: 0;
}

.el-input {
  width: 240px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-form-item {
  margin: 16px;
}

:deep(.w-e-text-container p) {
  margin: 0;
}
</style>
