'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app

  let jwt = app.middleware.jwt({ app })
  router.get('/', controller.home.index)
  router.get('/userinfo', controller.user.index)

  router.get('/demoinfo', controller.user.demoinfo)

  router.get('/user/sendcode', controller.user.email)
  router.get('/user/captcha', controller.user.captcha)
  router.post('/user/register', controller.user.create)
  router.post('/user/login', controller.user.login)
  // 修改数据用put，删除用delete
  router.get('/user/isfollow/:id', jwt, controller.user.isFollow)
  router.put('/user/follow/:id', jwt, controller.user.follow)
  router.delete('/user/follow/:id', jwt, controller.user.unfollow)
  router.get('/user/article/:id', jwt, controller.user.articleStatus)
  router.put('/user/likeArticle/:id', jwt, controller.user.likeArticle)
  router.delete('/user/likeArticle/:id', jwt, controller.user.cancelLikeArticle)
  router.put('/user/dislikeArticle/:id', jwt, controller.user.dislikeArticle)
  router.delete(
    '/user/dislikeArticle/:id',
    jwt,
    controller.user.cancelDislikeArticle
  )
  router.get('/user/:id/following', controller.user.following)
  router.get('/user/:id/followers', controller.user.followers)
  router.get('/user/:id/articles', controller.user.articles)

  // 中间件
  router.get('/user/detail', jwt, controller.user.detail)

  router.post('/article/create', jwt, controller.article.create)
  router.get('/article', controller.article.index)
  router.get('/article/:id', controller.article.detail)
}
