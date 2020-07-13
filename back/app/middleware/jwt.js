// async function gzip(ctx, next) {
//   await next();

// }

module.exports = ({ app }) => {
  return async function verify(ctx, next) {
    console.log('jwt中间件')

    console.log(ctx.request)
    const token = ctx.request.header.authorization.replace('Bearer ', '')
    try {
      let ret = await app.jwt.verify(token, app.config.jwt.secret)
      ctx.state.email = ret.email
      ctx.state.userid = ret.id
      await next()
    } catch (err) {
      console.log([err])
      if (err.name == 'TokenExpiredError') {
        ctx.state.email = ''
        return (ctx.body = {
          code: -666,
          message: '登录过期',
        })
      }
      console.log('错误', 'token过期')
    }
  }
}
