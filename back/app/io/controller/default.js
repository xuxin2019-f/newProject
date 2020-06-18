const Controller = require('egg').Controller

class DefaultController extends Controller {
  async server() {
    const { ctx, app } = this
    const nsp = app.io.of('/')
    const message = ctx.args[0] || {}
    console.log(message)
    const socket = ctx.socket
    const client = socket.id
    // 通过id给指定socket连接发送消息，不然会以n次倍发送
    await nsp.sockets[client].emit('inline', {
      content: message,
      id: client,
    })
  }
}
module.exports = DefaultController
