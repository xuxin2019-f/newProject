<template>
  

  <div>
    <div class="write-btn">
      <el-button @click="submit" type='primary'>提交</el-button>
    </div>

    <el-row>

      <el-col :span="12">
        <!-- 左边写 -->
        <textarea class="md-editor" :value="content" @input="update" ></textarea>
      </el-col>
      <el-col :span="12">
         <!--右边展示效果  -->
          <div class="markdown-body" v-html="compiledMarkdown">

          </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import marked from 'marked'
export default {
  layout:'login',
  // 在head里配置一个github里的markdown样式，美化样式
  head:{
    link:[
      { href:"https://cdn.bootcss.com/github-markdown-css/3.0.1/github-markdown.min.css", rel:"stylesheet"}
    ]
  },
  data(){
    return {
      content:'# node.js基础实战'
    }
  },
  computed:{
    compiledMarkdown(){
      return marked(this.content, {sanitize:true})
    }
  },
  methods:{
    // 防抖
    update: debounce(function(e){
      this.content = e.target.value
    },150),
    async submit(){
      let ret = await this.$http.post('/article/create', {content:this.content})
      if(res.code==0){
        this.$notify({
          title:'创建成功',
          type:'success',
          message:`文章《${ret.data.title}》创建成功`
        })
        setTimeout(()=>{
          this.$router.push({ path:'/article/'+ret.data.id})
        })
      }
    }
  }
}
</script>
<style scoped>
.md-editor{
  width:100%;
  height:100vh;
  outline: none;
}

.write-btn{
  position: fixed;
  z-index:100;
  right:30px;
  top:10px;
}
</style>