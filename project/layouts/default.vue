<template>
  <el-container v-if="isRouterAlive">
    <!-- <div>
        {{userinfo}}
    </div>-->
    <el-header>
      <el-menu class="el-menu-demo" mode="horizontal" default-active="1">
        <!-- <el-menu-item index="0">
          <img class="logo" src="/logo.png" alt />
        </el-menu-item>-->

        <!-- <el-menu-item index="0">
    <img class="logo" src="/logo.png" alt="">
        </el-menu-item>-->
        <el-menu-item index="1">
          <nuxt-link to="/">首页</nuxt-link>
        </el-menu-item>

        <el-menu-item @click="logout" v-if="userinfo.token" index="3" class="pull-right">
          <span>退出</span>
        </el-menu-item>
        <el-menu-item class="pull-right" v-if="userinfo.token">
          <UserDisplay :user="userinfo" index="6"></UserDisplay>
        </el-menu-item>
        <el-menu-item v-if="userinfo.token" index="5" class="pull-right">
          <nuxt-link to="/editor/new">
            <el-button>写文章</el-button>
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
    <el-footer>底部信息</el-footer>
  </el-container>
</template>
<script>
import UserDisplay from '~/components/UserDisplay.vue'
export default {
  data() {
    return {
      isRouterAlive: true,
      key: this.$route.path + Math.random()
    }
  },
  components: { UserDisplay },
  provide() {
    return { reload: this.reload }
  },
  mounted() {},
  computed: {
    userinfo() {
      return this.$store.state.user
    }
  },
  methods: {
    async getUserInfo() {
      // 获取用户个人信息，如果有登录状态
      let token = localStorage.getItem('KKB_USER_TOKEN')
      if (token) {
        // let ret = await this.$axios.get('/api/demoinfo')
        // 触发刷新
        this.$store.dispatch('user/detail')
        //this.userinfo = this.$store.state.user
      }
    },
    logout() {
      localStorage.removeItem('KKB_USER_TOKEN')
      this.$store.commit('user/LOGOUT')
      this.$router.push({ path: '/' })
    },
    reload() {
      // this.isRouterAlive = false //先关闭，
      // this.$nextTick(function() {
      //   this.isRouterAlive = true //再打开
      // })
      location.reload()
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
  background: #eee;
}
.el-divider--horizontal {
  height: 2px;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
a {
  text-decoration: none;
}
.logo {
  height: 70%;
}
.kkb-container {
  width: 1200px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
}
.pull-right {
  float: right !important;
}

.k-container {
  width: 1200px;
  margin: 0 auto;
}
i.rotate180 {
  transform: rotate(180deg);
}

.ml20 {
  margin-left: 20px;
}
.el-icon-thumb {
  letter-spacing: 5px;
}
</style>
