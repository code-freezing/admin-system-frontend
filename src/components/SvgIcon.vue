<template>
  <svg class="svg-icon" aria-hidden="true" :style="{ width: size + 'px', height: size + 'px' }">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 这里把图标名转成 sprite 里的引用地址，组件本身不关心具体图标内容。
const props = defineProps({
  iconName: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  size: {
    type: [Number, String],
    default: 16,
  },
})

// 基于现有状态派生当前结果，避免同一份数据在多个地方重复计算。
const symbolId = computed(() => `#icon-${props.iconName}`)
</script>

<style scoped>
.svg-icon {
  fill: currentColor;
  vertical-align: middle;
}
</style>
