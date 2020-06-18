/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {
    io: {
      init: {},
      namespace: {
        '/': {
          connectionMiddleware: ['connection'], //做权限校验之类的工作
          //packetMiddleware: ['packet'], //服务端再发送给客户端之前对消息做预处理，或者对加密消息的解密等操作
          packetMiddleware: [],
        },
        '/another': {
          // 还可以做另外的配置，比如一对多
          connectionMiddleware: [],
          packetMiddleware: [],
        },
      },
    },
  })

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1586001903703_9240'

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: {
        enable: false,
      },
    },
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/project',
        options: {},
      },
    },
    jwt: {
      secret: '5ssdnwo',
    },
  }
}
