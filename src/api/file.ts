/**
 * 模块说明：
 * 1. 文件/合同模块接口封装。
 * 2. 负责文件列表、上传、删除、搜索等与合同管理页面有关的请求。
 * 3. 页面层只关心调用结果，不直接拼接后端路径。
 */

import { post } from './request'

export const bindFileAndUser = (name: string, url: string) => {
  return post('/file/bindFileAndUser', { name, url })
}

export const updateDownload = (download_number: number, id: number) => {
  return post('/file/updateDownload', { download_number, id })
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

export const deleteFile = (id: number, file_name: string) => {
  return post('/file/deleteFile', { id, file_name })
}
