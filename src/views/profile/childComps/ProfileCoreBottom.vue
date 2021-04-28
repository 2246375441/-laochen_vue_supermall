<template>
  <div class="nav">
    <div class="navItem" @click="routerPath('/addresslist/false')">
      <div><i class="iconfont icon-dizhi"></i>我的收货地址</div>
      <span>></span>
    </div>

    <div class="navItem" @click="routerPath('/settings')">
      <div><i class="iconfont icon-shezhi01"></i>个人设置</div>
      <span>></span>
    </div>

    <div class="navItem" @click="routerPath('/bugview')">
      <div><i class="iconfont icon-jinjifabuguanli"></i>提交bug</div>
      <span>></span>
    </div>

    <!-- <div class="navItem"> -->
      <!-- <div><i class="iconfont icon-huiyuan"></i>我的会员</div> -->
      <!-- <span>></span> -->
    <!-- </div> -->

    <!-- <div class="navItem"> -->
      <!-- <div><i class="iconfont icon-kefu"></i>联系客服</div> -->
      <!-- <span>></span> -->
    <!-- </div> -->

  </div>
</template>

<script>
export default {
  name:'ProfileCoreBottom',
  methods:{
    // 路由跳转
    routerPath(path){
      this.$router.push({ path })
    }
  }
}
</script>

<style scoped>
.nav{
  margin-top: 5px;
  width: 100%;
  background-color: white;
}

.navItem{
  display: flex;
  justify-content: space-between;
  padding:0 30px;
  font-size: 18px;

  height: 60px;
  line-height: 60px;
  border-bottom: solid 2px #f7f7f7;

  background-color: white;
}
.navItem > div>i{
  color:#ff8198;
  font-size: 20px;
  padding-right: 10px;
}
</style>
