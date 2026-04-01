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
import { ref } from 'vue'
import { getCompanyIntroduce } from '@/api/setting'

// 记录弹窗状态显示状态，方便后续逻辑统一读取和更新。
const dialogVisible = ref(false)
// 记录当前状态，方便后续逻辑统一读取和更新。
const title = ref('')
// 记录当前状态，方便后续逻辑统一读取和更新。
const valueHtml = ref('')

const sectionMap = {
  1: '公司简介',
  2: '公司愿景',
  3: '企业文化',
  4: '公司概览',
}

// 加载当前数据，让后续逻辑直接复用准备好的结果。
const loadContent = async (sectionId) => {
  // 首页详情弹窗只按 sectionMap 拉对应内容，不额外维护复杂状态。
  const sectionTitle = sectionMap[sectionId]
  title.value = sectionTitle

  const res = await getCompanyIntroduce(sectionTitle)
  valueHtml.value = res.data
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = async (id) => {
  await loadContent(id)
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
