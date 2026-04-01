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
      <div class="manage-user pie">
        <OverviewChart :option="adminPieOption" :loading="chartsLoading" loading-text="统计图表加载中..." />
      </div>
    </div>

    <div class="mid-content-wrapped">
      <div class="product-category-bar mid-content-left">
        <OverviewChart
          :option="categoryBarOption"
          :loading="chartsLoading"
          loading-text="正在准备产品统计..."
        />
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
      <div class="massage-level footer-content-left">
        <OverviewChart :option="levelPieOption" :loading="chartsLoading" loading-text="正在准备公告统计..." />
      </div>
      <div class="login-week footer-content-right">
        <OverviewChart :option="dayLineOption" :loading="chartsLoading" loading-text="正在准备登录趋势..." />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import breadCrumb from '@/components/bread_crumb.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import OverviewChart from './components/OverviewChart.vue'
import { useUserInfo } from '@/stores/userinfor'
import {
  getAdminAndNumber,
  getCategoryAndNumber,
  getDayAndNumber,
  getLevelAndNumber,
} from '@/api/overview'
import { getUserInfo } from '@/api/userinfor'

const router = useRouter()
const userStore = useUserInfo()
// 记录单项数据，方便后续逻辑统一读取和更新。
const breadcrumbItem = ref({
  first: '系统概览',
})
// 记录用户资料，方便后续逻辑统一读取和更新。
const userProfile = reactive({
  name: '',
  sex: '',
  identity: '',
  department: '',
})
// 记录加载状态，方便后续逻辑统一读取和更新。
const chartsLoading = ref(true)
// 概览页只保留图表原始数据，真正的实例生命周期交给子组件各自处理。
const chartData = reactive({
  admin: [],
  category: [],
  price: [],
  level: [],
  week: [],
  number: [],
})

// 处理路由，把当前模块的关键逻辑集中在这里。
const routerTo = (path) => {
  router.push(`/${path}`)
}

// 加载用户资料，让后续逻辑直接复用准备好的数据。
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

// 图表数据和图表实例拆开后，概览页只负责把接口数据整理成 option 所需结构。
const loadChartData = async () => {
  chartsLoading.value = true

  try {
    const [adminData, categoryData, levelData, dayData] = await Promise.all([
      getAdminAndNumber(),
      getCategoryAndNumber(),
      getLevelAndNumber(),
      getDayAndNumber(),
    ])

    chartData.admin = adminData.data.data
    chartData.category = categoryData.data.category
    chartData.price = categoryData.data.price
    chartData.level = levelData.data.data
    chartData.week = dayData.data.week
    chartData.number = dayData.data.number
  } finally {
    chartsLoading.value = false
  }
}

// 把图表配置做成计算属性后，子组件只需要接收 option 并负责渲染。
const adminPieOption = computed(() => ({
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
      data: chartData.admin,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}))

// 产品分类柱状图只依赖分类和金额数组，数据准备好后就能直接渲染。
const categoryBarOption = computed(() => ({
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
    data: chartData.category,
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: chartData.price,
      type: 'bar',
      barWidth: 40,
      colorBy: 'data',
    },
  ],
}))

// 公告等级图保持原来的环形配置，只是把实例初始化移到子组件内部。
const levelPieOption = computed(() => ({
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
      data: chartData.level,
    },
  ],
}))

// 登录趋势图和其他图表一样改成声明式配置，避免父页面手工干预图表实例。
const dayLineOption = computed(() => ({
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
    data: chartData.week,
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: chartData.number,
      type: 'line',
    },
  ],
}))

// 页面首次进入后从这里拉起首屏数据或初始化流程。
onMounted(async () => {
  await Promise.all([loadUserProfile(), loadChartData()])
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
}
</style>
