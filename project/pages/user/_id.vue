<template>
  <div>
    <div class="header">
      <img class="avatar" :src="user.avatar" alt />
      <h3>{{user.nickname}}</h3>
      <el-button class="chat" @click.native.prevent="onChat">私聊</el-button>
    </div>
    <div class="kkb-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="'关注'+following.length" name="following">
          <div v-for="user in following" :key="user._id">
            <UserDisplay :user="user" />
          </div>
        </el-tab-pane>

        <el-tab-pane :label="'粉丝'+followers.length" name="followers">
          <div v-for="user in followers" :key="user._id">
            <UserDisplay :user="user" />
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'文章'+articles.length" name="articles">
          <ArticleItem
            v-for="article in articles"
            :article="article"
            one="one"
            :key="article._id"
            @parentMet="loadArticle"
          ></ArticleItem>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ArticleItem from '~/components/ArticleItem.vue'
import UserDisplay from '~/components/UserDisplay.vue'

export default {
  components: {
    ArticleItem,
    UserDisplay
  },
  data() {
    return {
      following: [],
      followers: [],
      articles: [],
      activeName: 'following',
      user: {}
    }
  },
  mounted() {
    let userid = this.$route.params.id
    this.userid = userid
    if (userid) {
      this.loadFollowing()
      this.loadUser()
      this.loadFollowers()
      this.loadArticle()
    }
  },
  methods: {
    async loadFollowers() {
      // 粉丝
      let ret = await this.$http.get('/user/' + this.userid + '/followers')
      if (ret.code == 0) {
        this.followers = ret.data
      }
    },
    async loadFollowing() {
      // 关注
      let ret = await this.$http.get('/user/' + this.userid + '/following')
      if (ret.code == 0) {
        this.following = ret.data
      }
    },
    async loadArticle() {
      // 文章
      let ret = await this.$http.get('/user/' + this.userid + '/articles')
      if (ret.code === 0) {
        this.articles = ret.data
        //console.log(ret)
      }
      //let ret = await this.$http.get('/user/'+this.userid+'/articles')
    },
    async loadUser() {
      let ret = await this.$http.get('/user/message/' + this.userid)
      if (ret.code === 0) {
        this.user = ret.data
      }
    },
    onChat() {
      this.$router.push({ path: '/chat/' + this.userid })
    },
    handleClick() {}
  }
}
</script>

<style lang='scss' scoped>
.header {
  width: 1200px;
  margin: 0 auto;
  height: 300px;
  margin-bottom: 20px;
  background-color: #ffffff;
  text-align: center;
  .avatar {
    width: 150px;
    height: 150px;
  }
  .chat {
    margin-top: 20px;
  }
}
</style>