<template>
  <div class="kkb-container">
    <UserDisplay :user="article.author">
      <el-button type="success" v-if="isFollow" @click="unfollow">已关注</el-button>
      <el-button v-else @click="follow">关注</el-button>
    </UserDisplay>

    <!--分隔线  -->
    <el-divider></el-divider>
    <!-- 显示文章 -->
    <div class="article" v-html="article.article_html"></div>
    <el-divider></el-divider>

    <div>
      <el-button @click="likeAction" :type="likeStatus?'success':'info'">
        <i class="el-icon-thumb">{{article.like}}</i>
      </el-button>

      <el-button @click="dislikeAction" :type="dislikeStatus?'success':'info'">
        <!-- 旋转180度 -->
        <i class="el-icon-thumb rotate180"></i>
        {{article.dislike}}
      </el-button>
    </div>
  </div>
</template>

<script>
import UserDisplay from '~/components/UserDisplay.vue'
export default {
  components: { UserDisplay },
  data() {
    return {
      // 默认没关注
      isFollow: false,
      likeStatus: false,
      dislikeStatus: false,
      article: {
        title: '',
        views: 0,
        like: 0,
        dislike: 0,
        author: {}
      }
    }
  },
  async mounted() {
    // 这个id是当前文章的id
    let { id } = this.$route.params
    this.id = id //不在data里声明的原因是这个id不需要做成响应式的，优化
    if (id) {
      this.getArticle()
    }
  },
  methods: {
    async getArticle() {
      let ret = await this.$http.get('/article/' + this.id)
      this.article = ret.data
    },
    async likeAction() {
      let type = this.likeStatus ? 'delete' : 'put'
      let ret = await this.$http[type]('/user/likeArticle/' + this.id)
      if (ret.code == 0) {
        this.getLikeStatus()
        this.getArticle()
        this.$notify({
          title: ret.message,
          type: 'success'
        })
      }
    },
    async getLikeStatus() {
      // 获取喜欢状态
      let ret = await this.$http.get('/user/article/' + this.id)
      if (ret.code == 0) {
        this.likeStatus = ret.data.like
        this.dislikeStatus = ret.data.dislike
      }
      console.log(ret)
    },

    async dislikeAction() {
      let type = this.dislikeStatus ? 'delete' : 'put'
      let ret = await this.$http[type]('/user/dislikeArticle/' + this.id)
      if (ret.code == 0) {
        this.getArticle()
        this.getLikeStatus()
        this.$notify({
          title: ret.message,
          type: 'success'
        })
      }
    },
    async checkFollowStatus() {
      //获取关注状态
      let isFollow = await this.$http.get(
        'user/isfollow/' + this.article.author._id
      )
      if (isFollow.code === 0) {
        this.isFollow = isFollow.data.isFollow
      }
    },
    async follow() {
      // 点击关注后，该用户的关注的人新增1，传递的参数是当前访问文章的作者id
      let ret = await this.$http.put('/user/follow/' + this.article.author._id)
      this.checkFollowStatus()
    },
    async unfollow() {
      // 点击已关注后，该用户的关注的人减少1，传递的参数是当前访问文章的作者id
      let ret = await this.$http.delete(
        '/user/follow/' + this.article.author._id
      )
      this.checkFollowStatus()
    }
  }
}
</script>

<style>
</style>