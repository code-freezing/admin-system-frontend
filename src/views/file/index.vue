<!--
  组件说明：
  1. 合同/文件管理页面。
  2. 负责文件列表、分片上传、秒传、断点续传和删除下载等交互。
  3. 上传链路改为前端自管，后端只负责会话、分片和最终文件落库。
-->
<template>
  <breadCrumb ref="breadcrumb" :item="item" />
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <div />
        <div class="upload-wrapped">
          <el-upload
            ref="uploadRef"
            class="upload-demo"
            multiple
            :limit="3"
            :show-file-list="false"
            :http-request="handleUploadRequest"
            :on-exceed="handleExceed"
          >
            <el-button type="primary">上传文件</el-button>
          </el-upload>
        </div>
      </div>
      <div v-if="uploadTasks.length" class="upload-task-list">
        <div v-for="task in uploadTasks" :key="task.uid" class="upload-task-item">
          <div class="task-head">
            <div class="task-name">{{ task.name }}</div>
            <div class="task-size">{{ formatByteSize(task.size) }}</div>
          </div>
          <div class="task-message">{{ task.message }}</div>
          <div class="task-footer">
            <el-progress
              :percentage="task.progress"
              :status="resolveProgressStatus(task.status)"
              :stroke-width="10"
            />
            <div class="task-actions">
              <el-button
                v-if="['hashing', 'uploading', 'merging'].includes(task.status)"
                link
                type="danger"
                @click="abortTask(task.uid)"
              >
                取消
              </el-button>
              <el-button
                v-else-if="['failed', 'aborted'].includes(task.status)"
                link
                type="primary"
                @click="retryTask(task.uid)"
              >
                重试
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column prop="file_name" label="文件名" min-width="240" />
          <el-table-column prop="file_size" label="文件大小" width="140">
            <template #default="{ row }">
              <div>{{ formatStoredSize(row.file_size) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="upload_person" label="上传人" width="120" />
          <el-table-column prop="download_number" label="下载次数" width="100" />
          <el-table-column prop="upload_time" label="上传时间" width="200">
            <template #default="{ row }">
              <div>{{ row.upload_time?.slice(0, 19).replace('T', ' ') }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <div>
                <el-button type="success" @click="handleDownload(row)">下载文件</el-button>
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
import SparkMD5 from 'spark-md5'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadInstance, UploadRawFile, UploadRequestOptions } from 'element-plus'
import breadCrumb from '@/components/bread_crumb.vue'
import tips from './components/tips.vue'
import {
  abortMultipartUpload,
  completeMultipartUpload,
  downloadFile,
  fileListLength,
  initMultipartUpload,
  returnFilesListData,
  uploadChunk,
  type FileRow,
} from '@/api/file'

type UploadTaskStatus =
  | 'hashing'
  | 'uploading'
  | 'merging'
  | 'success'
  | 'instant'
  | 'failed'
  | 'aborted'

interface UploadTask {
  uid: number
  name: string
  size: number
  progress: number
  status: UploadTaskStatus
  message: string
  rawFile: UploadRawFile
  uploadId: string
}

const CHUNK_SIZE = 2 * 1024 * 1024
const HASH_PROGRESS_MAX = 15
const UPLOAD_PROGRESS_START = 15
const UPLOAD_PROGRESS_END = 92

const breadcrumb = ref()
const uploadRef = ref<UploadInstance>()
const item = ref({
  first: '文件管理',
  second: '',
})

const tableData = ref<FileRow[]>([])
const uploadTasks = ref<UploadTask[]>([])
const tip = ref()
const uploadControllers = new Map<number, { cancelled: boolean; uploadId: string }>()

const paginationData = reactive({
  fileTotal: 0,
  filePageCount: 0,
  fileCurrentPage: 1,
})

const loadFileLength = async () => {
  const res = await fileListLength()
  const total = res.data.length
  paginationData.fileTotal = total
  paginationData.filePageCount = Math.max(1, Math.ceil(total / 10))
}

const getFileFirstPageList = async () => {
  paginationData.fileCurrentPage = 1
  tableData.value = (await returnFilesListData(1)).data
}

const fileCurrentChange = async (value: number) => {
  paginationData.fileCurrentPage = value
  tableData.value = (await returnFilesListData(value)).data
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

const formatByteSize = (size: number) => {
  if (!Number.isFinite(size) || size <= 0) {
    return '--'
  }

  if (size < 1024) {
    return `${size} B`
  }

  const kb = size / 1024
  if (kb < 1024) {
    return `${kb.toFixed(kb < 10 ? 2 : 1)} KB`
  }

  const mb = kb / 1024
  if (mb < 1024) {
    return `${mb.toFixed(mb < 10 ? 2 : 1)} MB`
  }

  return `${(mb / 1024).toFixed(2)} GB`
}

const formatStoredSize = (value?: string | number) => {
  const kb = Number(value || 0)
  if (!Number.isFinite(kb) || kb <= 0) {
    return '--'
  }

  if (kb < 1024) {
    return `${kb.toFixed(kb < 10 ? 2 : 1)} KB`
  }

  const mb = kb / 1024
  if (mb < 1024) {
    return `${mb.toFixed(mb < 10 ? 2 : 1)} MB`
  }

  return `${(mb / 1024).toFixed(2)} GB`
}

const resolveProgressStatus = (status: UploadTaskStatus) => {
  if (status === 'failed' || status === 'aborted') {
    return 'exception'
  }

  if (status === 'success' || status === 'instant') {
    return 'success'
  }

  return undefined
}

const getTask = (uid: number) => {
  return uploadTasks.value.find((item) => item.uid === uid)
}

const createOrUpdateTask = (rawFile: UploadRawFile) => {
  const existsTask = getTask(rawFile.uid)
  if (existsTask) {
    existsTask.name = rawFile.name
    existsTask.size = rawFile.size
    existsTask.rawFile = rawFile
    existsTask.progress = 0
    existsTask.status = 'hashing'
    existsTask.message = '正在计算文件指纹'
    existsTask.uploadId = ''
    return existsTask
  }

  const task: UploadTask = {
    uid: rawFile.uid,
    name: rawFile.name,
    size: rawFile.size,
    progress: 0,
    status: 'hashing',
    message: '正在计算文件指纹',
    rawFile,
    uploadId: '',
  }

  uploadTasks.value.unshift(task)
  return task
}

const resetController = (uid: number) => {
  uploadControllers.set(uid, {
    cancelled: false,
    uploadId: '',
  })
}

const isCancelled = (uid: number) => {
  return uploadControllers.get(uid)?.cancelled === true
}

const setUploadId = (uid: number, uploadId: string) => {
  const controller = uploadControllers.get(uid)
  if (controller) {
    controller.uploadId = uploadId
  }
}

const ensureNotCancelled = (uid: number) => {
  if (isCancelled(uid)) {
    throw new Error('UPLOAD_ABORTED')
  }
}

const calculateFileHash = (rawFile: UploadRawFile, task: UploadTask) => {
  return new Promise<string>((resolve, reject) => {
    const chunkTotal = Math.max(1, Math.ceil(rawFile.size / CHUNK_SIZE))
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    let currentChunk = 0

    const loadNextChunk = () => {
      if (isCancelled(task.uid)) {
        reject(new Error('UPLOAD_ABORTED'))
        return
      }

      const start = currentChunk * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, rawFile.size)
      reader.readAsArrayBuffer(rawFile.slice(start, end))
    }

    reader.onerror = () => {
      reject(new Error('文件指纹计算失败'))
    }

    reader.onload = (event) => {
      if (isCancelled(task.uid)) {
        reject(new Error('UPLOAD_ABORTED'))
        return
      }

      const chunk = event.target?.result
      if (!(chunk instanceof ArrayBuffer)) {
        reject(new Error('文件指纹计算失败'))
        return
      }

      spark.append(chunk)
      currentChunk += 1
      task.progress = Math.min(HASH_PROGRESS_MAX, Math.round((currentChunk / chunkTotal) * HASH_PROGRESS_MAX))
      task.message = `正在计算文件指纹 (${currentChunk}/${chunkTotal})`

      if (currentChunk < chunkTotal) {
        loadNextChunk()
        return
      }

      resolve(spark.end())
    }

    loadNextChunk()
  })
}

const updateUploadProgress = (task: UploadTask, finishedCount: number, chunkTotal: number, currentChunkRatio = 0) => {
  const ratio = Math.min(1, (finishedCount + currentChunkRatio) / Math.max(chunkTotal, 1))
  task.progress = Math.min(
    UPLOAD_PROGRESS_END,
    Math.round(UPLOAD_PROGRESS_START + ratio * (UPLOAD_PROGRESS_END - UPLOAD_PROGRESS_START)),
  )
}

const abortTask = async (uid: number) => {
  const controller = uploadControllers.get(uid)
  const task = getTask(uid)
  if (!task) {
    return
  }

  if (controller) {
    controller.cancelled = true
  }

  task.status = 'aborted'
  task.message = '上传已取消'

  if (controller?.uploadId) {
    try {
      await abortMultipartUpload(controller.uploadId)
    } catch {
      // 会话可能已经结束，保持前端任务状态即可。
    }
  }
}

const runUpload = async (rawFile: UploadRawFile) => {
  const task = createOrUpdateTask(rawFile)
  resetController(task.uid)

  try {
    const contentHash = await calculateFileHash(rawFile, task)
    ensureNotCancelled(task.uid)

    const chunkTotal = Math.max(1, Math.ceil(rawFile.size / CHUNK_SIZE))
    const initRes = await initMultipartUpload({
      fileName: rawFile.name,
      fileSize: rawFile.size,
      contentHash,
      chunkSize: CHUNK_SIZE,
      chunkTotal,
      mimeType: rawFile.type || 'application/octet-stream',
    })

    if (initRes.status !== 0) {
      throw new Error(initRes.message || '上传初始化失败')
    }

    if (!initRes.data.shouldUpload) {
      task.status = 'instant'
      task.progress = 100
      task.message = '秒传成功'
      await reloadFileList()
      return
    }

    task.uploadId = initRes.data.uploadId
    setUploadId(task.uid, initRes.data.uploadId)
    task.status = 'uploading'

    const uploadedChunkSet = new Set<number>((initRes.data.uploadedChunks || []).map((item: number) => Number(item)))
    updateUploadProgress(task, uploadedChunkSet.size, chunkTotal)
    if (uploadedChunkSet.size > 0) {
      task.message = `已恢复 ${uploadedChunkSet.size}/${chunkTotal} 个分片`
    } else {
      task.message = `正在上传分片 (0/${chunkTotal})`
    }

    for (let chunkIndex = 0; chunkIndex < chunkTotal; chunkIndex += 1) {
      if (uploadedChunkSet.has(chunkIndex)) {
        continue
      }

      ensureNotCancelled(task.uid)
      task.message = `正在上传分片 (${chunkIndex + 1}/${chunkTotal})`

      const start = chunkIndex * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, rawFile.size)
      const chunk = rawFile.slice(start, end)
      const formData = new FormData()
      formData.append('uploadId', task.uploadId)
      formData.append('chunkIndex', String(chunkIndex))
      formData.append('contentHash', contentHash)
      formData.append('chunk', chunk, `${rawFile.name}.part${chunkIndex}`)

      const uploadRes = await uploadChunk(formData, (event: any) => {
        const currentChunkRatio = event?.total ? event.loaded / event.total : 0
        updateUploadProgress(task, uploadedChunkSet.size, chunkTotal, currentChunkRatio)
      })

      if (uploadRes.status !== 0) {
        throw new Error(uploadRes.message || '分片上传失败')
      }

      uploadedChunkSet.add(chunkIndex)
      updateUploadProgress(task, uploadedChunkSet.size, chunkTotal)
    }

    ensureNotCancelled(task.uid)
    task.status = 'merging'
    task.progress = 95
    task.message = '正在合并文件'

    const completeRes = await completeMultipartUpload(task.uploadId, contentHash)
    if (completeRes.status !== 0) {
      throw new Error(completeRes.message || '文件合并失败')
    }

    task.status = 'success'
    task.progress = 100
    task.message = '上传成功'
    await reloadFileList()
  } catch (error: any) {
    if (error?.message === 'UPLOAD_ABORTED') {
      task.status = 'aborted'
      task.progress = 0
      task.message = '上传已取消'
      return
    }

    task.status = 'failed'
    task.message = error?.message || '上传失败'
    ElMessage.error(task.message)
  }
}

const retryTask = async (uid: number) => {
  const task = getTask(uid)
  if (!task) {
    return
  }

  await runUpload(task.rawFile)
}

const handleUploadRequest = (options: UploadRequestOptions) => {
  const rawFile = options.file as UploadRawFile
  void runUpload(rawFile)

  // el-upload 内部会缓存已选文件。这里立即清空内部列表，避免隐藏文件列表时 limit 永久占满。
  window.setTimeout(() => {
    uploadRef.value?.clearFiles()
  }, 0)

  return {
    abort: () => {
      void abortTask(rawFile.uid)
    },
  }
}

const handleDownload = async (row: FileRow) => {
  const res = await downloadFile(row.id)
  if (res.status !== 0 || !res.data.url) {
    ElMessage.error(res.message || '文件下载失败')
    return
  }

  window.open(res.data.url, '_blank')
  await fileCurrentChange(paginationData.fileCurrentPage)
}

onMounted(async () => {
  await reloadFileList()
})
</script>

<style lang="scss" scoped>
:deep(.el-table .cell) {
  font-weight: 400;
}

.upload-task-list {
  margin: 12px 20px 0;
  padding: 16px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #ebeef5;
  display: grid;
  gap: 12px;
}

.upload-task-item {
  padding: 12px;
  border-radius: 6px;
  background: #f8fafc;
}

.task-head,
.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.task-name {
  font-weight: 600;
  color: #1f2937;
  word-break: break-all;
}

.task-size,
.task-message {
  color: #6b7280;
  font-size: 13px;
}

.task-message {
  margin: 8px 0;
}

.task-footer {
  align-items: flex-start;
}

.task-footer :deep(.el-progress) {
  flex: 1;
}
</style>
