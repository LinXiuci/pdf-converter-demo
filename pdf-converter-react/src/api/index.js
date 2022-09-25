import { http } from './http'


// 文件上传
const uploadApi = async (formData) => http.post('/upload/single', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

const getFileApi = async (fileName) => http.get(`/upload/single?file=${fileName}`)

export {
  uploadApi,
  getFileApi
}