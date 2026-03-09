<template>
  <el-dialog v-model="dialogUserVisible" title="用户信息" width="620px" center draggable>
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
      <span @click="openEdit(userData.id)">编辑</span>
      <span @click="openPromote(userData.id)">赋权</span>
      <span @click="openDelete(userData.id)">删除用户</span>
    </div>
  </el-dialog>
  <promote ref="pro"></promote>
  <edit ref="edit_user"></edit>
  <remove ref="delete_user"></remove>
</template>

<script lang="ts" setup>
import { reactive, ref, onBeforeUnmount, computed } from 'vue'
import { bus } from '@/utils/mitt.js'
import promote from '../components/promote.vue'
import edit from '../components/edit_user.vue'
import remove from '../components/delete_admin.vue'
bus.on('userId', (row: any) => {
  userData.id = row.id
  // 兼容后端不同字段命名
  userData.imageUrl = row.image_url
  userData.account = row.account
  userData.name = row.name
  userData.sex = row.sex
  userData.email = row.email
  userData.department = row.department
  userData.status = row.status
})

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

const avatarSrc = computed(() => {
  if (!userData.imageUrl) return undefined
  if (/^https?:\/\//.test(userData.imageUrl)) return userData.imageUrl
  return `http://127.0.0.1:3007${userData.imageUrl}`
})
bus.on('offDialog', (id: number) => {
  if (id) {
    dialogUserVisible.value = false
  }
})
// 对用户进行赋权
const pro = ref()
const openPromote = (id: number) => {
  bus.emit('promoteId', id)
  pro.value.open()
}
// 对用户进行编辑
const edit_user = ref()
const openEdit = (id: number) => {
  bus.emit('editId', id)
  edit_user.value.open()
}
// 删除用户
const delete_user = ref()
const openDelete = (id: number) => {
  const userInfo = {
    id: id,
    account: userData.account,
    name: userData.name,
  }
  bus.emit('deleteUserId', userInfo)
  delete_user.value.open()
}

// 弹窗开关
const dialogUserVisible = ref(false)

// 打开编辑管理员的弹窗
const open = () => {
  dialogUserVisible.value = true
}

defineExpose({
  open,
})

onBeforeUnmount(() => {
  bus.all.clear()
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
