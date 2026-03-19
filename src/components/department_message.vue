<template>
  <el-dialog v-model="dialog" title="部门消息" width="912px" center destroy-on-close>
    <el-container>
      <el-aside width="416px">
        <div class="message-list-wrapped">
          <div class="list-table-content">
            <el-table
              :data="msgStore.msg_list.length > 0 ? msgStore.msg_list : tableData"
              style="width: 100%"
              highlight-current-row
              @row-click="getDetail"
            >
              <el-table-column type="index" width="50" />
              <el-table-column width="5">
                <template #default="{ row }">
                  <div :class="idInList(row.id) ? 'readed' : 'noread'"></div>
                </template>
              </el-table-column>
              <el-table-column label="消息标题" prop="message_title">
                <template #default="{ row }">
                  <div class="title-wrapped">
                    <div class="title">{{ row.message_title }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="级别" prop="message_level">
                <template #default="{ row }">
                  <el-tag class="mx-1" round v-if="row.message_level === '一般'">
                    {{ row.message_level }}
                  </el-tag>
                  <el-tag type="warning" class="mx-1" round v-if="row.message_level === '重要'">
                    {{ row.message_level }}
                  </el-tag>
                  <el-tag type="danger" class="mx-1" round v-if="row.message_level === '紧急'">
                    {{ row.message_level }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="发布时间" prop="message_publish_time">
                <template #default="{ row }">
                  <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="detail-wrapped" v-if="messageInfo.message_title !== ''">
          <div>{{ messageInfo.message_title }}</div>
          <div v-html="messageInfo.message_content"></div>
        </div>
        <div class="detail-wrapped" v-else>请选择左侧消息查看详情。</div>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { clickDelete, getDepartmentMsg, getDepartmentMsgList, getReadListAndStatus } from '@/api/dep_msg'
import { updateClick } from '@/api/message'
import { useMsg } from '@/stores/message'

interface DepartmentMessageRow {
  id: number
  message_title: string
  message_content: string
  message_level?: string
  message_publish_time?: string
  message_click_number: number
}

const msgStore = useMsg()
const tableData = ref<DepartmentMessageRow[]>([])
const userInfoStr = localStorage.getItem('userinfo')
const localUserInfo = userInfoStr ? JSON.parse(userInfoStr) : null
const currentUserId = localUserInfo?.id || localStorage.getItem('id')
const currentDepartment = localUserInfo?.department || localStorage.getItem('department')

const messageInfo = reactive({
  message_title: '',
  message_content: '',
})

// 已读列表用于控制左侧圆点状态。
const readList = ref<number[]>([])
const dialog = ref(false)

const getUserDepartmentMessage = async () => {
  const id = currentUserId
  const department = currentDepartment

  if (!id || !department) {
    readList.value = []
    tableData.value = []
    return
  }

  if (department === '') {
    readList.value = []
    tableData.value = []
    return
  }

  const res = (await getReadListAndStatus(id)) as any

  if (!Array.isArray(res) || !res[0]) {
    readList.value = []
    tableData.value = []
    return
  }

  tableData.value = (await getDepartmentMsgList(department)) as DepartmentMessageRow[]

  if (res[0].read_status === 0) {
    const { read_list } = (await getDepartmentMsg(id, department)) as any
    readList.value = read_list
  } else {
    readList.value = JSON.parse(res[0].read_list)
  }
}

getUserDepartmentMessage()

// 点击列表项后先更新阅读状态，再刷新列表并展示详情。
const getDetail = async (row: DepartmentMessageRow) => {
  await updateClick(row.message_click_number, row.id)

  if (currentUserId) {
    await clickDelete(row.id, currentUserId as unknown as number)
  }

  messageInfo.message_title = row.message_title
  messageInfo.message_content = row.message_content
  await getUserDepartmentMessage()
}

const idInList = (id: number) => {
  return readList.value.indexOf(id) !== -1 ? 0 : 1
}

// 父组件通过 ref 调用 open()，这里仅负责把弹窗打开。
const open = () => {
  dialog.value = true
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped>
.el-aside {
  padding-left: 8px;
  min-height: 500px;
}

.el-main {
  min-height: 500px;
  --el-main-padding: 0px;
  border-left: 1px solid #eee;
}

.message-list-wrapped {
  height: 500px;
}

.list-table-content {
  min-height: 10px;
  padding: 8px;
}

.el-table {
  height: 100%;

  .title-wrapped {
    display: flex;
    align-items: center;
  }

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.readed {
  display: block;
  width: 5px;
  padding: 1px;
  height: 5px;
  border-radius: 50%;
  background: #a9a9a9;
}

.noread {
  display: block;
  width: 5px;
  padding: 1px;
  height: 5px;
  border-radius: 50%;
  background: #ffa500;
}

.detail-wrapped {
  padding: 8px;
}
</style>
