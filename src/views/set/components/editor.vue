<template>
  <el-dialog v-model="state.dialogFormVisible" :title="title" width="600px" destroy-on-close>
    <div style="border: 1px solid #ccc">
      <!-- wangEditor结构 -->
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
        <el-button type="primary" @click="yes"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, reactive } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElMessage } from 'element-plus'

import { changeCompanyIntroduce, getCompanyIntroduce } from '@/api/setting'
const title = ref('')
const editorRef = shallowRef()
const mode = ref('default')
const valueHtml = ref('')
const state = reactive({
  dialogFormVisible: false,
})

const toolbarConfig = {
  excludeKeys: [],
}
const editorConfig = {
  placeholder: '请输入内容...',
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
toolbarConfig.excludeKeys = [
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
] as never[]

const open = async (id: number) => {
  if (id == 1) {
    title.value = '编辑公司介绍'
    const res = (await getCompanyIntroduce('公司介绍')) as any
    valueHtml.value = res?.results ?? res
  }
  if (id == 2) {
    title.value = '编辑公司架构'
    const res = (await getCompanyIntroduce('公司架构')) as any
    valueHtml.value = res?.results ?? res
  }
  if (id == 3) {
    title.value = '编辑公司战略'
    const res = (await getCompanyIntroduce('公司战略')) as any
    valueHtml.value = res?.results ?? res
  }
  if (id == 4) {
    title.value = '编辑公司高层'
    const res = (await getCompanyIntroduce('公司高层')) as any
    valueHtml.value = res?.results ?? res
  }
  state.dialogFormVisible = true
}

const yes = async () => {
  console.log(title.value.slice(-4))
  const res = await changeCompanyIntroduce(valueHtml.value, title.value.slice(-4))
  console.log(res)
  if (res.status == 0) {
    ElMessage({
      message: '修改公司介绍成功',
      type: 'success',
    })
    state.dialogFormVisible = false
    valueHtml.value = ''
  } else {
    state.dialogFormVisible = false
    valueHtml.value = ''
    ElMessage.error('修改公司介绍失败，请检查网络是否通畅')
  }
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor
}

const cancel = () => {
  ElMessage.error('取消编辑')
  state.dialogFormVisible = false
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped></style>


