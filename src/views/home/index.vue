<!--
  组件说明：
  1. 后台首页。
  2. 组合轮播图、公司简介、公司公告和系统消息，作为登录后的默认落点。
  3. 首页的数据来源较分散，因此这里承担了多个接口的聚合加载。
-->
<template>
  <breadCrumb :item="breadcrumbItem" />
  <div class="home-wrapped">
    <div class="swiper-wrapped">
      <el-skeleton :loading="loadingSwiper" animated>
        <template #template>
          <el-skeleton-item variant="image" class="swiper-skeleton" />
        </template>
        <el-carousel :interval="4000" indicator-position="outside" type="card" height="320px">
          <el-carousel-item v-for="(url, index) in imageUrls" :key="index">
            <img :src="url" class="swiper" alt="" loading="lazy" />
          </el-carousel-item>
        </el-carousel>
      </el-skeleton>
    </div>

    <div class="layout-wrapped">
      <el-skeleton :loading="loadingCompany" animated :count="1">
        <template #template>
          <el-row :gutter="20">
            <el-col :span="6" v-for="item in 4" :key="item">
              <div class="company-message-area skeleton-card">
                <el-skeleton-item variant="text" style="width: 30%" />
                <el-skeleton-item variant="text" style="width: 100%" />
                <el-skeleton-item variant="text" style="width: 90%" />
                <el-skeleton-item variant="text" style="width: 80%" />
              </div>
            </el-col>
          </el-row>
        </template>
        <el-row :gutter="20">
          <el-col
            :span="6"
            v-for="(item, index) in companyIntroduce"
            :key="index"
            @click="openIntroduce(index + 1)"
          >
            <div class="company-message-area">
              <span>{{ item.set_name }}</span>
              <div v-html="item.set_text" class="company-introduce"></div>
            </div>
          </el-col>
        </el-row>
      </el-skeleton>
    </div>

    <div class="two-table-wrapped">
      <div class="company-notice">
        <span class="title">公司公告</span>
        <el-skeleton :loading="loadingMessages" animated>
          <template #template>
            <div class="table-skeleton">
              <el-skeleton-item variant="text" v-for="item in 5" :key="item" />
            </div>
          </template>
          <el-table :data="companyMessages" style="width: 100%" :show-header="false" @row-dblclick="openCompany">
            <el-table-column prop="message_title" label="公告主题">
              <template #default="{ row }">
                <div class="message_title">{{ row.message_title }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="message_level" label="等级">
              <template #default="{ row }">
                <el-tag class="mx-1" round v-if="row.message_level === '一般'">{{ row.message_level }}</el-tag>
                <el-tag type="warning" class="mx-1" round v-if="row.message_level === '重要'">
                  {{ row.message_level }}
                </el-tag>
                <el-tag type="danger" class="mx-1" round v-if="row.message_level === '紧急'">
                  {{ row.message_level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="message_publish_department" label="发布部门" />
            <el-table-column prop="message_publish_time" label="发布时间" width="200">
              <template #default="{ row }">
                <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-skeleton>
      </div>

      <div class="system-message">
        <span class="title">系统消息</span>
        <el-skeleton :loading="loadingMessages" animated>
          <template #template>
            <div class="table-skeleton">
              <el-skeleton-item variant="text" v-for="item in 5" :key="item" />
            </div>
          </template>
          <el-table :data="systemMessages" style="width: 100%" :show-header="false" @row-dblclick="openSystem">
            <el-table-column prop="message_title" label="公告主题" />
            <el-table-column prop="message_publish_time" label="发布时间" width="200">
              <template #default="{ row }">
                <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-skeleton>
      </div>
    </div>
  </div>

  <introduce ref="introduceRef" />
  <bulletin ref="bulletinRef" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import breadCrumb from '@/components/bread_crumb.vue'
import introduce from './components/introduce.vue'
import bulletin from '@/components/common_msg.vue'
import { getAllSwiper, getAllCompanyIntroduce } from '@/api/setting'
import { companyMessageList, systemMessageList } from '@/api/message'
import { useUserInfo } from '@/stores/userinfor'
import { hasAuthSession } from '@/utils/auth'
import { getViewCache, setViewCache } from '@/utils/view_cache'

interface CompanyIntroduceItem {
  id: number
  set_name: string
  set_value: string | null
  set_text: string
}

interface BulletinRow {
  message_title: string
  message_content: string
  message_level?: string
  message_publish_department?: string
  message_publish_time?: string
  [key: string]: any
}

const router = useRouter()
const userStore = useUserInfo()

const breadcrumbItem = ref({
  first: '首页',
})

const imageUrls = ref<string[]>([])
const companyIntroduce = ref<CompanyIntroduceItem[]>([])
const companyMessages = ref<BulletinRow[]>([])
const systemMessages = ref<BulletinRow[]>([])
const loadingSwiper = ref(true)
const loadingCompany = ref(true)
const loadingMessages = ref(true)

const introduceRef = ref<InstanceType<typeof introduce> | null>(null)
const bulletinRef = ref<InstanceType<typeof bulletin> | null>(null)
const HOME_CACHE_KEY = 'home-dashboard'
const HOME_CACHE_TTL = 60 * 1000

const openIntroduce = (id: number) => {
  introduceRef.value?.open(id)
}

const openCompany = (row: BulletinRow) => {
  bulletinRef.value?.openCompany(row)
}

const openSystem = (row: BulletinRow) => {
  bulletinRef.value?.openSystem(row)
}

const applyHomePayload = (payload: {
  imageUrls: string[]
  companyIntroduce: CompanyIntroduceItem[]
  companyMessages: BulletinRow[]
  systemMessages: BulletinRow[]
}) => {
  imageUrls.value = Array.isArray(payload.imageUrls) ? payload.imageUrls : []
  companyIntroduce.value = Array.isArray(payload.companyIntroduce) ? payload.companyIntroduce : []
  companyMessages.value = Array.isArray(payload.companyMessages) ? payload.companyMessages : []
  systemMessages.value = Array.isArray(payload.systemMessages) ? payload.systemMessages : []
}

const loadHomeData = async () => {
  const cachedPayload = getViewCache<{
    imageUrls: string[]
    companyIntroduce: CompanyIntroduceItem[]
    companyMessages: BulletinRow[]
    systemMessages: BulletinRow[]
  }>(HOME_CACHE_KEY)

  if (cachedPayload) {
    applyHomePayload(cachedPayload)
    loadingSwiper.value = false
    loadingCompany.value = false
    loadingMessages.value = false
    return
  }

  loadingSwiper.value = true
  loadingCompany.value = true
  loadingMessages.value = true

  try {
    const [swiperRes, companyRes, companyMessageRes, systemMessageRes] = await Promise.all([
      getAllSwiper(),
      getAllCompanyIntroduce(),
      companyMessageList(),
      systemMessageList(),
    ])

    const payload = {
      imageUrls: Array.isArray(swiperRes) ? (swiperRes as string[]) : [],
      companyIntroduce: Array.isArray(companyRes) ? (companyRes as CompanyIntroduceItem[]) : [],
      companyMessages: Array.isArray(companyMessageRes) ? (companyMessageRes as BulletinRow[]) : [],
      systemMessages: Array.isArray(systemMessageRes) ? (systemMessageRes as BulletinRow[]) : [],
    }

    applyHomePayload(payload)
    setViewCache(HOME_CACHE_KEY, payload, HOME_CACHE_TTL)
  } catch {
    imageUrls.value = []
    companyIntroduce.value = []
    companyMessages.value = []
    systemMessages.value = []
  } finally {
    loadingSwiper.value = false
    loadingCompany.value = false
    loadingMessages.value = false
  }
}

onMounted(() => {
  // 首页展示的数据比较分散，这里统一做并发加载，并允许短时缓存复用。
  void loadHomeData()
})

// 页面刷新时，Pinia 里可能还没来得及恢复 userStore，这里做一次兜底回填。
if (!userStore.id && hasAuthSession()) {
  const id = Number(localStorage.getItem('id') || 0)
  if (id > 0) {
    userStore.userInfo(id)
  }
}

void router
</script>

<style lang="scss" scoped>
.home-wrapped {
  padding: 8px;
  height: calc(100vh - 101px);
  background: #f5f5f5;
  display: flex;
  flex-direction: column;

  .swiper-wrapped {
    padding: 0 20px;
    background: #fff;
    margin-bottom: 8px;

    .swiper-skeleton {
      width: 100%;
      height: 320px;
    }

    .swiper {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .layout-wrapped {
    padding: 8px;
    margin-bottom: 8px;
    background: #fff;

    .company-message-area {
      background: #f5f5f5;
      height: 200px;
      padding: 8px;
      cursor: pointer;

      span {
        border-bottom: 1px solid #409eff;
        font-size: 14px;
      }

      .company-introduce {
        text-indent: 24px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }
    }

    .company-message-area:hover {
      cursor: pointer;
      background-color: #eef5ff;
    }

    .skeleton-card {
      gap: 12px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
  }

  .two-table-wrapped {
    height: 232px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #fff;

    .company-notice,
    .system-message {
      height: 232px;
      width: 48%;
      display: flex;
      flex-direction: column;
    }

    .title {
      font-size: 14px;
      margin-bottom: 5px;
      border-bottom: 1px solid #ea0709;
    }

    .table-skeleton {
      display: flex;
      gap: 10px;
      flex-direction: column;
      padding: 12px 0;
    }
  }
}

.message_title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
