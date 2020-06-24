<template>
  <div class="chat">
    <h3>{{ '与' + user.nickname + '的私聊' }}</h3>
    <el-divider></el-divider>
    <div class="chat-content">
      <!-- 聊天内容 -->
      <div class="chat-item" v-for="item in contentList" :key="item.id">
        <div class="right" v-show="nickname === item.nickname">{{item.content}}</div>
        <div class="left" v-show="nickname !== item.nickname">{{item.content}}</div>
      </div>
    </div>
    <div class="chat-send">
      <el-input
        placeholder="请输入内容"
        v-model="content"
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 7 }"
      ></el-input>

      <el-button type="danger" plain @click.native.prevent="handleSend">发送</el-button>
    </div>
  </div>
</template>

<script>
import socketio from 'socket.io-client'
import { Socket } from 'net'
export default {
  data() {
    return {
      user: {},
      content: '',
      contentList: []
    }
  },
  mounted() {
    let userid = this.$route.params.id
    this.userid = userid
    if (userid) {
      this.getUser()
    }
    console.log(this.nickname)
  },
  computed: {
    nickname() {
      return this.$store.state.user.nickname
    }
  },
  methods: {
    async getUser() {
      let ret = await this.$http.get('/user/message/' + this.userid)
      if (ret.code === 0) {
        this.user = ret.data
      }
    },
    handleSend() {
      const socket = socketio('http://127.0.0.1:7003')
      //   // 连接服务端
      socket.on('connect', () => {
        console.log('connect!')
        socket.emit(this.content)

        this.content = ''
      })

      //   //接收消息通知
      socket.on('res', (msg) => {
        console.log('res from server: %s!', msg)
      })
      const obj = {
        content: this.content,
        nickname: this.nickname
      }
      socket.emit('server', obj)
      this.content = ''
      socket.on('inline', (msg) => {
        console.log('msg', msg)
        this.contentList.push(msg)
        console.log(this.contentList)
      })
      // 接收上线通知
      // socket.on('server', (msg) => {
      //   console.log(msg)
      // })
    }
  }
}
</script>

<style lang="scss">
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
    width: 100%;
    height: 400px;
    overflow-y: auto;
    // display: flex;
    // flex-direction: column;
    // align-content: flex-end;
    // position: relative;
    .chat-item {
      width: 50px;
      // align-self: flex-end;
    }
    .right {
      margin-left: 750px;
    }
    .left {
      margin-left: 50px;
    }
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
