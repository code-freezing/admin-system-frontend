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
