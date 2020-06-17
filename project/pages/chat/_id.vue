<template>
  <div class="chat">
    <h3>{{'与'+user.nickname+'的私聊'}}</h3>
    <el-divider></el-divider>
    <div class="chat-content"></div>
    <div class="chat-send">
      <el-input
        placeholder="请输入内容"
        v-model="content"
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 7}"
      ></el-input>

      <el-button type="danger" plain @click.native.prevent="handleSend">发送</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      content: ''
    }
  },
  mounted() {
    let userid = this.$route.params.id
    this.userid = userid
    if (userid) {
      this.getUser()
    }
  },
  methods: {
    async getUser() {
      let ret = await this.$http.get('/user/message/' + this.userid)
      if (ret.code === 0) {
        this.user = ret.data
      }
    },
    handleSend() {}
  }
}
</script>

<style lang='scss'>
.chat {
  width: 800px;
  margin: 0 auto;
  height: 600px;
  background-color: #ffffff;
  text-align: center;
  h3 {
    margin-top: 30px;
  }
  .chat-content {
    height: 400px;
    overflow-y: auto;
  }
  .chat-send {
    .el-button {
      position: absolute;
      bottom: 135px;
      right: 200px;
    }
  }
}
</style>