



<template>
  <div class="kkb-container">
    <ArticleItem v-for="article in articles" :article="article" :key="article._id"></ArticleItem>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import ArticleItem from '~/components/ArticleItem.vue'
export default {
  // async

  async asyncData({ app, params, store }) {
    // console.log(Object.keys(store))
    // console.log(Object.keys(app))
    let ret = await app.$axios.get('/api/article')
    console.log(ret.data.data)
    return {
      articles: ret.data.data
    }
    // return {user:ret.data}
  },
  components: {
    Logo,
    ArticleItem
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  /* min-height: 100vh; */
  /* text-align: center; */
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
