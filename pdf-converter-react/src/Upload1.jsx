import { useEffect, useState } from 'react'
import { uploadApi } from './api'
import './style/App.css'

function Upload1() {
  let uploadFileEle = ''
  useEffect(() => {
    uploadFileEle = document.querySelector('#uploadFile')
  }, [])

  // 单文件上传
  const uploadFile = async () => {
    try {
      if (!uploadFileEle.files.length) return
      let formData = new FormData()
      formData.append('file', uploadFileEle.files[0])

      let { data } = await uploadApi(formData)
      console.log(data)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div>
      {/* accept="image/*" */}
      <input id="uploadFile" type="file"  />
      <button id="submit" onClick={uploadFile}>
        上传文件
      </button>
    </div>
  )
}

export default Upload1
