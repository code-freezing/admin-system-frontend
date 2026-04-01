<template>
  <el-dialog v-model="dialogUserVisible" title="用户详情" width="620px" center draggable>
    <div class="user-info-body">
      <div class="avatar-wrap">
        <el-avatar shape="square" :size="140" :src="avatarSrc" />
      </div>
      <div class="info-wrap">
        <div class="info-item">账号：{{ userData.account }}</div>
        <div class="info-item">姓名：{{ userData.name }}</div>
        <div class="info-item">性别：{{ userData.sex }}</div>
        <div class="info-item">部门：{{ userData.department }}</div>
        <div class="info-item">邮箱：{{ userData.email }}</div>
        <div class="info-item">
          状态：
          <span v-if="userData.status == 0">正常</span>
          <span v-else>冻结</span>
        </div>
      </div>
    </div>
    <div class="action-wrap">
      <span v-if="hasPermission('button.user.user.edit')" @click="openEdit(userData.id)">编辑</span>
      <span v-if="hasPermission('button.user.user.promote')" @click="openPromote(userData.id)">提升权限</span>
      <span v-if="hasPermission('button.user.user.delete')" @click="openDelete(userData.id)">删除用户</span>
    </div>
  </el-dialog>
  <promote ref="pro" @success="handleChildSuccess" />
  <edit ref="edit_user" @success="handleChildSuccess" />
  <remove ref="delete_user" @success="handleChildSuccess" />
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { usePermission } from '@/hooks/usePermission'
import { toAbsoluteResourceUrl } from '@/utils/runtime_url'
import promote from '../components/promote.vue'
import edit from '../components/edit_user.vue'
import remove from '../components/delete_admin.vue'

const emit = defineEmits(['success'])
// 记录弹窗状态用户显示状态，方便后续逻辑统一读取和更新。
const dialogUserVisible = ref(false)
const { hasPermission } = usePermission()

// 记录用户数据，方便后续逻辑统一读取和更新。
const userData = reactive({
  id: 0,
  imageUrl: '',
  account: '',
  name: '',
  sex: '',
  email: '',
  department: '',
  status: 0,
})

// 基于现有状态派生当前结果，避免同一份数据在多个地方重复计算。
const avatarSrc = computed(() => {
  return userData.imageUrl ? toAbsoluteResourceUrl(userData.imageUrl) : undefined
})

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const open = (row) => {
  // 弹窗直接消费列表行快照，避免详情展示再发一次接口请求。
  userData.id = row.id
  userData.imageUrl = row.image_url
  userData.account = row.account
  userData.name = row.name
  userData.sex = row.sex
  userData.email = row.email
  userData.department = row.department
  userData.status = row.status
  dialogUserVisible.value = true
}

// 记录当前状态，方便后续逻辑统一读取和更新。
const pro = ref()
// 更新用户，让当前记录按最新输入重新保存。
const edit_user = ref()
// 删除用户，避免旧数据继续影响后续流程。
const delete_user = ref()

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openPromote = (id) => {
  if (!hasPermission('button.user.user.promote')) return
  pro.value.open(id)
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openEdit = (id) => {
  if (!hasPermission('button.user.user.edit')) return
  edit_user.value.open(id)
}

// 处理当前模块的核心逻辑，避免同类分支散落在多个位置。
const openDelete = (id) => {
  if (!hasPermission('button.user.user.delete')) return
  delete_user.value.open({ kind: 'user', id, account: userData.account, name: userData.name })
}

// 处理当前分支的核心逻辑，避免同类操作散落在多个位置。
const handleChildSuccess = () => {
  // 子弹窗成功后先关闭当前详情，再通知父列表按当前视图刷新。
  dialogUserVisible.value = false
  emit('success')
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped>
.user-info-body {
  display: flex;
  align-items: flex-start;
  gap: 28px;
}

.avatar-wrap {
  width: 180px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.info-wrap {
  flex: 1;
  padding-top: 4px;
}

.info-item {
  line-height: 1.9;
  color: #606266;
  font-size: 16px;
}

.action-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;

  span {
    margin-left: 14px;
    color: #409eff;
    cursor: pointer;

    &:hover {
      color: #66b1ff;
    }
  }
}
</style>
