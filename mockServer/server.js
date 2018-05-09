const Koa = require('koa')
// 使用router
const Router = require('koa-router')
const Boom = require('boom')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')
const app = new Koa()
const router = new Router()

app.use(router.routes())
app.use(router.allowedMethods({
  throw: true,
  notImplemented: () => new Boom.notImplemented(),
  methodNotAllowed: () => new Boom.methodNotAllowed()
}))
// 使用bodyparser 解析get,post的参数
app.use(bodyParser())

// 模拟数据返回

router.post('/api/test', koaBody(), async (ctx, next) => {
  const Mock = require('mockjs')
  const data = Mock.mock({
    "code": 1000000,
    "msg": "成功",
    "data|5": [
      {
        "id": /[a-zA-z0-9]{4}-[a-zA-z0-9]{4}-[a-zA-z0-9]{4}/,
        "userId": /[a-zA-z0-9]{4}-[a-zA-z0-9]{4}-[a-zA-z0-9]{4}/,
        "a|+1": [100,200,300,400,500,600,700],
      }
    ]
  })
  ctx.body = data
  await next()
})


// log error
app.on('error', (err, ctx) => {
  console.log('server error', err, ctx)
})

app.listen(9090, () => {
  console.log('mock server listening on port 9090')
})