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
import { ElMessage, type FormProps } from 'element-plus'
import { changeUserReadList } from '@/api/dep_msg'
import { editMessage as editMessageApi, publishMessage } from '@/api/message'
import { getDepartment } from '@/api/setting'
import { useMsg } from '@/stores/message'

// 公司消息和系统消息共用同一个富文本弹窗，通过 title 判断当前处于哪种模式。
interface SelectOption {
  value: string
}

interface FormData {
  id: number | null
  message_title: string
  message_publish_department: string
  message_publish_name: string | null
  message_category: string
  message_receipt_object: string
  message_level: string
  message_content: string
}

const msgStore = useMsg()
const title = ref('')
const labelPosition = ref<FormProps['labelPosition']>('left')
const dialogFormVisible = ref(false)
const emit = defineEmits(['success'])

const options = ref<SelectOption[]>([])
const allOptions = ref<SelectOption[]>([])
const editorRef = shallowRef()
const mode = ref('default')
const valueHtml = ref('')

// 表单字段刻意保持完整，避免在创建/编辑/不同消息类型之间频繁切换结构。
const formData = reactive<FormData>({
  id: null,
  message_title: '',
  message_publish_department: '',
  message_publish_name: localStorage.getItem('name'),
  message_category: '',
  message_receipt_object: '',
  message_level: '',
  message_content: '',
})

const needsDepartmentFields = computed(() => {
  return title.value === '发布公司消息' || title.value === '编辑公司消息'
})

// 富文本工具栏刻意裁掉复杂功能，让后台公告编辑保持轻量。
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

// 部门选项来自系统设置，“全体员工”是在前端额外补上的特殊接收对象。
const loadDepartmentList = async () => {
  const res = await getDepartment()
  const list = Array.isArray(res) ? (res as string[]) : []
  options.value = list.map((value) => ({ value }))
  allOptions.value = [...options.value, { value: '全体员工' }]
}

const resetForm = () => {
  Object.assign(formData, {
    id: null,
    message_title: '',
    message_publish_department: '',
    message_publish_name: localStorage.getItem('name'),
    message_category: '',
    message_receipt_object: '',
    message_level: '',
    message_content: '',
  })
  valueHtml.value = ''
}

const openCreate = (id: number) => {
  resetForm()
  title.value = id == 1 ? '发布公司消息' : '发布系统消息'
  dialogFormVisible.value = true
}

const openEdit = (row: any) => {
  title.value = '编辑公司消息'
  formData.id = row.id
  formData.message_title = row.message_title
  formData.message_publish_department = row.message_publish_department
  formData.message_publish_name = row.message_publish_name
  formData.message_receipt_object = row.message_receipt_object
  formData.message_level = row.message_level
  formData.message_content = row.message_content
  valueHtml.value = row.message_content ?? ''
  dialogFormVisible.value = true
}

const openEditSystem = (row: any) => {
  title.value = '编辑系统消息'
  formData.id = row.id
  formData.message_title = row.message_title
  formData.message_publish_name = row.message_publish_name
  formData.message_content = row.message_content
  valueHtml.value = row.message_content ?? ''
  dialogFormVisible.value = true
}

const handleCreated = (editor: any) => {
  editorRef.value = editor
}

// 保存逻辑按标题分支，是因为公司消息和系统消息在字段要求、后续联动上不完全一样。
const yes = async () => {
  formData.message_content = valueHtml.value

  if (title.value === '发布公司消息') {
    formData.message_category = '公司消息'
    const res = await publishMessage(formData)
    if (res.status == 0) {
      await changeUserReadList(res.id, formData.message_receipt_object)
      await msgStore.returnReadList(Number(localStorage.getItem('id')))
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
    await msgStore.returnReadList(Number(localStorage.getItem('id')))
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
