module.exports = (app) => {
  return async (ctx, next) => {
    // 权限校验通过
    ctx.socket.emit('connect', 'connected!')
    // 放行
    await next()
    // execute when disconnect.
    console.log('disconnection!')
  }
}
