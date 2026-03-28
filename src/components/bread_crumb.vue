<!--
  组件说明：
  1. 面包屑组件。
  2. 根据页面传入的数据渲染当前位置，帮助用户理解当前导航层级。
  3. 组件本身只负责展示，不参与业务逻辑判断。
-->
<template>
  <div class="bread-crumb">
    <SvgIcon icon-name="location" class="bread-crumb-icon" />
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>{{ item.first }}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="item.second">{{ item.second }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcon.vue'

interface BreadCrumbItem {
  first: string
  second?: string
}

// 面包屑只负责展示传入的两级标题，不承载任何业务状态。
defineOptions({
  name: 'BreadCrumb',
})

const { item } = defineProps<{
  item: BreadCrumbItem
}>()
</script>

<style lang="scss" scoped>
.bread-crumb {
  height: 30px;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.bread-crumb-icon {
  margin-right: 4px;
}

:deep(.el-breadcrumb__item) {
  height: 30px;
  font-size: 14px;
  line-height: 30px;
}

:deep(.el-breadcrumb__inner) {
  font-weight: 500;
}
</style>
