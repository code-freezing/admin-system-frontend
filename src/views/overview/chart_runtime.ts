/**
 * 模块说明：
 * 1. 概览页图表运行时。
 * 2. 只注册当前页面真正使用的图表和组件，避免整包引入 echarts。
 * 3. 通过动态 import 懒加载，让首屏先把壳子渲染出来。
 */

import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { init, use, type EChartsType } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PieChart,
  BarChart,
  LineChart,
  CanvasRenderer,
])

export const createOverviewChart = (element: HTMLElement): EChartsType => {
  return init(element)
}
