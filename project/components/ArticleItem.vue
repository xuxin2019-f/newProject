<template>
  <div :key="article._id" class="article-item">
    <!-- 后端逻辑有一访问文章详情页，访问量views+1 -->
    <nuxt-link :to="'/article/'+article._id">
      <h2 style="width:900px;">{{article.title}}</h2>
    </nuxt-link>
    <!-- 文章主题内容,并且超过一定长度的截取 -->
    <p>
      {{article.article.replace('#','').slice(article.title.length+1).length>20?
      article.article.replace('#','').slice(article.title.length+1,20+article.title.length+1)+'...':
      article.article.replace('#','').slice(article.title.length+1)
      }}
    </p>
    <p>
      <span class="user">
        {{article.author.nickname}}
        <img class="user-avatar" :src="article.author.avatar" alt />
      </span>
      <span class="action">
        <i class="el-icon-view">{{article.views}}</i>
      </span>

      <span class="action">
        <i class="el-icon-thumb">{{article.like}}</i>
      </span>

      <span class="action">
        <i class="el-icon-thumb rotate180"></i>
        {{article.dislike}}
      </span>
    </p>
    <!-- 如果是在首页，则index.vue不会传递one属性，而在个人页，user/_id.vue会传递一个one属性，才会渲染这个按钮 -->
    <el-button v-if="one" @click.native.prevent="handleDelete(article._id)">删除</el-button>
  </div>
</template>
<script>
export default {
  props: ['article', 'one', 'parentMet'],
  methods: {
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const ret = await this.$http.delete('/article/delete/' + id)
          //console.log(ret.data)
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.$emit('parentMet')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '删除失败！'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.article-item {
  padding: 20px 15px;
  position: relative;
  border-bottom: 2px solid #eee;
  a {
    color: #67c23a;
  }
  .action {
    display: inline-block;
    width: 50px;
    i {
      letter-spacing: 5px;
    }
  }
  .user {
    display: inline-block;
    width: 150px;
  }
  .el-button {
    position: absolute;
    right: 30px;
    bottom: 20px;
  }
}
</style>>
