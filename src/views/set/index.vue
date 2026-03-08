<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <!-- 外壳 -->
  <div class="common-wrapped">
    <!-- 内容 -->
    <div class="common-content">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="账号详情" name="first">
          <div class="account-info-wrapped">
            <span>用户头像：</span>
            <div class="account-info-content">
              <!-- action 是上传头像的接口 -->
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
                  alt="用户头像"
                />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户账号：</span>
            <div class="account-info-content">
              <el-input v-model="userStore.account" disabled></el-input>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户密码：</span>
            <div class="account-info-content">
              <el-button type="primary" @click="openChangePassword">修改密码</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户姓名：</span>
            <div class="account-info-content">
              <el-input v-model="userStore.name"></el-input>
            </div>
            <div class="account-save-button">
              <el-button type="primary" @click="saveName">保存</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户性别：</span>
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
            <span>用户身份：</span>
            <div class="account-info-content">
              <el-input v-model="userStore.identity" disabled></el-input>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户部门：</span>
            <div class="account-info-content">
              <el-input v-model="userStore.department" disabled></el-input>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户邮箱：</span>
            <div class="account-info-content">
              <el-input v-model="userStore.email"></el-input>
            </div>
            <div class="account-save-button">
              <el-button type="primary" @click="saveEmail">保存</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <!-- 修改密码弹窗 -->
  <change ref="changeP"></change>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import breadCrumb from '@/components/bread_crumb.vue'
import { ElMessage } from 'element-plus'

import { bind, changeName, changeSex, changeEmail, getUserInfo } from '@/api/userinfor'
import { useUserInfo } from '@/stores/userinfor'
import change from './components/change_password.vue'
const userStore = useUserInfo()

const changeP = ref()

const avatarUrl = ref(`http://localhost:3007/user/uploadAvatar`)
// console.log(import.meta.env.VITE_API_BASEURL)

// 面包屑
const breadcrumb = ref()
// 面包屑参数
const item = ref({
  first: '系统设置',
})

// 默认打开的标签页
const activeName = ref('first')

// 头像上传成功的函数 response回应
const handleAvatarSuccess = (response: any) => {
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  console.log(response)
  if (response.status == 0) {
    userStore.$patch({
      imageUrl: response.url,
    })
    ElMessage({
      message: '更新头像成功',
      type: 'success',
    })
    ;(async () => {
      const account = (userStore.account || '').trim()
      if (!account) {
        ElMessage.error('绑定失败：账号信息缺失，请重新登录')
        return
      }

      const res = await bind(account, response.onlyId, response.url)
      console.log(res)

      if (res?.data?.status !== 0) {
        ElMessage.error(res?.data?.message || '头像与账号绑定失败')
      }
    })()
  } else {
    ElMessage.error('更新头像失败！请重新上传')
  }
}
// 头像上传之前的函数
const beforeAvatarUpload = (rawFile: any) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('头像必须是jpg格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像必须小于2MB!')
    return false
  }
  return true
}

// 打开密码弹窗
const openChangePassword = () => {
  changeP.value.open()
}

// 保存姓名
const saveName = async () => {
  const res = await changeName(userStore.name, userStore.id)
  console.log(res)

  if (res.data.status == 0) {
    ElMessage({
      message: '修改成功',
      type: 'success',
    })
  } else {
    ElMessage.error('修改姓名失败，请重新输入！')
  }
}

// 保存性别
const saveSex = async () => {
  const res = await changeSex(userStore.sex, userStore.id)
  if (res.data.status == 0) {
    ElMessage({
      message: '修改成功',
      type: 'success',
    })
  } else {
    ElMessage.error('修改性别失败，请重新输入！')
  }
}

// 保存邮箱
const saveEmail = async () => {
  const res = await changeEmail(userStore.email, userStore.id)
  if (res.data.status == 0) {
    ElMessage({
      message: '修改成功',
      type: 'success',
    })
  } else {
    ElMessage.error('修改邮箱失败，请重新输入！')
  }
}
</script>

<style lang="scss" scoped>
// 外壳
.common-wrapped {
  padding: 8px;
  background: #f5f5f5;
  // 计算 减去了头部还有面包屑 + 2X8=16边距
  height: calc(100vh - 101px);

  // 内容
  .common-content {
    padding: 0 10px;
    height: 100%;
    background: #fff;

    // 账号信息外壳
    .account-info-wrapped {
      display: flex;
      align-items: center;
      padding-left: 50px;
      margin-bottom: 24px;
      font-size: 14px;

      // 账号信息内容
      .account-info-content {
        margin-left: 24px;
        margin-right: 16px;
      }

      // 按钮
      .account-save-button {
        margin-left: 16px;
      }
    }

    // 首页管理外壳
    .home-wrapped {
      padding-left: 50px;
      display: flex;
      flex-direction: column;

      // 提示
      .tips {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        span {
          font-size: 14px;
          color: silver;
        }
      }

      // 轮播图
      .swiper-wrapped {
        display: flex;
        margin-bottom: 16px;

        // 轮播图名字
        .swiper-name {
          font-size: 14px;
          margin-bottom: 24px;
        }

        .swiper {
          width: 336px;
          height: 96px;
        }
      }
    }
  }
}

// 其他设置
.other-set {
  padding-left: 50px;
  font-size: 14px;

  .department-set {
    margin-bottom: 24px;

    span {
      margin-right: 24px;
    }
  }

  .product-set {
    span {
      margin-right: 24px;
    }
  }
}

// 标签页
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

// 上传头像
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

// 输入框的长度
:deep(.el-input) {
  width: 240px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
