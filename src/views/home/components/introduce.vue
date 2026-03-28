<!--
  组件说明：
  1. 公司介绍详情弹窗。
  2. 用于在首页点击公司简介卡片后展示完整富文本内容。
  3. 它与设置页中的公司内容编辑功能形成前后呼应。
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="800px"
    destroy-on-close
    center
  >
    <el-container>
      <el-main>
        <div class="content" v-html="valueHtml"></div>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { getCompanyIntroduce } from '@/api/setting'

const dialogVisible = ref(false)
const title = ref('')
const valueHtml = ref('')

const sectionMap = {
  1: '公司简介',
  2: '公司愿景',
  3: '企业文化',
  4: '公司概览',
} as const

type SectionId = keyof typeof sectionMap

const state = reactive({
  loading: false,
})

const loadContent = async (sectionId: SectionId) => {
  state.loading = true
  try {
    const sectionTitle = sectionMap[sectionId]
    title.value = sectionTitle

    const res = await getCompanyIntroduce(sectionTitle)
    valueHtml.value = res.data
  } finally {
    state.loading = false
  }
}

const open = async (id: number) => {
  if (!(id in sectionMap)) {
    return
  }

  await loadContent(id as SectionId)
  dialogVisible.value = true
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped>
.content {
  text-align: center;
}

:deep(.el-main) {
  min-height: 500px;
}
</style>
