import { post } from './request'
import {
  getArrayField,
  getBooleanField,
  getObjectField,
  getStringField,
  result,
  toArray,
  toLengthData,
} from '@/http/response'

// 处理上传，把当前模块的关键逻辑集中在这里。
export const initMultipartUpload = (data) =>
  post('/file/initMultipartUpload', data).then((raw) =>
    result(raw, {
      uploadId: getStringField(raw, 'uploadId'),
      shouldUpload: getBooleanField(raw, 'shouldUpload'),
      uploadedChunks: getArrayField(raw, 'uploadedChunks'),
      fileRecord: getObjectField(raw, 'fileRecord'),
    }),
  )

// 处理当前文件操作，把文件保存到约定位置后再继续后续流程。
export const uploadChunk = (data, onUploadProgress) =>
  post('/file/uploadChunk', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  }).then((raw) =>
    result(raw, {
      uploadedChunks: getArrayField(raw, 'uploadedChunks'),
    }),
  )

// 处理上传，把当前模块的关键逻辑集中在这里。
export const completeMultipartUpload = (uploadId, contentHash) =>
  post('/file/completeMultipartUpload', { uploadId, contentHash }).then((raw) =>
    result(raw, {
      fileRecord: getObjectField(raw, 'fileRecord'),
    }),
  )

// 处理上传，把当前模块的关键逻辑集中在这里。
export const abortMultipartUpload = (uploadId) =>
  post('/file/abortMultipartUpload', { uploadId }).then((raw) => result(raw, null))

// 处理文件，把目标文件按预期方式返回给前端。
export const downloadFile = (id) =>
  post('/file/downloadFile', { id }).then((raw) =>
    result(raw, {
      url: getStringField(raw, 'url'),
    }),
  )

// 处理文件列表，把当前模块的关键逻辑集中在这里。
export const fileList = () =>
  post('/file/fileList').then((raw) => result(raw, toArray(raw)))

// 处理文件列表，把当前模块的关键逻辑集中在这里。
export const fileListLength = () =>
  post('/file/fileListLength').then((raw) => result(raw, toLengthData(raw)))

// 返回文件列表数据，让上层直接消费最终结果。
export const returnFilesListData = (pager) =>
  post('/file/returnFilesListData', { pager }).then((raw) => result(raw, toArray(raw)))

// 查询文件，按当前条件筛出目标结果。
export const searchFile = (file_name) =>
  post('/file/searchFile', { file_name }).then((raw) => result(raw, toArray(raw)))

// 删除文件，避免旧数据继续影响后续流程。
export const deleteFile = (id) =>
  post('/file/deleteFile', { id }).then((raw) => result(raw, null))
