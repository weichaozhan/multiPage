module.exports = function (router, koaBody) {
  router.post('/api/test', koaBody(), async (ctx, next) => {
    const Mock = require('mockjs')
    const data = Mock.mock({
      "code": 1000000,
      "msg": "成功",
      "data|5": [
        {
          "id": /[a-zA-z0-9]{4}-[a-zA-z0-9]{4}-[a-zA-z0-9]{4}/,
          "userId": /[a-zA-z0-9]{4}-[a-zA-z0-9]{4}-[a-zA-z0-9]{4}/,
          "a|+1": [100, 200, 300, 400, 500, 600, 700],
        }
      ]
    })
    ctx.body = data
    await next()
  })
}