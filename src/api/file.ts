/**
 * 模块说明：
 * 1. 文件/合同模块接口封装。
 * 2. 负责文件列表、上传、删除、搜索等与合同管理页面有关的请求。
 * 3. 页面层只关心调用结果，不直接拼接后端路径。
 */

import type { AxiosProgressEvent } from 'axios'
import { post } from './request'

export const initMultipartUpload = (data: {
  fileName: string
  fileSize: number
  contentHash: string
  chunkSize: number
  chunkTotal: number
  mimeType: string
}) => {
  return post('/file/initMultipartUpload', data)
}

export const uploadChunk = (data: FormData, onUploadProgress?: (event: AxiosProgressEvent) => void) => {
  return post('/file/uploadChunk', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })
}

export const completeMultipartUpload = (uploadId: string, contentHash: string) => {
  return post('/file/completeMultipartUpload', { uploadId, contentHash })
}

export const abortMultipartUpload = (uploadId: string) => {
  return post('/file/abortMultipartUpload', { uploadId })
}

export const downloadFile = (id: number) => {
  return post('/file/downloadFile', { id })
}

export const fileList = () => {
  return post('/file/fileList')
}

export const fileListLength = () => {
  return post('/file/fileListLength')
}

export const returnFilesListData = (pager: number) => {
  return post('/file/returnFilesListData', { pager })
}

export const searchFile = (file_name: string) => {
  return post('/file/searchFile', { file_name })
}

export const deleteFile = (id: number) => {
  return post('/file/deleteFile', { id })
}
