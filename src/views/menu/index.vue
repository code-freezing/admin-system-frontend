<!--
  组件说明：
  1. 后台主布局页。
  2. 负责渲染左侧菜单、顶部用户区、消息入口和内部 router-view。
  3. 登录成功后，几乎所有业务页面都会在这个壳子里切换。
-->
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
            <el-badge :is-dot="msgStore.read_list.length > 0" class="item" @click="openDepartmentMessage">
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

const resolveIcon = (iconName?: string) => {
  return iconName ? iconMap[iconName as keyof typeof iconMap] || Document : Document
}

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
    cancelIdleCallback?: (handle: number) => void
  }

let unreadTaskHandle: number | null = null

const scheduleUnreadLoad = () => {
  if (!userStore.id) {
    return
  }

  // 未读消息属于非阻塞信息，放到空闲时机加载能减少首屏竞争。
  const task = () => void msgStore.returnReadList(userStore.id)
  const idleWindow = window as IdleWindow

  if (typeof idleWindow.requestIdleCallback === 'function') {
    unreadTaskHandle = idleWindow.requestIdleCallback(() => task(), { timeout: 1000 })
    return
  }

  unreadTaskHandle = window.setTimeout(task, 300)
}

const cancelUnreadLoad = () => {
  if (unreadTaskHandle === null) {
    return
  }

  const idleWindow = window as IdleWindow

  if (typeof idleWindow.cancelIdleCallback === 'function') {
    idleWindow.cancelIdleCallback(unreadTaskHandle)
  } else {
    window.clearTimeout(unreadTaskHandle)
  }

  unreadTaskHandle = null
}

onMounted(() => {
  scheduleUnreadLoad()
})

onBeforeUnmount(() => {
  cancelUnreadLoad()
})

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

const departmentMsgRef = ref<InstanceType<typeof departmentMsg> | null>(null)
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
