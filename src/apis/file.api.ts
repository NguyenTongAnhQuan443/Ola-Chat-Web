import { FileDownload } from 'src/types/file.type'
import http from 'src/utils/http'

export const URL_POST_FILE = 'ola-chat/files/upload'
export const URL_GET_FILE = 'ola-chat/files/download' // publicId=jivphkzd2ozngyia1ss2&savePath=D%3A%5CGame

const fileAPI = {
  upload(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return http.post<{ fileUrl: string }>(URL_POST_FILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  uploadMultiple(files: File[]) {
    const promises = files.map((file) => this.upload(file))
    return Promise.all(promises)
  },
  download(publicId: string, savePath: string) {
    return http.get<FileDownload>(URL_GET_FILE, {
      params: {
        publicId,
        savePath
      }
    })
  }
}

export default fileAPI
