<!--
  组件说明：
  1. 合同/文件管理页面。
  2. 负责展示文件列表、上传文件、搜索文件以及预览下载相关交互。
  3. 超级管理员通过这里维护公共文件资源。
-->
<template>
  <breadCrumb ref="breadcrumb" :item="item" />
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <div />
        <div class="upload-wrapped">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            :action="baseUrl"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :show-file-list="false"
          >
            <el-button type="primary">上传文件</el-button>
          </el-upload>
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="file_name" label="文件名" />
          <el-table-column prop="file_size" label="文件大小">
            <template #default="{ row }">
              <div>{{ row.file_size?.slice(0, 2) }}KB</div>
            </template>
          </el-table-column>
          <el-table-column prop="upload_person" label="上传人" />
          <el-table-column prop="download_number" label="下载次数" />
          <el-table-column prop="upload_time" label="上传时间" width="200">
            <template #default="{ row }">
              <div>{{ row.upload_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div>
                <el-button type="success">
                  <a :href="row.file_url" @click="changeClick(row.download_number, row.id)"
                    >下载文件</a
                  >
                </el-button>
                <el-button type="danger" @click="deleteFile(row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="table-footer">
      <el-pagination
        :page-size="10"
        :current-page="paginationData.fileCurrentPage"
        :pager-count="7"
        :total="paginationData.fileTotal"
        :page-count="paginationData.filePageCount"
        layout="prev, pager, next"
        @current-change="fileCurrentChange"
      />
    </div>
  </div>
  <tips ref="tip" @success="reloadFileList" />
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import type { UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import breadCrumb from '@/components/bread_crumb.vue'
import tips from './components/tips.vue'
import { bindFileAndUser, fileListLength, returnFilesListData, updateDownload } from '@/api/file'

interface FileRow {
  id: number
  file_name: string
  file_size?: string
  upload_person?: string
  download_number: number
  upload_time?: string
  file_url: string
}

const breadcrumb = ref()
const item = ref({
  first: '文件管理',
  second: '',
})

const apiBaseUrl = (import.meta.env.VITE_API_BASEURL || 'http://127.0.0.1:3007').replace(/\/$/, '')
const baseUrl = ref(`${apiBaseUrl}/file/uploadFile`)
const fileList = ref<UploadUserFile[]>([])
const tableData = ref<FileRow[]>([])
const tip = ref()

const paginationData = reactive({
  fileTotal: 0,
  filePageCount: 0,
  fileCurrentPage: 1,
})

const userInfo = localStorage.getItem('userinfo')
const userName = userInfo ? JSON.parse(userInfo)?.name ?? '' : ''

const loadFileLength = async () => {
  const res = await fileListLength()
  const total = typeof res?.length === 'number' ? res.length : 0
  paginationData.fileTotal = total
  paginationData.filePageCount = Math.max(1, Math.ceil(total / 10))
}

const getFileFirstPageList = async () => {
  paginationData.fileCurrentPage = 1
  tableData.value = (await returnFilesListData(1)) as FileRow[]
}

const fileCurrentChange = async (value: number) => {
  paginationData.fileCurrentPage = value
  tableData.value = (await returnFilesListData(value)) as FileRow[]
}

const changeClick = async (downloadNumber: number, id: number) => {
  await updateDownload(downloadNumber, id)
}

const deleteFile = (row: FileRow) => {
  tip.value.open(row)
}

const reloadFileList = async () => {
  await Promise.all([loadFileLength(), getFileFirstPageList()])
}

const handleExceed = () => {
  ElMessage.warning('最多只能同时上传 3 个文件')
}

const handleSuccess = async (response: any) => {
  if (response.status !== 0) {
    ElMessage.error('文件上传失败')
    return
  }

  if (userName) {
    await bindFileAndUser(userName, response.url)
  }

  ElMessage.success('文件上传成功')
  await reloadFileList()
}

onMounted(async () => {
  await reloadFileList()
})
</script>

<style lang="scss" scoped>
:deep(.el-table .cell) {
  font-weight: 400;
}

a {
  color: #fff;
  display: block;
  text-decoration: none;
}
</style>
