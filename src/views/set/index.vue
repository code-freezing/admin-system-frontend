<!--
  组件说明：
  1. 系统设置页面。
  2. 同时承载个人账号设置、公司信息设置和首页轮播/内容管理。
  3. 因为它连接用户资料与首页展示配置，所以是一个聚合型页面。
-->
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
                :on-success="handleAvatarSuccess"
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
                :on-success="handleSwiperSuccess"
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
import { ElInput, ElMessage } from 'element-plus'
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
import { buildApiUrl } from '@/utils/runtime_url'
import change from './components/change_password.vue'
import editor from './components/editor.vue'

// 设置页把账号资料、公司配置、首页轮播图和字典维护合并在同一个标签页容器中。
const userStore = useUserInfo()
const breadcrumb = ref()
const item = ref({
  first: '系统设置',
})

const activeName = ref('first')
const avatarUrl = ref(buildApiUrl('/user/uploadAvatar'))
const swiperUrl = ref(buildApiUrl('/set/uploadSwiper'))
// 上传地址在前端动态拼接，是为了兼容本地和未来可能的不同 API 域名配置。
const companyName = ref('')
const changeP = ref()
const editorP = ref()
const imageUrl = ref<string[]>([])

// 轮播图配置在后端按 swiper1~swiper6 存储，这里用固定数组驱动上传区域。
const swiperData = [
  { name: 'swiper1' },
  { name: 'swiper2' },
  { name: 'swiper3' },
  { name: 'swiper4' },
  { name: 'swiper5' },
  { name: 'swiper6' },
]

const dynamicTags = ref<string[]>([])
const dynamicProductTags = ref<string[]>([])
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()
const inputProductValue = ref('')
const inputProductVisible = ref(false)
const InputProductRef = ref<InstanceType<typeof ElInput>>()

// 基础设置在页面初始化时一次性加载，避免切标签后重复请求。
const loadCompanyName = async () => {
  companyName.value = (await getCompanyName()).data
}

const loadSwiperList = async () => {
  // 轮播图数组顺序必须和 swiperData 对应，模板里通过下标一一渲染上传区域。
  imageUrl.value = (await getAllSwiper()).data
}

const loadDepartmentList = async () => {
  dynamicTags.value = (await getDepartment()).data
}

const loadProductList = async () => {
  dynamicProductTags.value = (await getProduct()).data
}

// 头像上传成功后，还要调用 bind 接口把临时上传记录和当前账号真正绑定起来。
const handleAvatarSuccess = async (response: any) => {
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
    // 上传成功但绑定失败时，说明文件已进上传目录，但还没真正绑定到用户资料。
    ElMessage.error(res.message || '头像绑定失败')
  }
}

const beforeAvatarUpload = (rawFile: File) => {
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

const handleSwiperSuccess = () => {
  // 轮播图上传成功后直接重新拉取后端列表，保证页面展示的是后端最终保存结果。
  loadSwiperList()
}

// 账号资料保存拆成独立按钮，减少一次改多项时的联动风险。
const openChangePassword = () => {
  changeP.value.open()
}

const saveName = async () => {
  const res = await changeName(userStore.name, userStore.id)
  if (res.status == 0) {
    ElMessage.success('姓名修改成功')
  } else {
    ElMessage.error('姓名修改失败')
  }
}

const saveSex = async () => {
  const res = await changeSex(userStore.sex, userStore.id)
  if (res.status == 0) {
    ElMessage.success('性别修改成功')
  } else {
    ElMessage.error('性别修改失败')
  }
}

const saveEmail = async () => {
  const res = await changeEmail(userStore.email, userStore.id)
  if (res.status == 0) {
    ElMessage.success('邮箱修改成功')
  } else {
    ElMessage.error('邮箱修改失败')
  }
}

const resetCompanyName = async () => {
  const res = await changeCompanyName(companyName.value)
  if (res.status == 0) {
    ElMessage.success('公司名称修改成功')
  } else {
    ElMessage.error('公司名称修改失败')
  }
}

const openEditor = async (id: number) => {
  // 公司简介、愿景、企业文化、公司概览都复用同一个富文本弹窗，
  // 通过 id 区分当前要编辑的是哪一块配置。
  editorP.value.open(id)
}

// 字典维护直接操作本地 tag 数组，再整体提交给后端覆盖保存。
const handleClose = async (tag: string) => {
  dynamicTags.value = dynamicTags.value.filter((item) => item !== tag)
  const res = await setDepartment(JSON.stringify(toRaw(dynamicTags.value)))
  if (res.status == 0) {
    ElMessage.success('部门已更新')
  } else {
    ElMessage.error('部门更新失败')
  }
}

const handleProductClose = async (tag: string) => {
  dynamicProductTags.value = dynamicProductTags.value.filter((item) => item !== tag)
  const res = await setProduct(JSON.stringify(toRaw(dynamicProductTags.value)))
  if (res.status == 0) {
    ElMessage.success('产品分类已更新')
  } else {
    ElMessage.error('产品分类更新失败')
  }
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    // 切成输入态后立刻聚焦，避免用户还要额外点一次输入框。
    InputRef.value?.input?.focus()
  })
}

const showProductInput = () => {
  inputProductVisible.value = true
  nextTick(() => {
    InputProductRef.value?.input?.focus()
  })
}

const handleInputConfirm = async () => {
  if (inputValue.value) {
    // 这里采用“整体覆盖保存”的写法：把最新数组一次性传给后端。
    // 好处是后端不需要维护单条增删接口，代价是前后端要约定数组序列化格式。
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

onMounted(async () => {
  // 设置页是聚合页，但基础数据都比较独立，适合在首屏并行加载。
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
