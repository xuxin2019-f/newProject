'use strict'

const BaseController = require('./base')
const marked = require('marked')

class ArticleController extends BaseController {
  async index() {
    const { ctx } = this
    let articles = await ctx.model.Article.find()
      .sort({ views: -1 })
      .populate('author')
    // let sort = await ctx.model.Article.find()
    //   .sort({ views: -1 })
    //   .then((data) => {
    //     console.log('排序', data)
    //   })
    //console.log('作者？', articles)
    this.success(articles)
  }
  // 个人中心页本人的所有文章
  async fineByAuthor() {
    const { ctx } = this
    // 某个作者的所有文章
    let Onearticles = []
    let articles = await ctx.model.Article.find().populate('author')
    articles.forEach((element) => {
      if (element.author._id.toString() === ctx.params.id) {
        Onearticles.push(element)
      }
    })
    this.success(Onearticles)
  }
  async detail() {
    // 这里实现查询到详细的某一篇文章，还要实现每次访问这个方法，都加一次访问量view
    const { ctx } = this
    let { id } = ctx.params
    let article = await ctx.model.Article.findOneAndUpdate(
      { _id: id },
      { $inc: { views: 1 } }
    ).populate('author')
    this.success(article)
  }
  async create() {
    const { ctx } = this
    const { userid } = ctx.state
    const { content } = ctx.request.body

    const title = content.split('\n').find((v) => {
      return v.indexOf('# ') == 0
    })

    const obj = {
      title: title.replace('# ', ''),
      article: content, // 内部编辑的时候看的
      article_html: marked(content), // 给外部显示看的
      author: userid,
    }
    let ret = await ctx.model.Article.create(obj)

    if (ret._id) {
      let me = await ctx.model.User.findById(ctx.state.userid)
      // 实现文章和用户的关联
      me.article.push(ret._id)
      me.save()
      console.log('me', me)
      this.success({
        id: ret._id,
        title: ret.title,
      })
    } else {
      this.error('创建失败')
    }
  }

  async delete() {
    const { ctx } = this
    const ret = await ctx.model.Article.findById(ctx.params.id).populate(
      'author'
    )
    console.log('ret', ret)
    console.log('！', typeof ctx.params.id)
    if (ret._id) {
      //const me = await ctx.model.User.findById(ret.author._id)
      const me = await ctx.model.User.update(
        { _id: ret.author._id },
        { $pull: { article: ret._id } }
      )
      console.log('me', me)
      if (me.ok) {
        const del = await ctx.model.Article.deleteOne({ _id: ctx.params.id })
        if (del.deletedCount) {
          this.success('删除成功')
        } else {
          this.error('删除失败')
        }
      }
    }
  }
}

module.exports = ArticleController
