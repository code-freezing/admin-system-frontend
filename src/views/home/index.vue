<template>
  <breadCrumb :item="breadcrumbItem" />
  <div class="home-wrapped">
    <div class="swiper-wrapped">
      <el-carousel :interval="4000" indicator-position="outside" type="card" height="320px">
        <el-carousel-item v-for="(url, index) in imageUrls" :key="index">
          <img :src="url" class="swiper" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="layout-wrapped">
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
    </div>

    <div class="two-table-wrapped">
      <div class="company-notice">
        <span class="title">公司公告</span>
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
      </div>

      <div class="system-message">
        <span class="title">系统消息</span>
        <el-table :data="systemMessages" style="width: 100%" :show-header="false" @row-dblclick="openSystem">
          <el-table-column prop="message_title" label="公告主题" />
          <el-table-column prop="message_publish_time" label="发布时间" width="200">
            <template #default="{ row }">
              <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
        </el-table>
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

const introduceRef = ref<InstanceType<typeof introduce> | null>(null)
const bulletinRef = ref<InstanceType<typeof bulletin> | null>(null)

const openIntroduce = (id: number) => {
  introduceRef.value?.open(id)
}

const openCompany = (row: BulletinRow) => {
  bulletinRef.value?.openCompany(row)
}

const openSystem = (row: BulletinRow) => {
  bulletinRef.value?.openSystem(row)
}

const loadSwiper = async () => {
  imageUrls.value = (await getAllSwiper()) as string[]
}

const loadCompanyIntroduce = async () => {
  const res = (await getAllCompanyIntroduce()) as CompanyIntroduceItem[]
  companyIntroduce.value = Array.isArray(res) ? res : []
}

const loadMessages = async () => {
  companyMessages.value = (await companyMessageList()) as BulletinRow[]
  systemMessages.value = (await systemMessageList()) as BulletinRow[]
}

onMounted(() => {
  // 首页展示的数据比较分散，这里在挂载时并行触发几类内容加载。
  loadSwiper()
  loadCompanyIntroduce()
  loadMessages()
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

    .swiper {
      width: 100%;
      height: 100%;
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
