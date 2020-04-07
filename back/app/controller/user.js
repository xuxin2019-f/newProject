'use strict';
let md5 = require('md5')
// const Controller = require('egg').Controller;
const BaseController = require('./base');

class UserController extends BaseController {
   
    async index() {
        const {ctx} = this;
        ctx.body = '用户信息'
    }
    async email(){
        // 在controller里写业务逻辑，调用service里写的通用逻辑（发送邮箱）
        const {ctx} = this;
        const email = ctx.query.email
        // 随机生成四位随机数作为验证码
        const code = Math.random().toString().slice(2,6)
        console.log('邮件'+email+'验证码是'+code)
        const title = '来自许昕的验证码'
        // 返回的html片段
        const html = `
         <h1>许昕的小网页注册验证码</h1>
         <div>
           <a href="https://kaikeba.com/">${code}</a>
         </div>
        `
        // 调用service层
        const hasSend = await this.service.tools.sendEmail(email,title,html)
        // 将验证码code存放在session里，这样点击注册后就可以对比输入框内输入的验证码和发送邮件的验证码是否相同
        if(hasSend){
          ctx.session.emailcode = code
           this.message('发送成功')
         }else{
           this.error('发送失败')
         }
    }
    async captcha(){
      // 生成验证码，我们也需要service
      const {ctx} = this
      let captcha = await this.service.tools.captcha()
      // 作持久化保存
      ctx.session.captcha = captcha.text
      console.log('验证码'+captcha.text)
      ctx.response.type = 'image/svg+xml'
      ctx.body = captcha.data
    }
  async checkEmail(email){
    const user = await this.ctx.model.User.findOne({email})
    return user
  }
  async login(){
    const {ctx,app} = this
    const {email,password} = ctx.request.body
    // 数据库查询
    let user = await ctx.model.User.findOne({
      email,
      password:md5(password)
    })
    if(user){
      // 如果查到数据库里的数据了，则生成token
      const {nickname} = user
      // 将来还可以从token里解析出nickname，email，id
      const token = app.jwt.sign({
        nickname,
        email,
        id:user._id
      },app.config.jwt.secret,{
        // 时限
        expiresIn:'1h'
      })
      this.success({token,email})
    }else{
      this.error('用户名或密码错误')
    }
   }
   // @测试
  async detail(){
    // 只有token怎么获取详情
    const {ctx} = this
    const user = await this.checkEmail(ctx.state.email)
    this.success(user)
  }

  async create(){
    const {ctx} = this
    let { email, password,emailcode, captcha, nickname} = ctx.request.body

    if(emailcode!==ctx.session.emailcode){
      return this.error('邮箱验证码出错')
    }
    console.log(captcha, ctx.session.captcha)
    // 实现不区分大小写
    if(captcha.toUpperCase()!==ctx.session.captcha.toUpperCase()){
      return this.error('图片验证码错误')
    }
    if(await this.checkEmail(email)){
      return this.error('邮箱已经存在')
    }
    // 以上没有问题后，插入数据库
    let ret = await ctx.model.User.create({ 
      email, 
      nickname,
      password:md5(password)
    })
    if(ret._id){
      this.success('注册成功')
    }

    // 数据校验
  }
    demoinfo(){
        const {ctx} = this;
        // this.success('测试数据12')
        // this.error('错误信息')
        // this.message('成功信息')
        ctx.body = {
            code:0,
            data:'测试数据'
        }
    }
    
}

module.exports = UserController;