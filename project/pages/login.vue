<template>
  <div class="login-container">
    <!-- rule -->
    <el-form ref="form" :model="form" :rules="rules" class="login-form">
      <!-- <div class="title-container">
        <img src="/logo.png" alt />
      </div>-->
      <el-form-item prop="email">
        <span class="svg-container">
          <i class="el-icon-mobile"></i>
        </span>
        <el-input ref="email" v-model="form.email" placeholder="邮箱" name="email"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <i class="el-icon-lock"></i>
        </span>
        <el-input
          ref="password"
          v-model="form.password"
          placeholder="输入密码"
          name="password"
          type="password"
        ></el-input>
      </el-form-item>
      <el-button
        @click.native.prevent="handleLogin"
        type="primary"
        sytle="width:100%;margin-bottom:30px"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
import md5 from 'md5'
export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      rules: {
        email: [{ required: true, message: '请输入邮箱' }],
        password: [{ required: true, message: '请输入密码' }]
      }
    }
  },
  methods: {
    handleLogin() {
      // 走vuex 走axios拦截器
      this.$refs.form.validate(async (valid) => {
        console.log('valid' + valid)
        if (valid) {
          // 设置loading
          let obj = {
            email: this.form.email,
            password: md5(this.form.password)
          }
          let ret = await this.$store.dispatch('user/login', obj)
          console.log(ret)
          if (ret.code === 0) {
            this.$notify({
              title: '登录成功',
              type: 'success'
            })
            // 生成token
            localStorage.setItem('KKB_USER_TOKEN', ret.data.token)
            setTimeout(() => {
              this.$router.push({ path: '/' })
            }, 1500)
          }
        }
      })
    }
  }
}
</script>

<style scoped>
</style>