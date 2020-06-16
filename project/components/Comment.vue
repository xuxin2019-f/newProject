<template>
  <div class="Com">
    <h2>发表评论</h2>
    <UserDisplay :user="user"></UserDisplay>
    <div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入内容"
        v-model="comment"
      ></el-input>
      <el-button
        @click.native.prevent="handleSubmit"
        type="primary"
        sytle="width:100%;margin-bottom:30px"
      >提交评论</el-button>
    </div>
    <div class="displayCom">
      <!-- 评论内容 -->
      <div class="comment-item" v-for="item in article.comments" :key="item._id">
        <nuxt-link :to="url">
          <img class="user-avatar" :src="item.avatar" alt />
        </nuxt-link>
        <div class="comment-body">{{item.con}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import UserDisplay from './UserDisplay.vue'
export default {
  components: {
    UserDisplay
  },
  props: ['user'],
  data() {
    return {
      comment: '',
      article: {
        title: '',
        views: 0,
        like: 0,
        dislike: 0,
        author: {},
        comments: []
      }
    }
  },
  computed: {
    url() {
      return '/user/' + (this.user._id || this.user.id)
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
    async handleSubmit() {
      let obj = {
        author: this.user._id,
        comment: this.comment
      }
      let ret = await this.$http.post('/article/comment', obj)
      if (ret.code === 0) {
        this.$notify({
          title: ret.data,
          type: 'success'
        })
        // 刷新更新
        this.getArticle()
      } else {
        this.$notify({
          title: ret.message,
          type: 'message'
        })
      }
    }
  }
}
</script>

<style lang='scss'>
.Com {
  margin-top: 40px;
  .el-button {
    margin-top: 10px;
  }
  .displayCom {
    margin-top: 10px;
    padding: 10px;
    .comment-item {
      display: flex;
      padding: 5px;
      .comment-body {
        margin-left: 15px;
        margin-top: 5px;
        padding: 10px;
        width: 400px;
        height: 70px;
        background-color: #f7f7f7;
        border-radius: 10%;
      }
    }
  }
}
.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: middle;
}
</style>