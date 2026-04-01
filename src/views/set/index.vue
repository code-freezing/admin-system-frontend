<template>
  <breadCrumb ref="breadcrumb" :item="item" />
  <div class="common-wrapped">
    <div class="common-content">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="账号设置" name="first">
          <div class="account-info-wrapped">
            <span>头像</span>
            <div class="account-info-content">
              <el-upload
                class="avatar-uploader"
                :action="avatarUrl"
                :show-file-list="false"
                :headers="uploadHeaders"
                :with-credentials="true"
                :on-success="handleAvatarSuccess"
                :on-error="handleUploadError"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="userStore.imageUrl"
                  :src="userStore.imageUrl"
                  class="avatar"
                  alt="头像"
                />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>账号</span>
            <div class="account-info-content">
              <el-input v-model="userStore.account" disabled />
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>密码</span>
            <div class="account-info-content">
              <el-button type="primary" @click="openChangePassword">修改密码</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>姓名</span>
            <div class="account-info-content">
              <el-input v-model="userStore.name" />
            </div>
            <div class="account-save-button">
              <el-button type="primary" @click="saveName">保存</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>性别</span>
            <div class="account-info-content">
              <el-select v-model="userStore.sex" class="m-2" style="width: 100px">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </div>
            <div class="account-save-button">
              <el-button type="primary" @click="saveSex">保存</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>身份</span>
            <div class="account-info-content">
              <el-input v-model="userStore.identity" disabled />
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>部门</span>
            <div class="account-info-content">
              <el-input v-model="userStore.department" disabled />
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>邮箱</span>
            <div class="account-info-content">
              <el-input v-model="userStore.email" />
            </div>
            <div class="account-save-button">
              <el-button type="primary" @click="saveEmail">保存</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="公司设置" name="second">
          <div class="account-info-wrapped">
            <span>公司名称</span>
            <div class="account-info-content">
              <el-input v-model="companyName" />
            </div>
            <div class="account-save-button">
              <el-button type="primary" @click="resetCompanyName">修改公司名称</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>公司简介</span>
            <div class="account-info-content">
              <el-button type="success" @click="openEditor(1)">编辑公司简介</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>公司愿景</span>
            <div class="account-info-content">
              <el-button type="success" @click="openEditor(2)">编辑公司愿景</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>企业文化</span>
            <div class="account-info-content">
              <el-button type="success" @click="openEditor(3)">编辑企业文化</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>公司概览</span>
            <div class="account-info-content">
              <el-button type="success" @click="openEditor(4)">编辑公司概览</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="首页管理" name="third">
          <div class="home-wrapped">
            <div class="tips">
              <span>提示：这里用于维护首页轮播图，建议使用清晰的横向图片。</span>
            </div>
            <div class="swiper-wrapped" v-for="(item, index) in swiperData" :key="index">
              <div class="swiper-name">{{ item.name }}：</div>
              <el-upload
                class="avatar-uploader"
                :action="swiperUrl"
                :show-file-list="false"
                :headers="uploadHeaders"
                :with-credentials="true"
                :on-success="handleSwiperSuccess"
                :on-error="handleUploadError"
                :before-upload="beforeAvatarUpload"
                :data="item"
              >
                <template #trigger>
                  <img v-if="imageUrl[index]" :src="imageUrl[index]" class="swiper" alt="轮播图" />
                  <img v-else src="@/assets/logo.png" alt="默认图" />
                </template>
              </el-upload>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="字典维护" name="fourth">
          <div class="other-set">
            <div class="department-set">
              <span>部门维护</span>
              <el-tag
                v-for="tag in dynamicTags"
                :key="tag"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                class="ml-1 w-20"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
                + 添加部门
              </el-button>
            </div>
            <div class="product-set">
              <span>产品分类</span>
              <el-tag
                v-for="tag in dynamicProductTags"
                :key="tag"
                class="mx-1"
                closable
                :disable-transitions="false"
                @close="handleProductClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputProductVisible"
                ref="InputProductRef"
                v-model="inputProductValue"
                class="ml-1 w-20"
                size="small"
                @keyup.enter="handleInputProductConfirm"
                @blur="handleInputProductConfirm"
              />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showProductInput">
                + 添加分类
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <change ref="changeP" />
  <editor ref="editorP" />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, toRaw } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import breadCrumb from '@/components/bread_crumb.vue'
import { bind, changeEmail, changeName, changeSex } from '@/api/userinfor'
import {
  changeCompanyName,
  getAllSwiper,
  getCompanyName,
  getDepartment,
  getProduct,
  setDepartment,
  setProduct,
} from '@/api/setting'
import { useUserInfo } from '@/stores/userinfor'
import { getAccessToken } from '@/utils/auth'
import { buildApiUrl } from '@/utils/runtime_url'
import change from './components/change_password.vue'
import editor from './components/editor.vue'

const userStore = useUserInfo()
// 记录当前状态，方便后续逻辑统一读取和更新。
const breadcrumb = ref()
// 记录单项数据，方便后续逻辑统一读取和更新。
const item = ref({
  first: '系统设置',
})

// 记录名称，方便后续逻辑统一读取和更新。
const activeName = ref('first')
// 记录当前状态，方便后续逻辑统一读取和更新。
const avatarUrl = ref(buildApiUrl('/user/uploadAvatar'))
// 记录当前状态，方便后续逻辑统一读取和更新。
const swiperUrl = ref(buildApiUrl('/set/uploadSwiper'))
// 上传组件不会走 axios 拦截器，这里手动补上鉴权头，避免文件直传时丢掉 access token。
const uploadHeaders = ref({
  Authorization: getAccessToken(),
})
// 记录名称，方便后续逻辑统一读取和更新。
const companyName = ref('')
// 记录当前状态，方便后续逻辑统一读取和更新。
const changeP = ref()
// 记录编辑器，方便后续逻辑统一读取和更新。
const editorP = ref()
// 记录当前状态，方便后续逻辑统一读取和更新。
const imageUrl = ref([])

const swiperData = [
  { name: 'swiper1' },
  { name: 'swiper2' },
  { name: 'swiper3' },
  { name: 'swiper4' },
  { name: 'swiper5' },
  { name: 'swiper6' },
]

// 记录当前状态，方便后续逻辑统一读取和更新。
const dynamicTags = ref([])
// 记录产品，方便后续逻辑统一读取和更新。
const dynamicProductTags = ref([])
// 记录当前状态，方便后续逻辑统一读取和更新。
const inputValue = ref('')
// 记录显示状态，方便后续逻辑统一读取和更新。
const inputVisible = ref(false)
// 记录当前状态，方便后续逻辑统一读取和更新。
const InputRef = ref()
// 记录产品，方便后续逻辑统一读取和更新。
const inputProductValue = ref('')
// 记录产品显示状态，方便后续逻辑统一读取和更新。
const inputProductVisible = ref(false)
// 记录产品，方便后续逻辑统一读取和更新。
const InputProductRef = ref()

// 加载名称，让后续逻辑直接复用准备好的数据。
const loadCompanyName = async () => {
  companyName.value = (await getCompanyName()).data
}

// 加载列表，让后续逻辑直接复用准备好的数据。
const loadSwiperList = async () => {
  // 轮播图列表顺序必须和 swiperData 对应，模板里通过下标一一渲染上传区域。
  imageUrl.value = (await getAllSwiper()).data
}

// 加载部门列表，让后续逻辑直接复用准备好的数据。
const loadDepartmentList = async () => {
  dynamicTags.value = (await getDepartment()).data
}

// 加载产品列表，让后续逻辑直接复用准备好的数据。
const loadProductList = async () => {
  dynamicProductTags.value = (await getProduct()).data
}

// 处理当前分支的核心逻辑，避免同类操作散落在多个位置。
const handleAvatarSuccess = async (response) => {
  // 头像上传成功后还要执行 bind，才能把临时上传记录真正绑定到当前账号。
  if (response.status !== 0) {
    ElMessage.error('头像上传失败')
    return
  }

  // 先乐观更新本地头像，让页面立刻反馈新图片。
  userStore.$patch({
    imageUrl: response.url,
  })

  const account = (userStore.account || '').trim()
  if (!account) {
    ElMessage.error('账号信息不完整，无法绑定头像')
    return
  }

  const res = await bind(account, response.onlyId, response.url)
  if (res.status === 0) {
    ElMessage.success('头像更新成功')
  } else {
    ElMessage.error(res.message || '头像绑定失败')
  }
}

// 处理上传，把当前模块的关键逻辑集中在这里。
const beforeAvatarUpload = (rawFile) => {
  // 每次真正开始上传前都重新取一次 token，避免页面停留过久后仍拿旧凭证发请求。
  uploadHeaders.value = {
    Authorization: getAccessToken(),
  }

  const isImage = ['image/jpeg', 'image/png'].includes(rawFile.type)
  if (!isImage) {
    ElMessage.error('请上传 JPG 或 PNG 图片')
    return false
  }

  const isLt2M = rawFile.size / 1024 / 1024 <= 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }

  return true
}

// 上传接口是浏览器直传，请求失败时不会走项目 axios 提示链，这里单独补一层可见反馈。
const handleUploadError = () => {
  ElMessage.error('上传失败，请确认登录状态和当前权限')
}

// 处理当前分支的核心逻辑，避免同类操作散落在多个位置。
const handleSwiperSuccess = () => {
  loadSwiperList()
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openChangePassword = () => {
  changeP.value.open()
}

// 保存名称，确保当前改动能在后续流程里被读取到。
const saveName = async () => {
  const res = await changeName(userStore.name, userStore.id)
  if (res.status == 0) {
    ElMessage.success('姓名修改成功')
  } else {
    ElMessage.error('姓名修改失败')
  }
}

// 保存当前改动，确保后续流程读取到的是最新结果。
const saveSex = async () => {
  const res = await changeSex(userStore.sex, userStore.id)
  if (res.status == 0) {
    ElMessage.success('性别修改成功')
  } else {
    ElMessage.error('性别修改失败')
  }
}

// 保存当前改动，确保后续流程读取到的是最新结果。
const saveEmail = async () => {
  const res = await changeEmail(userStore.email, userStore.id)
  if (res.status == 0) {
    ElMessage.success('邮箱修改成功')
  } else {
    ElMessage.error('邮箱修改失败')
  }
}

// 重置名称，把当前流程恢复到干净初始状态。
const resetCompanyName = async () => {
  const res = await changeCompanyName(companyName.value)
  if (res.status == 0) {
    ElMessage.success('公司名称修改成功')
  } else {
    ElMessage.error('公司名称修改失败')
  }
}

// 处理编辑器，把当前模块的关键逻辑集中在这里。
const openEditor = async (id) => {
  // 公司简介、愿景、企业文化和概览都复用同一个富文本弹窗，通过 id 区分当前配置项。
  editorP.value.open(id)
}

// 处理当前分支的核心逻辑，避免同类操作散落在多个位置。
const handleClose = async (tag) => {
  // 字典维护直接提交整个数组快照，后端按最新结果整体覆盖保存。
  dynamicTags.value = dynamicTags.value.filter((item) => item !== tag)
  const res = await setDepartment(JSON.stringify(toRaw(dynamicTags.value)))
  if (res.status == 0) {
    ElMessage.success('部门已更新')
  } else {
    ElMessage.error('部门更新失败')
  }
}

// 处理产品，把当前分支的核心逻辑集中在这里。
const handleProductClose = async (tag) => {
  dynamicProductTags.value = dynamicProductTags.value.filter((item) => item !== tag)
  const res = await setProduct(JSON.stringify(toRaw(dynamicProductTags.value)))
  if (res.status == 0) {
    ElMessage.success('产品分类已更新')
  } else {
    ElMessage.error('产品分类更新失败')
  }
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value?.input?.focus()
  })
}

// 处理产品，把当前模块的关键逻辑集中在这里。
const showProductInput = () => {
  inputProductVisible.value = true
  nextTick(() => {
    InputProductRef.value?.input?.focus()
  })
}

// 处理当前分支的核心逻辑，避免同类操作散落在多个位置。
const handleInputConfirm = async () => {
  if (inputValue.value) {
    dynamicTags.value = [...dynamicTags.value, inputValue.value]
    const res = await setDepartment(JSON.stringify(toRaw(dynamicTags.value)))
    if (res.status == 0) {
      ElMessage.success('部门添加成功')
    } else {
      ElMessage.error('部门添加失败')
    }
  }

  inputVisible.value = false
  inputValue.value = ''
}

// 处理产品，把当前分支的核心逻辑集中在这里。
const handleInputProductConfirm = async () => {
  if (inputProductValue.value) {
    dynamicProductTags.value = [...dynamicProductTags.value, inputProductValue.value]
    const res = await setProduct(JSON.stringify(toRaw(dynamicProductTags.value)))
    if (res.status == 0) {
      ElMessage.success('产品分类添加成功')
    } else {
      ElMessage.error('产品分类添加失败')
    }
  }

  inputProductVisible.value = false
  inputProductValue.value = ''
}

// 页面首次进入后从这里拉起首屏数据或初始化流程。
onMounted(async () => {
  // 设置页虽然是聚合页，但各块数据彼此独立，适合在首屏并行加载。
  await Promise.all([loadCompanyName(), loadSwiperList(), loadDepartmentList(), loadProductList()])
})
</script>

<style lang="scss" scoped>
.common-wrapped {
  padding: 8px;
  background: #f5f5f5;
  height: calc(100vh - 101px);

  .common-content {
    padding: 0 10px;
    height: 100%;
    background: #fff;

    .account-info-wrapped {
      display: flex;
      align-items: center;
      padding-left: 50px;
      margin-bottom: 24px;
      font-size: 14px;

      .account-info-content {
        margin-left: 24px;
        margin-right: 16px;
      }

      .account-save-button {
        margin-left: 16px;
      }
    }

    .home-wrapped {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      padding: 20px 50px;

      .tips {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        span {
          font-size: 14px;
          color: #888;
        }
      }

      .swiper-wrapped {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .swiper-name {
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .swiper {
          width: 100%;
          max-width: 500px;
          height: 280px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
          cursor: pointer;

          &:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        }
      }
    }
  }
}

.other-set {
  padding-left: 50px;
  font-size: 14px;

  .department-set,
  .product-set {
    margin-bottom: 24px;

    span {
      margin-right: 24px;
    }
  }
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.swiper {
  display: block;
}
</style>
