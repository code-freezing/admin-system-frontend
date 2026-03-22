<template>
  <el-dialog v-model="state.dialogFormVisible" :title="title" width="600px" destroy-on-close>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="yes">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'
import { changeCompanyIntroduce, getCompanyIntroduce } from '@/api/setting'

// 公司介绍类配置共用一个富文本弹窗，靠传入 id 决定编辑哪一块内容。
const title = ref('')
const currentKey = ref('')
const editorRef = shallowRef()
const mode = ref('default')
const valueHtml = ref('')
const state = reactive({
  dialogFormVisible: false,
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
  placeholder: '请输入内容',
  MENU_CONF: {
    uploadImage: {
      server: `${import.meta.env.VITE_API_BASEURL}/set/uploadCompanyPicture`,
      fieldName: 'file',
      methods: 'post',
      metaWithUrl: true,
      customInsert(res: any, insertFn: any) {
        insertFn(res.url)
      },
    },
  },
}

// id 和 setting.set_name 的映射集中放在这里，便于后续新增公司介绍模块。
const open = async (id: number) => {
  const mapping: Record<number, { title: string; key: string }> = {
    1: { title: '编辑公司简介', key: '公司简介' },
    2: { title: '编辑公司愿景', key: '公司愿景' },
    3: { title: '编辑企业文化', key: '企业文化' },
    4: { title: '编辑公司概览', key: '公司概览' },
  }

  const config = mapping[id] ?? { title: '编辑内容', key: '' }
  title.value = config.title
  currentKey.value = config.key
  const res = (await getCompanyIntroduce(config.key)) as any
  valueHtml.value = res?.results ?? res ?? ''
  state.dialogFormVisible = true
}

const yes = async () => {
  const res = await changeCompanyIntroduce(valueHtml.value, currentKey.value)
  if (res.status == 0) {
    ElMessage.success('内容更新成功')
    state.dialogFormVisible = false
    valueHtml.value = ''
  } else {
    ElMessage.error('内容更新失败')
  }
}

const handleCreated = (editor: any) => {
  editorRef.value = editor
}

const cancel = () => {
  state.dialogFormVisible = false
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) {
    editor.destroy()
  }
})

defineExpose({
  open,
})
</script>

<style lang="scss" scoped></style>
