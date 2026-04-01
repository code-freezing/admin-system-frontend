<template>
  <div class="overview-chart">
    <div ref="chartRef" class="chart-canvas"></div>
    <div v-if="loading" class="chart-placeholder">{{ loadingText }}</div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  option: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: '图表加载中...',
  },
})

const chartRef = ref(null)
let chart = null
let resizeHandler = null
let isUnmounted = false

// 图表实例只在子组件内部维护，避免父页面切换时还要同时管理多个真实 DOM 和实例状态。
const initChart = async () => {
  if (chart || !chartRef.value) {
    return
  }

  const { createOverviewChart } = await import('../chart_runtime')

  if (isUnmounted || !chartRef.value) {
    return
  }

  chart = createOverviewChart(chartRef.value)
  resizeHandler = () => chart?.resize()
  window.addEventListener('resize', resizeHandler)
}

// 每次 option 到位后都在组件内部完成渲染，避免父页面直接持有图表实例。
const renderChart = async (option) => {
  if (!option) {
    return
  }

  await nextTick()
  await initChart()

  if (!chart) {
    return
  }

  chart.setOption(option, true)
}

watch(
  () => props.option,
  (option) => {
    void renderChart(option)
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  if (props.option) {
    void renderChart(props.option)
  }
})

onBeforeUnmount(() => {
  isUnmounted = true

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }

  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>

<style lang="scss" scoped>
.overview-chart {
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

.chart-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
  background: linear-gradient(90deg, #f8fafc, #eef3fb, #f8fafc);
}
</style>
