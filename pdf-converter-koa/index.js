const fs     = require('fs')
const path   = require('path')
const Koa    = require('koa')
const cors   = require('koa-cors')
const serve  = require('koa-static')
const multer = require('koa-multer')
const Router = require('koa-router')
const toPdf  = require('office-to-pdf')

const app    = new Koa()
const router = new Router()
const PORT   = 8080
const URL    = `http://localhost:${PORT}/`


const UPLOAD_PATH = path.join(__dirname, '/public/upload')  // 存储上传文件的目录
const SCUESS_PATH = path.join(__dirname, '/public/pdf')     // 转换成pdf文件目录
const LOG_PATH    = path.join(__dirname, '/log')            // 日志

app.use(cors())
app.use(serve(UPLOAD_PATH))
app.use(serve(SCUESS_PATH))
app.use(router.routes()).use(router.allowedMethods())

/***
 * 配置文件
 *  */
const storage = multer.diskStorage({
  // 设置文件的存储目录
  destination: (request, file, cb) => {
    cb(null, UPLOAD_PATH)
  },
  // 在存储目录设置文件名
  filename: (request, file, cb) => {
    cb(null, file.originalname)
    handleChangePdf(file)    // 转换pdf
  },
})

//加载配置
const multerUpload = multer({ storage: storage })

/***
 * 转换pdf
 * 使用 setTimeout 解决文件没有同时读取问题
 *  */
let timer = null
function handleChangePdf (file) {
  return timer = setTimeout(() => {
    // 读文件
    fs.readFile(path.join(UPLOAD_PATH, file.originalname), (error, data) => {
      if (error) return console.error(error.message)
      console.log(file)
      console.log('loading ...')
      console.log('文件类型为', file.mimetype)
      console.log('解读文件内容成功:', data)
      toPdf(data).then((res) => {
        // 写文件
        handleWriteFile(file, res)
      }, (error) => {
        console.error(error.message)
      })
    })
  }, 1000)
}
clearTimeout(timer)

/***
 * 写文件
 *  */
function handleWriteFile (file, res) {
  // 去除文件后缀后的文件名
  let deleteSuffixAfterFileName = file.originalname.substring(0, file.originalname.lastIndexOf('.'))
  fs.writeFile(path.join(SCUESS_PATH, deleteSuffixAfterFileName + '.pdf'), res, (err) => {
    if (err) return console.error(err.message)
    console.log('文件内容写入成功！')
    console.log('转成 PDF 类型成功！')
  })
}


/***
 * 响应请求
 *  */
router.post('/upload/single', multerUpload.single('file'),
  async (ctx, next) => {
    try {
      let file = ctx.req.file.originalname.substring(0, ctx.req.file.originalname.lastIndexOf('.')) + '.pdf'
      await next()
      ctx.body = {
        code: 200,
        message: '上传成功',
        url: `${URL}${file}`,
      }
    } catch (error) {
      ctx.body = {
        code: 400,
        message: '上传失败:' + error.message,
      }
    }
  }
)



app.use(async (ctx) => {
  ctx.body = 'Hello World'
})


app.listen(PORT, () => {
  console.log('测试端口：http://localhost:8080/')
})
