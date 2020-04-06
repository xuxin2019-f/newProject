// 逻辑层面controller的父类，抽象一些公用方法

const Controller = require('egg').Controller;

class BaseController extends Controller {
    // @ 公用代码抽离

  message(message){
      this.ctx.body = {
          code:0,
          message
      }   
    }  
  success(data){
      this.ctx.body = {
          code:0,
          data
      }
  }
  error(message,code=-1){
      this.ctx.body = {
          code,
          message
      }
  }
}

module.exports = BaseController