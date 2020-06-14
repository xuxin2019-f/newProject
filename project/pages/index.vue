



<template>
  <div class="main-container">
    <div class="kkb-container">
      <div class="article">
        <ArticleItem v-for="article in articles" :article="article" :key="article._id"></ArticleItem>
      </div>
    </div>
    <About :userInfo="userInfo" class="myself" v-if="userInfo._id"></About>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import ArticleItem from '~/components/ArticleItem.vue'
import About from '~/components/About.vue'
export default {
  data() {
    return {
      userInfo: {},
      state: false
    }
  },

  async asyncData({ app, params, store }) {
    // console.log(Object.keys(store))
    // console.log(Object.keys(app))
    let ret = await app.$axios.get('/api/article')
    console.log('文章总体内容', ret.data.data)
    return {
      articles: ret.data.data
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      let ret = await this.$http.get('/user/message')

      if (ret.code === 0) {
        this.userInfo = ret.data
        console.log('userInfo', this.userInfo)
      }
    }
  },
  components: {
    Logo,
    ArticleItem,
    About
  }
}
</script>

<style lang="scss" scoped >
.main-container {
  display: flex;
  .kkb-container {
    margin-left: 150px;
    margin-right: 100px;
    width: 50%;
    .myself {
      width: 30%;
      padding: 30px;
    }
  }
}
</style>
