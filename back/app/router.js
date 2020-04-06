'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  let jwt = app.middleware.jwt({app})
  router.get('/', controller.home.index);
  router.get('/userinfo',controller.user.index)



  router.get('/demoinfo', controller.user.demoinfo)

  router.get('/user/sendcode' ,controller.user.email)
  router.get('/user/captcha' ,controller.user.captcha)
  router.post('/user/register' ,controller.user.create)
  router.post('/user/login' ,controller.user.login)

  // 中间件
  router.get('/user/detail',jwt, controller.user.detail)


  router.post('/article/create',jwt, controller.article.create)



};
