const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const koaBody = require('koa-body')
const serve = require('koa-static')
const mount = require('koa-mount')

const aconnect = require('./lib/aconnect.js')

const app = new Koa()
const router = new Router()

const assets = new Koa()
assets.use(serve(`${__dirname}/client/dist`))
app.use(mount('/app', assets))
app.use(cors({ origin: '*' }))

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500
    ctx.body = {
      message: err.message
    }
  }
})

router.get('/status', async (ctx, next) => {
  ctx.response.status = 200
  ctx.type('text/html')
  ctx.body = `Hi there! Here some resources:<br>
              <a href="/midi-devices">json</a>
              <a href="/">app</a>
              `
  next()
})

router.get('/midi-devices', async (ctx, next) => {
  const devices = await aconnect.getMidiDevices()
  // const devices = expected
  ctx.response.status = 200
  ctx.body = devices
  next()
})

router.post('/connect', koaBody(), async (ctx, next) => {
  const { sourceId, targetId } = ctx.request.body
  await aconnect.connectDevices({ sourceId, targetId })
  ctx.response.status = 201
  next()
})

router.delete('/disconnect-all', async (ctx, next) => {
  await aconnect.disconnectAllDevices()
  ctx.response.status = 204
  next()
})

app.use(router.routes())

const port = process.env.PORT || 80
const hostname = process.env.APP_HOSTNAME || null
const server = app.listen(port, hostname, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`midi-connector Listening on ${host}:${port}`)
})

module.exports = server
