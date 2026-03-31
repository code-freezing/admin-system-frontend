<!--
  组件说明：
  1. 系统概览页面。
  2. 通过统计卡片、图表和排行板块展示系统运行情况。
  3. 这是超级管理员快速理解全局状态的可视化入口。
-->
<template>
  <breadCrumb :item="breadcrumbItem" />
  <div class="overview-wrapped">
    <div class="top-content-wrapped">
      <div class="person-info">
        <div class="person-avatar-wrapped">
          <el-avatar :size="100" :src="userStore.imageUrl" />
          <span class="department">所属部门：{{ userProfile.department }}</span>
          <div class="company">所属公司：济南晏鲸创意设计有限公司</div>
        </div>
        <div class="line-wrapped">
          <div class="line"></div>
        </div>
        <div class="detail-info-wrapped">
          <p>姓名：{{ userProfile.name }}</p>
          <p>性别：{{ userProfile.sex }}</p>
          <p>身份：{{ userProfile.identity }}</p>
          <p>分管领域：超级管理</p>
          <p>权限：最高权限</p>
        </div>
      </div>
      <div ref="pieRef" class="manage-user pie">
        <div v-if="chartsLoading" class="chart-placeholder">统计图表加载中...</div>
      </div>
    </div>

    <div ref="chartAreaRef" class="mid-content-wrapped">
      <div ref="categoryBarRef" class="product-category-bar mid-content-left">
        <div v-if="chartsLoading" class="chart-placeholder">正在准备产品统计...</div>
      </div>
      <div class="mid-content-right">
        <div class="title">常用管理</div>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="button-area" @click="routerTo('users_manage')">
              <SvgIcon icon-name="user" style="width: 24px; height: 24px" />
              <span class="button-name">用户管理</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('product_manage_list')">
              <SvgIcon icon-name="product" style="width: 24px; height: 24px" />
              <span class="button-name">产品管理</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('message_list')">
              <SvgIcon icon-name="notice" style="width: 24px; height: 24px" />
              <span class="button-name">系统消息</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('set')">
              <SvgIcon icon-name="me" style="width: 24px; height: 24px" />
              <span class="button-name">个人信息</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area">
              <SvgIcon icon-name="message" style="width: 24px; height: 24px" />
              <span class="button-name">部门信息</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('set')">
              <SvgIcon icon-name="set" style="width: 24px; height: 24px" />
              <span class="button-name">系统设置</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="footer-content-wrapped">
      <div ref="levelPieRef" class="massage-level footer-content-left">
        <div v-if="chartsLoading" class="chart-placeholder">正在准备公告统计...</div>
      </div>
      <div ref="dayLineRef" class="login-week footer-content-right">
        <div v-if="chartsLoading" class="chart-placeholder">正在准备登录趋势...</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import breadCrumb from '@/components/bread_crumb.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { useUserInfo } from '@/stores/userinfor'
import {
  getAdminAndNumber,
  getCategoryAndNumber,
  getDayAndNumber,
  getLevelAndNumber,
} from '@/api/overview'
import { getUserInfo } from '@/api/userinfor'
import type { EChartsType } from 'echarts/core'

interface UserProfile {
  name: string
  sex: string
  identity: string
  department: string
}

const router = useRouter()
const userStore = useUserInfo()
const breadcrumbItem = ref({
  first: '系统概览',
})
const chartAreaRef = ref<HTMLElement | null>(null)
const pieRef = ref<HTMLElement | null>(null)
const categoryBarRef = ref<HTMLElement | null>(null)
const levelPieRef = ref<HTMLElement | null>(null)
const dayLineRef = ref<HTMLElement | null>(null)
const userProfile = reactive<UserProfile>({
  name: '',
  sex: '',
  identity: '',
  department: '',
})
const chartsLoading = ref(true)

const charts: EChartsType[] = []
let chartObserver: IntersectionObserver | null = null
let resizeHandler: (() => void) | null = null
let hasStartedChartLoad = false

const routerTo = (path: string) => {
  router.push(`/${path}`)
}

const loadUserProfile = async () => {
  // 概览页头像直接复用 store，文字资料则按当前用户 id 再补一份最新详情。
  const currentUserId = userStore.id
  if (!currentUserId) {
    return
  }

  const { data } = await getUserInfo(currentUserId)
  userProfile.name = data.name
  userProfile.sex = data.sex
  userProfile.identity = data.identity
  userProfile.department = data.department
}

const mountChart = (chart: EChartsType, option: Record<string, unknown>) => {
  chart.setOption(option)
  charts.push(chart)
}

const bindResize = () => {
  // 图表实例只绑定一次 resize，避免重复进入页面后叠加多个监听器。
  if (resizeHandler) {
    return
  }

  resizeHandler = () => {
    charts.forEach((chart) => chart.resize())
  }
  window.addEventListener('resize', resizeHandler)
}

const renderCharts = async () => {
  // 图表数据和运行时代码都延后到真正需要时再加载，减少首屏图表开销。
  if (hasStartedChartLoad) {
    return
  }

  hasStartedChartLoad = true
  chartsLoading.value = true

  try {
    const [{ createOverviewChart }, adminData, categoryData, levelData, dayData] = await Promise.all([
      import('./chart_runtime'),
      getAdminAndNumber(),
      getCategoryAndNumber(),
      getLevelAndNumber(),
      getDayAndNumber(),
    ])

    await nextTick()

    if (!pieRef.value || !categoryBarRef.value || !levelPieRef.value || !dayLineRef.value) {
      return
    }

    mountChart(createOverviewChart(pieRef.value), {
      title: {
        text: '管理与用户对比图',
        left: 'center',
      },
      tooltip: { trigger: 'item' },
      legend: {
        orient: 'vertical',
        left: 'left',
        padding: [20, 20, 20, 20],
      },
      series: [
        {
          type: 'pie',
          radius: '65%',
          data: adminData.data.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    })

    mountChart(createOverviewChart(categoryBarRef.value), {
      title: {
        text: '产品类别库存总价图',
        top: '3%',
        textStyle: {
          fontSize: 16,
        },
      },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: categoryData.data.category,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: categoryData.data.price,
          type: 'bar',
          barWidth: 40,
          colorBy: 'data',
        },
      ],
    })

    mountChart(createOverviewChart(levelPieRef.value), {
      title: {
        text: '公告等级分布图',
        top: '3%',
        textStyle: {
          fontSize: 16,
        },
      },
      tooltip: { trigger: 'item' },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          type: 'pie',
          radius: ['35%', '65%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: levelData.data.data,
        },
      ],
    })

    mountChart(createOverviewChart(dayLineRef.value), {
      title: {
        text: '每日登录人数图',
        top: '3%',
        textStyle: {
          fontSize: 16,
        },
      },
      tooltip: { trigger: 'item' },
      xAxis: {
        type: 'category',
        data: dayData.data.week,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: dayData.data.number,
          type: 'line',
        },
      ],
    })
    bindResize()
  } finally {
    chartsLoading.value = false
  }
}

const observeChartSection = () => {
  // 图表区域进入可视区后再渲染，避免用户还没滚到中部就提前初始化所有图表。
  if (!chartAreaRef.value || typeof window === 'undefined') {
    void renderCharts()
    return
  }

  if (!('IntersectionObserver' in window)) {
    void renderCharts()
    return
  }

  chartObserver = new window.IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        chartObserver?.disconnect()
        chartObserver = null
        void renderCharts()
      }
    },
    {
      rootMargin: '120px',
    },
  )

  chartObserver.observe(chartAreaRef.value)
}

onMounted(async () => {
  await loadUserProfile()
  observeChartSection()
})

onBeforeUnmount(() => {
  chartObserver?.disconnect()
  charts.forEach((chart) => chart.dispose())
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})

void userStore
</script>

<style lang="scss" scoped>
.overview-wrapped {
  padding: 8px;
  height: calc(100vh - 101px);
  background: #f8f8f8;

  .top-content-wrapped {
    height: 30%;
    display: flex;

    .person-info {
      height: 100%;
      margin-right: 8px;
      width: calc(50% - 8px);
      display: flex;
      background: #fff;

      .person-avatar-wrapped {
        display: flex;
        width: 50%;
        height: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .company {
          margin: 10px 0;
          font-size: 12px;
        }

        .department {
          margin-top: 8px;
          font-size: 12px;
        }
      }

      .line-wrapped {
        height: 100%;
        display: flex;
        align-items: center;

        .line {
          height: 170px;
          border: 1px solid #d3d3d3;
        }
      }

      .detail-info-wrapped {
        height: 100%;
        width: calc(50% - 1px);
        margin-left: 50px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
      }
    }

    .pie {
      width: calc(50%);
      height: 100%;
      background: #fff;
    }
  }

  .mid-content-wrapped {
    margin-top: 8px;
    height: calc(32% - 8px);
    display: flex;

    .mid-content-left {
      margin-right: 8px;
      width: calc(60% - 8px);
      background: #fff;
    }

    .mid-content-right {
      width: calc(40%);
      background: #fff;
      padding: 8px;

      .title {
        font-size: 14px;
        margin-bottom: 8px;
      }

      .button-area {
        margin-bottom: 8px;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background: #f5f5f5;

        .button-name {
          margin-top: 10px;
        }
      }

      .button-area:hover {
        background: #e4efff;
      }
    }
  }

  .footer-content-wrapped {
    margin-top: 8px;
    height: calc(38% - 8px);
    display: flex;

    .footer-content-left {
      margin-right: 8px;
      height: 100%;
      width: calc(30% - 8px);
      background: #fff;
    }

    .footer-content-right {
      height: 100%;
      width: calc(70%);
      background: #fff;
    }
  }

  .pie,
  .mid-content-left,
  .footer-content-left,
  .footer-content-right {
    position: relative;
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
}
</style>
