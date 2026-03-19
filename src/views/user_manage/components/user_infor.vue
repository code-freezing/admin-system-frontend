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
      <span @click="openPromote(userData.id)">璧嬫潈</span>
      <span @click="openDelete(userData.id)">删除用户</span>
    </div>
  </el-dialog>
  <promote ref="pro" @success="handleChildSuccess"></promote>
  <edit ref="edit_user" @success="handleChildSuccess"></edit>
  <remove ref="delete_user" @success="handleChildSuccess"></remove>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import promote from '../components/promote.vue'
import edit from '../components/edit_user.vue'
import remove from '../components/delete_admin.vue'

const emit = defineEmits(['success'])
const dialogUserVisible = ref(false)
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

const open = (row: any) => {
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

const pro = ref()
const edit_user = ref()
const delete_user = ref()

const openPromote = (id: number) => {
  pro.value.open(id)
}
const openEdit = (id: number) => {
  edit_user.value.open(id)
}
const openDelete = (id: number) => {
  delete_user.value.open({ kind: 'user', id, account: userData.account, name: userData.name })
}

const handleChildSuccess = () => {
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


