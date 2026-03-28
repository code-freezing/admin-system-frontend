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
      <div class="manage-user pie"></div>
    </div>

    <div class="mid-content-wrapped">
      <div class="product-category-bar mid-content-left"></div>
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
      <div class="massage-level footer-content-left"></div>
      <div class="login-week footer-content-right"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import breadCrumb from '@/components/bread_crumb.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { useUserInfo } from '@/stores/userinfor'
import { getAdminAndNumber, getCategoryAndNumber, getDayAndNumber, getLevelAndNumber } from '@/api/overview'
import { getUserInfo } from '@/api/userinfor'

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
const userProfile = reactive<UserProfile>({
  name: '',
  sex: '',
  identity: '',
  department: '',
})

const currentUserId = Number(localStorage.getItem('id') || userStore.id || 0)

const routerTo = (path: string) => {
  router.push(`/${path}`)
}

const loadUserProfile = async () => {
  if (!currentUserId) {
    return
  }

  const res = (await getUserInfo(currentUserId)) as any
  const data = res?.results ?? res?.data ?? res ?? {}
  userProfile.name = data.name ?? ''
  userProfile.sex = data.sex ?? ''
  userProfile.identity = data.identity ?? ''
  userProfile.department = data.department ?? ''
}

const renderPie = async () => {
  const chart = echarts.init(document.querySelector('.manage-user') as HTMLElement)
  chart.showLoading()
  const data = (await getAdminAndNumber()) as any
  chart.hideLoading()

  chart.setOption({
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
        data: data.data,
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

  window.addEventListener('resize', () => {
    chart.resize()
  })
}

const renderCategoryBar = async () => {
  const chart = echarts.init(document.querySelector('.product-category-bar') as HTMLElement)
  chart.showLoading()
  const data = (await getCategoryAndNumber()) as any
  chart.hideLoading()

  chart.setOption({
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
      data: data.category,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: data.price,
        type: 'bar',
        barWidth: 40,
        colorBy: 'data',
      },
    ],
  })

  window.addEventListener('resize', () => {
    chart.resize()
  })
}

const renderLevelPie = async () => {
  const chart = echarts.init(document.querySelector('.massage-level') as HTMLElement)
  chart.showLoading()
  const data = (await getLevelAndNumber()) as any
  chart.hideLoading()

  chart.setOption({
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
        data: data.data,
      },
    ],
  })

  window.addEventListener('resize', () => {
    chart.resize()
  })
}

const renderDayLine = async () => {
  const chart = echarts.init(document.querySelector('.login-week') as HTMLElement)
  chart.showLoading()
  const data = (await getDayAndNumber()) as any
  chart.hideLoading()

  chart.setOption({
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
      data: data.week,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: data.number,
        type: 'line',
      },
    ],
  })

  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(async () => {
  await loadUserProfile()
  await renderPie()
  await renderCategoryBar()
  await renderLevelPie()
  await renderDayLine()
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
