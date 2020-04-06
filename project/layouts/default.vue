<template>

    <el-container>
      <!-- <div>
        {{userinfo}}
      </div> -->
      <el-header>
        <el-menu class="el-menu-demo" mode="horizontal">
          <el-menu-item index="0">
            <img class="logo" src="/logo.png" alt="">
          </el-menu-item>

        <el-menu-item index="1">
          <nuxt-link to="/">首页</nuxt-link>
        </el-menu-item>

       <!-- 这里也是，通过计算属性拿到vuex中的数据来选择是否渲染dom -->
        <el-menu-item v-if="userinfo.token" index="3" class="pull-right">
          <nuxt-link to="/user">退出</nuxt-link>
        </el-menu-item>
        <el-menu-item v-if="userinfo.token" index="4" class="pull-right">
          <nuxt-link to="/user">{{userinfo.nickname}}</nuxt-link>
        </el-menu-item>

        <el-menu-item v-if="userinfo.token" index="5" class="pull-right">
          <nuxt-link to="/editor/new">
            <el-button type='primary'>写文章</el-button>
          </nuxt-link>
        </el-menu-item>

        <el-menu-item v-if="!userinfo.token" index="2" class="pull-right">
          <nuxt-link to="/register">注册</nuxt-link>
        </el-menu-item>

          <el-menu-item v-if="!userinfo.token" index="3" class="pull-right">
          <nuxt-link to="/login">登录</nuxt-link>
        </el-menu-item>
        </el-menu>
      </el-header>

      <el-main>

        <nuxt />
      </el-main>
      <el-footer>
        底部信息
      </el-footer>
    </el-container>

    

</template>
<script>
export default {
  mounted(){
    this.getUserInfo()
  },
  computed:{
    userinfo(){
      return this.$store.state.user
    }
  },
  methods:{
    getUserInfo(){
      // 获取用户个人信息，如果有登录状态
      let token = localStorage.getItem('KKB_USER_TOKEN')
      if(token){
            // let ret = await this.$axios.get('/api/demoinfo')
        this.$store.dispatch('user/detail')
      }
    }
  }
}
</script>
<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
.pull-right{
  float:right !important;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
.logo{
  height:37px;
}
a{
  text-decoration: none;
}
</style>
