import http from 'src/utils/http'

export const URL_POST_FILE = 'ola-chat/files/upload'

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
    const promises = files.map(file => this.upload(file))
    return Promise.all(promises)
  }
}

export default fileAPI
