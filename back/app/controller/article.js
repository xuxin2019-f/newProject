'use strict';

const BaseController = require('./base');
const marked = require('marked')
class ArticleController extends BaseController {
  async index(){
    const {ctx} = this
    let articles = await ctx.model.Article.find().populate('author')
    this.success(articles)

  }
  async detail(){
    // 这里实现查询到详细的某一篇文章，还要实现每次访问这个方法，都加一次访问量view
    const {ctx} = this
    let {id} = ctx.params
    let article = await ctx.model.Article.findOneAndUpdate({_id:id},{$inc: {'views':1}}).populate('author')
    this.success(article)
  }
   async create(){
      const {ctx} = this
      const {userid} = ctx.state
      const {content} = ctx.request.body

      const title = content.split('\n').find(v=>{
        return v.indexOf('# ')==0
      })

      const obj = {
        title: title.replace('# ',''),
        article:content,  // 内部编辑的时候看的
        article_html:marked(content), // 给外部显示看的
        author:userid

      }
      let ret = await ctx.model.Article.create(obj)
      if(ret._id){
        this.success({
          id:ret.id,
          title:ret.title
        })
      }else{
        this.error('创建失败')
      }
  }
}

module.exports = ArticleController;