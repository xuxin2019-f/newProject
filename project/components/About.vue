<template>
  <div class="Personal">
    <div class="personalHeader">
      <img :src="userInfo.avatar" alt />
      <span>{{userInfo.nickname}}</span>
    </div>
    <div class="PersonalDetail">
      <div class="item">
        <div class="title">关注</div>
        <div class="content">{{userInfo.following.length}}</div>
      </div>
      <div class="item">
        <div class="title">粉丝</div>
        <div class="content">{{userInfo.follower.length}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['userInfo'],
  mounted() {
    //console.log('??', this.userInfo)
  }
}
</script>

<style lang='scss'>
.Personal {
  width: 25%;
  background: #fff;
  .personalHeader {
    border-bottom: 2px solid #eee;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .PersonalDetail {
    display: flex;
    flex-direction: row;
    .item {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>