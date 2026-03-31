/**
 * 模块说明：
 * 1. 文件/合同模块接口封装。
 * 2. 负责文件列表、上传、删除、搜索等与合同管理页面有关的请求。
 * 3. 页面层只关心调用结果，不直接拼接后端路径。
 */

import type { AxiosProgressEvent } from 'axios'
import { post } from './request'
import {
  getArrayField,
  getBooleanField,
  getObjectField,
  getStringField,
  toApiResult,
  toArray,
  toLengthData,
  type ApiResult,
} from '@/http/response'

export interface FileRow {
  id: number
  file_name: string
  file_size?: string | number
  upload_person?: string
  download_number?: number
  upload_time?: string
  file_url?: string
  object_id?: number
  content_hash?: string
  storage_path?: string
  status?: string
  [key: string]: unknown
}

export interface InitMultipartUploadData {
  uploadId: string
  shouldUpload: boolean
  uploadedChunks: number[]
  fileRecord?: FileRow | null
}

export interface DownloadFileData {
  url: string
}

export const initMultipartUpload = (data: {
  fileName: string
  fileSize: number
  contentHash: string
  chunkSize: number
  chunkTotal: number
  mimeType: string
}) => {
  return post<ApiResult<InitMultipartUploadData>>('/file/initMultipartUpload', data).then((raw) => {
    return toApiResult(raw, {
      uploadId: getStringField(raw, 'uploadId'),
      shouldUpload: getBooleanField(raw, 'shouldUpload'),
      uploadedChunks: getArrayField<number>(raw, 'uploadedChunks'),
      fileRecord: getObjectField<FileRow>(raw, 'fileRecord'),
    })
  })
}

export const uploadChunk = (data: FormData, onUploadProgress?: (event: AxiosProgressEvent) => void) => {
  return post<ApiResult<{ uploadedChunks: number[] }>>('/file/uploadChunk', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  }).then((raw) =>
    toApiResult(raw, {
      uploadedChunks: getArrayField<number>(raw, 'uploadedChunks'),
    }),
  )
}

export const completeMultipartUpload = (uploadId: string, contentHash: string) => {
  return post<ApiResult<{ fileRecord: FileRow | null }>>('/file/completeMultipartUpload', {
    uploadId,
    contentHash,
  }).then((raw) =>
    toApiResult(raw, {
      fileRecord: getObjectField<FileRow>(raw, 'fileRecord'),
    }),
  )
}

export const abortMultipartUpload = (uploadId: string) => {
  return post<ApiResult<null>>('/file/abortMultipartUpload', { uploadId }).then((raw) => {
    return toApiResult(raw, null)
  })
}

export const downloadFile = (id: number) => {
  return post<ApiResult<DownloadFileData>>('/file/downloadFile', { id }).then((raw) =>
    toApiResult(raw, {
      url: getStringField(raw, 'url'),
    }),
  )
}

export const fileList = () => {
  return post<ApiResult<FileRow[]>>('/file/fileList').then((raw) => {
    return toApiResult(raw, toArray<FileRow>(raw))
  })
}

export const fileListLength = () => {
  return post<ApiResult<{ length: number }>>('/file/fileListLength').then((raw) => {
    return toApiResult(raw, toLengthData(raw))
  })
}

export const returnFilesListData = (pager: number) => {
  return post<ApiResult<FileRow[]>>('/file/returnFilesListData', { pager }).then((raw) => {
    return toApiResult(raw, toArray<FileRow>(raw))
  })
}

export const searchFile = (file_name: string) => {
  return post<ApiResult<FileRow[]>>('/file/searchFile', { file_name }).then((raw) => {
    return toApiResult(raw, toArray<FileRow>(raw))
  })
}

export const deleteFile = (id: number) => {
  return post<ApiResult<null>>('/file/deleteFile', { id }).then((raw) => {
    return toApiResult(raw, null)
  })
}
