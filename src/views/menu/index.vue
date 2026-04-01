<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="210px">
        <el-menu class="el-menu-vertical-demo" router>
          <div class="title">通用后台管理系统</div>
          <template v-for="item in permissionStore.menuTree" :key="item.name">
            <el-sub-menu v-if="item.children?.length" :index="item.name">
              <template #title>
                <el-icon>
                  <component :is="resolveIcon(item.meta?.icon)" />
                </el-icon>
                <span>{{ item.meta?.title }}</span>
              </template>
              <el-menu-item v-for="child in item.children" :key="child.name" :index="child.path">
                {{ child.meta?.title }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="item.path">
              <el-icon>
                <component :is="resolveIcon(item.meta?.icon)" />
              </el-icon>
              <span>{{ item.meta?.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="header-left-content">尊敬的 {{ welcomeName }} 欢迎您登录本系统</span>
          <div class="header-right-content">
            <el-badge
              :is-dot="msgStore.read_list.length > 0"
              class="item"
              @click="openDepartmentMessage"
            >
              <el-icon :size="20" class="message">
                <Message />
              </el-icon>
            </el-badge>
            <el-avatar :size="24" :src="userStore.imageUrl" />
            <el-dropdown>
              <span class="el-dropdown-link"> 设置 </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>设置账号</el-dropdown-item>
                  <el-dropdown-item>更换头像</el-dropdown-item>
                  <el-dropdown-item @click="goLogin">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
  <departmentMsg ref="departmentMsgRef" />
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChatSquare,
  DataAnalysis,
  Document,
  Files,
  House,
  Message,
  Memo,
  TakeawayBox,
  Tools,
  User,
} from '@element-plus/icons-vue'
import departmentMsg from '@/components/department_message.vue'
import { logout } from '@/api/login'
import { usePermission as usePermissionStore } from '@/stores/permission'
import { useUserInfo } from '@/stores/userinfor'
import { useMsg } from '@/stores/message'
import { useMenu } from '@/stores/menu'
import { clearLoginState } from '@/utils/auth'

const msgStore = useMsg()
const permissionStore = usePermissionStore()
const userStore = useUserInfo()
const menuStore = useMenu()
const router = useRouter()
// 基于现有状态派生名称，避免同一份结果在多个地方重复计算。
const welcomeName = computed(() => userStore.name || '')

const iconMap = {
  House,
  Tools,
  User,
  TakeawayBox,
  ChatSquare,
  Document,
  DataAnalysis,
  Files,
  Memo,
}

// 解析当前结果，让后续分支基于统一数据继续执行。
const resolveIcon = (iconName?: string) => {
  return iconName ? iconMap[iconName] || Document : Document
}

let unreadTaskHandle: number | null = null

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const scheduleUnreadLoad = () => {
  if (!userStore.id) {
    return
  }

  // 未读消息属于非阻塞信息，放到空闲时机加载能减少首屏竞争。
  const task = () => void msgStore.returnReadList(userStore.id)
  const idleWindow = window

  if (typeof idleWindow.requestIdleCallback === 'function') {
    unreadTaskHandle = idleWindow.requestIdleCallback(() => task(), { timeout: 1000 })
    return
  }

  unreadTaskHandle = window.setTimeout(task, 300)
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const cancelUnreadLoad = () => {
  if (unreadTaskHandle === null) {
    return
  }

  const idleWindow = window

  if (typeof idleWindow.cancelIdleCallback === 'function') {
    idleWindow.cancelIdleCallback(unreadTaskHandle)
  } else {
    window.clearTimeout(unreadTaskHandle)
  }

  unreadTaskHandle = null
}

// 页面首次进入后从这里拉起首屏数据或初始化流程。
onMounted(() => {
  scheduleUnreadLoad()
})

onBeforeUnmount(() => {
  cancelUnreadLoad()
})

// 处理登录，把当前模块的关键逻辑集中在这里。
const goLogin = async () => {
  // 退出登录后同时清空本地上下文，避免下一次进入后台时复用旧菜单和旧用户信息。
  await logout()

  menuStore.reset()
  permissionStore.reset()
  userStore.reset()
  msgStore.reset()
  clearLoginState()
  router.push('/login')
}

// 记录部门消息，方便后续逻辑统一读取和更新。
const departmentMsgRef = ref(null)
// 处理部门消息，把当前模块的关键逻辑集中在这里。
const openDepartmentMessage = () => {
  departmentMsgRef.value?.open()
}
</script>

<style lang="scss" scoped>
.el-aside {
  height: 100vh;
  background: #2b303b;
  width: 210px;
  overflow-x: hidden;

  .el-menu {
    background: #2b303b;
    width: 210px;
    height: 100vh;
    border-right: 0;
  }

  .title {
    padding: 20px;
    display: flex;
    justify-content: center;
    color: #fff;
    background: #2b303b;
  }

  .el-menu-item {
    color: #fff;
  }
}

.el-header {
  display: flex;
  height: 55px;
  background: #262f3e;
  color: #c1c6c8;
  align-items: center;
  justify-content: space-between;

  .header-left-content {
    font-size: 14px;
  }

  .header-right-content {
    width: 160px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}

.item {
  cursor: pointer;
}

.el-main {
  --el-main-padding: 0;
  background-color: #f3f4fa;
}

.el-menu-item:hover {
  background: #006eff;
}

:deep(.el-sub-menu__title:hover) {
  background: #006eff;
}

:deep(.el-sub-menu__title) {
  color: #fff;
}

:deep(.el-menu--inline) {
  background: #2b303b;
}
</style>
