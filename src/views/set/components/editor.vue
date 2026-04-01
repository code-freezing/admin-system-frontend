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
import { buildApiUrl, toAbsoluteResourceUrl } from '@/utils/runtime_url'

// 记录当前状态，方便后续逻辑统一读取和更新。
const title = ref('')
// 记录当前状态，方便后续逻辑统一读取和更新。
const currentKey = ref('')
const editorRef = shallowRef(null)
// 记录当前状态，方便后续逻辑统一读取和更新。
const mode = ref('default')
// 记录当前状态，方便后续逻辑统一读取和更新。
const valueHtml = ref('')
// 记录当前状态，方便后续逻辑统一读取和更新。
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
  ],
}

const editorConfig = {
  placeholder: '请输入内容',
  MENU_CONF: {
    uploadImage: {
      server: buildApiUrl('/set/uploadCompanyPicture'),
      fieldName: 'file',
      methods: 'post',
      metaWithUrl: true,
      customInsert(res, insertFn) {
        if (res.url) {
          insertFn(toAbsoluteResourceUrl(res.url))
        }
      },
    },
  },
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = async (id) => {
  // 页面侧只传一个简单 id，这里统一映射到具体的设置项标题和 set_name。
  const mapping = {
    1: { title: '编辑公司简介', key: '公司简介' },
    2: { title: '编辑公司愿景', key: '公司愿景' },
    3: { title: '编辑企业文化', key: '企业文化' },
    4: { title: '编辑公司概览', key: '公司概览' },
  }

  const config = mapping[id] ?? { title: '编辑内容', key: '' }
  title.value = config.title
  currentKey.value = config.key
  const res = await getCompanyIntroduce(config.key)
  valueHtml.value = res.data
  state.dialogFormVisible = true
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const yes = async () => {
  // 保存时直接用当前 set_name 覆盖对应内容，不在弹窗里再区分具体配置项。
  const res = await changeCompanyIntroduce(valueHtml.value, currentKey.value)
  if (res.status == 0) {
    ElMessage.success('内容更新成功')
    state.dialogFormVisible = false
    valueHtml.value = ''
  } else {
    ElMessage.error('内容更新失败')
  }
}

// 处理当前分支的核心逻辑，避免同类操作散落在多个位置。
const handleCreated = (editor) => {
  editorRef.value = editor
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
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
