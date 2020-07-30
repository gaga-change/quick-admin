const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const fs = require('fs')

const app = new Koa()
const router = new Router()
const PORT = 9191
const DATA_FILE_PATH = './data.json'

const getData = () => {
  const temp = fs.readFileSync(DATA_FILE_PATH).toString()
  return JSON.parse(temp)
}

const saveData = (data) => {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data))
}

router.get('/config', ctx => {
  ctx.body = getData()
})

router.post('/config', ctx => {
  saveData(ctx.request.body)
  ctx.body = null
})

app.use(bodyParser({ jsonLimit: '10kb' , enableTypes: ['json', 'form', 'xml']}))
app.use(router.routes())

app.listen(PORT, () => {
  console.log(`listen: http://localhost:${PORT}`)
})
