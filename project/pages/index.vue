<template>
  <div class="container">
    <h1>首页</h1>
    <nuxt-link to='/register'>注册</nuxt-link>
  </div>
</template>

<script>


export default {
  layout:'default',
  async mounted(){
    // 因为已经在plugins下的user.js中设置过baseURL为/api，所以这里不用再写api前缀
    let ret =  await this.$http.get('/demoinfo')
    console.log(ret.data)
  },
  components: {
  
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
