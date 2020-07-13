'use strict'
const md5 = require('md5')
// const Controller = require('egg').Controller;
const BaseController = require('./base')

class UserController extends BaseController {
  async index() {
    const { ctx } = this
    ctx.body = '用户信息'
  }
  async email() {
    // 在controller里写业务逻辑，调用service里写的通用逻辑（发送邮箱）
    const { ctx } = this
    const email = ctx.query.email

    // 随机生成四位随机数作为验证码
    const code = Math.random().toString().slice(2, 6)
    console.log('邮件' + email + '验证码是' + code)
    const title = '来自许昕的验证码'
    // 返回的html片段
    const html = `
         <h1>许昕的小网页注册验证码</h1>
         <div>
           <a href="">${code}</a>
         </div>
        `
    // 调用service层
    const hasSend = await this.service.tools.sendEmail(email, title, html)
    // 将验证码code存放在session里，这样点击注册后就可以对比输入框内输入的验证码和发送邮件的验证码是否相同
    console.log('hasSend?', hasSend)
    if (hasSend) {
      ctx.session.emailcode = code
      this.message('发送成功')
    } else {
      this.error('发送失败')
    }
  }
  async captcha() {
    // 生成验证码，我们也需要service
    const { ctx } = this
    let captcha = await this.service.tools.captcha()
    // 作持久化保存
    ctx.session.captcha = captcha.text
    console.log('验证码' + captcha.text)
    ctx.response.type = 'image/svg+xml'
    ctx.body = captcha.data
  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email })
    return user
  }
  async login() {
    const { ctx, app } = this
    const { email, password } = ctx.request.body
    // 数据库查询
    let user = await ctx.model.User.findOne({
      email,
      // password: md5(password),
    })
    console.log('user', user)
    if (user) {
      // 如果查到数据库里的数据了，则生成token
      const { nickname } = user
      // 将来还可以从token里解析出nickname，email，id
      const token = app.jwt.sign(
        {
          nickname,
          email,
          id: user._id,
        },
        app.config.jwt.secret,
        {
          // 时限
          expiresIn: '1h',
        }
      )
      this.success({ token, email })
    } else {
      this.error('用户名或密码错误')
    }
  }
  // @测试
  async detail() {
    // 只有token怎么获取详情
    const { ctx } = this
    const user = await this.checkEmail(ctx.state.email)
    this.success(user)
  }
  async myself() {
    const { ctx } = this
    const user = await ctx.model.User.findOne({ email: ctx.params.email })
    console.log('用户信息?', user)
    this.success(user)
  }
  async create() {
    const { ctx } = this
    let { email, password, emailcode, captcha, nickname } = ctx.request.body

    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证码出错')
    }
    console.log(captcha, ctx.session.captcha)
    // 实现不区分大小写
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('图片验证码错误')
    }
    if (await this.checkEmail(email)) {
      return this.error('邮箱已经存在')
    }
    // 以上没有问题后，插入数据库
    let ret = await ctx.model.User.create({
      email,
      nickname,
      password: md5(password),
    })
    console.log('新建用户', ret)
    if (ret._id) {
      this.success('注册成功')
    }

    // 数据校验
  }
  demoinfo() {
    const { ctx } = this
    // this.success('测试数据12')
    // this.error('错误信息')
    // this.message('成功信息')
    ctx.body = {
      code: 0,
      data: '测试数据',
    }
  }
  async message() {
    const { ctx } = this
    //console.log('有没有state', ctx.state.userid)
    let ret = await ctx.model.User.findById(ctx.state.userid)
    console.log('ret', ret)
    this.success(ret)
  }
  async find() {
    // 根据详情页的id查找用户
    const { ctx } = this
    let ret = await ctx.model.User.findById(ctx.params.id)
    this.success(ret)
  }
  async isFollow() {
    const { ctx } = this
    // 从token中解析出id
    const me = await this.ctx.model.User.findById(ctx.state.userid)
    let isFollow = !!me.following.find((v) => v.toString() == ctx.params.id)
    console.log({ isFollow })
    this.success({
      isFollow,
    })
  }
  async follow() {
    const { ctx } = this
    // 这里ctx.state.userid是jwt解析出来的该网站登录的用户的id
    const me = await ctx.model.User.findById(ctx.state.userid)
    // ctx.params.id是该网站登录用户访问的文章的作者的id，检查该用户是否关注了此作者
    let isFollow = !!me.following.find((v) => v.toString() == ctx.params.id)
    if (!isFollow) {
      me.following.push(ctx.params.id)
      me.save()
      this.message('关注成功')
    }
  }
  async unfollow() {
    const { ctx } = this
    const me = await ctx.model.User.findById(ctx.state.userid)
    let index = me.following.map((id) => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
      this.message('取消成功')
    }
  }
  async following() {
    const { ctx } = this

    // const users = await ctx.model.User.find({ following: ctx.params.id });
    // 即查询当前用户的关注的那些人的用户信息
    const users = await ctx.model.User.findById(ctx.params.id).populate(
      'following'
    )
    console.log('关注的人', users)
    this.success(users.following)
  }
  async followers() {
    const { ctx } = this
    const users = await ctx.model.User.find({ follower: ctx.params.id })
    console.log('粉丝', users)
    this.success(users)
  }
  async articles() {
    const { ctx } = this
    //console.log(ctx.params.id)
    const title = []
    // 我好愚蠢 拿用户id查文章能查到个p
    // const article = await ctx.model.Article.find().then((data) => {
    //   data.forEach((element) => {
    //     console.log('id?', element._id)
    //     if (element._id.toString() === ctx.params.id) {
    //       title.push(element.title)
    //     }
    //   })
    // })

    //喜大普奔
    const article = await ctx.model.Article.find({ author: ctx.params.id })
    article.forEach((item) => {
      title.push(item.title)
    })

    //console.log('标题', title)
    //console.log('文章', article)
    this.success(title)
  }
  async articleStatus() {
    const { ctx } = this
    const me = await this.ctx.model.User.findById(ctx.state.userid)
    let like = !!me.likeArticle.find((id) => id.toString() == ctx.params.id)
    let dislike = !!me.dislikeArticle.find(
      (id) => id.toString() == ctx.params.id
    )
    this.success({
      like,
      dislike,
    })
  }

  async likeArticle() {
    const { ctx } = this

    const me = await ctx.model.User.findById(ctx.state.userid)
    if (!me.likeArticle.find((id) => id.toString() == ctx.params.id)) {
      me.likeArticle.push(ctx.params.id)
      console.log(me)

      me.save()
      await ctx.model.Article.findByIdAndUpdate(ctx.params.id, {
        $inc: { like: 1 },
      })
      return this.message('点赞成功')
    }
    this.message('已经赞过了')
    // likeArticle
  }

  async cancelLikeArticle() {
    const { ctx } = this
    const me = await ctx.model.User.findById(ctx.state.userid)
    const index = me.likeArticle
      .map((id) => id.toString())
      .indexOf(ctx.params.id)
    if (index > -1) {
      me.likeArticle.splice(index, 1)
      me.save()
      await ctx.model.Article.findByIdAndUpdate(ctx.params.id, {
        $inc: { like: -1 },
      })
      return this.message('取消成功')
    }
    this.message('已经取消了')
  }

  async dislikeArticle() {
    const { ctx } = this

    const me = await ctx.model.User.findById(ctx.state.userid)
    if (!me.dislikeArticle.find((id) => id.toString() == ctx.params.id)) {
      me.dislikeArticle.push(ctx.params.id)
      console.log(me)

      me.save()
      await ctx.model.Article.findByIdAndUpdate(ctx.params.id, {
        $inc: { dislike: 1 },
      })
      return this.message('成功踩')
    }
    // await next()
    this.message('已经踩过了')
    // likeArticle
  }

  async cancelDislikeArticle() {
    const { ctx } = this
    const me = await ctx.model.User.findById(ctx.state.userid)
    const index = me.dislikeArticle
      .map((id) => id.toString())
      .indexOf(ctx.params.id)
    if (index > -1) {
      me.dislikeArticle.splice(index, 1)
      me.save()
      await ctx.model.Article.findByIdAndUpdate(ctx.params.id, {
        $inc: { dislike: -1 },
      })
      return this.message('取消成功')
    }
    this.message('已经取消了')
  }
}

module.exports = UserController
