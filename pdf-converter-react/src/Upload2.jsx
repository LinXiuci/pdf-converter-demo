import React, { useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { Card, message, Upload, notification } from 'antd'
import './style/antd.css'
const { Dragger } = Upload

// 获取转换格式后的url
let pdfUrl = ''



const props = {
  name: 'file',
  multiple: true,
  action: 'http://localhost:8080/upload/single',

  onChange(info) {
    const { status, response } = info.file
    if (status === 'done' && response.code === 200) {
      pdfUrl = response.url
      console.log(response)
      notification.open({
        placement: 'topLeft',
        duration: 4,
        message: 'Notification Title',
        description: <DescriptionRender response={response} />,
        onClick: () => {
          console.log('Notification Clicked!')
        },
      })
      return message.success(`${info.file.name}\t${response.message}。`)
    } else if (status === 'error') {
      message.error(`${info.file.name}\t${response}。`)
    }
  },

  /**
   * @txt: text/plain
   * @word:application/vnd.openxmlformats-officedocument.wordprocessingml.document
   * @word:application/msword
   * @excel:application/vnd.ms-excel
   * @excel:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
   * @imgae/png:image/png
   *  */
  beforeUpload(file) {
    const isFileType = [
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ].includes(file.type)
    if (!isFileType) {
      message.error('仅支持 txt、docx、doc、xlsx、xls 类型')
    }
    // const isFileSize10M = file.size / 1024 / 1024 < 10
    // if (!isFileSize10M) {
    //   message.error('文件大小不能超过10M！')
    // }
    return isFileType // && isFileSize10M
  },

  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files)
  },
}

const downloadPdf = () => {
  if (pdfUrl != '') {
    setTimeout(() => {
      let doc = document.createElement('a')
      doc.href = pdfUrl
      doc.target = 'blank'
      doc.click()
    }, 1500)
  } else {
    return message.error('请上传你的文件')
  }
}

const DescriptionRender = ({ response }) => {
  return (
    <>
      <h3>{response.code}</h3>
      <p className={response.code === 200 ? 'info-success' : 'info-error'}>
        {response.message}
      </p>
      {response.url ? (
        <a href={response.url} target="blank">
          {response.file}
        </a>
      ) : (
        ''
      )}
    </>
  )
}

/***
 * 文件上传
 *  */
function Upload2() {
  const [disabled, setDisabled] = useState(false)

  return (
    <section className="upload">
      <article>
        <Card hoverable>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">单击或拖动文件到此区域进行上载</p>
            <p className="ant-upload-hint">
              仅支持 .txt、.docx、.doc、.xlsx、.xls 类型
            </p>
          </Dragger>
        </Card>
      </article>
      <button className="preview" onClick={downloadPdf}>
        预览
      </button>
    </section>
  )
}

export default Upload2
