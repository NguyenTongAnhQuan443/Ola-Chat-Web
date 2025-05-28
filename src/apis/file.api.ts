import { FileDownload } from 'src/types/file.type'
import http from 'src/utils/http'

export const URL_POST_FILE = 'ola-chat/files/upload'
export const URL_GET_FILE = 'ola-chat/files/download'

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
  download(params: { publicId: string; savePath: string }) {
    return http.post<FileDownload>(`${URL_GET_FILE}?publicId=${params.publicId}&savePath=${params.savePath}`)
  }
}

export default fileAPI
