<!--
  组件说明：
  1. SVG 图标包装组件。
  2. 统一处理 svg symbol 的引用方式，简化模板里的图标写法。
  3. 适合和 svg sprite 注册能力配合使用。
-->
<template>
  <svg class="svg-icon" aria-hidden="true" :style="{ width: size + 'px', height: size + 'px' }">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 这里把图标名转成 sprite 里的引用地址，组件本身不关心具体图标内容。
const props = withDefaults(
  defineProps<{
    iconName: string
    color?: string
    size?: number | string
  }>(),
  {
    color: '',
    size: 16,
  },
)

const symbolId = computed(() => `#icon-${props.iconName}`)
</script>

<style scoped>
.svg-icon {
  fill: currentColor;
  vertical-align: middle;
}
</style>
