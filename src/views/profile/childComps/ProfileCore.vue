<template>
  <div class="nav">
    <div class="navBar" @click="routerPath('/orderlist')">
      <div>我的订单</div>
      <div>查看全部订单 ></div>
    </div>

    <div class="navCore">
      <div>
        <i class="iconfont icon-dianpu" @click="routerPath('/collection')"></i><br/>
        <span>商品收藏</span>
      </div>

      <div>
        <i class="iconfont icon-dingdan" @click="routerPath('/orderlist')"></i><br/>
        <span>订单</span>
      </div>

      <div>
        <i class="iconfont icon-lishijilu" @click="routerPath('/history')"></i><br/>
        <span>历史记录</span>
      </div>

      <div>
        <i class="iconfont icon-icon_coupon" @click="routerPath('/coupon')"></i><br/>
        <span>优惠券</span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name:'ProfileCore',
  methods: {
    routerPath(path){
      this.$router.push({ path })
    }
  },
}
</script>

<style scoped>
.navBar{
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 10px 10px;
  background-color: white;
}
.navBar div:nth-child(1){
  font-weight: bold;
}
.navBar div:nth-child(2){
  font-size: 14px;
  color: #da8a8a;
}

.navCore{
  border-top:solid 2px #f7f7f7 ;
  border-bottom:solid 2px #f7f7f7 ;
  padding:14px 20px 14px 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: white;
}
.navCore div{
  text-align: center;
}
.navCore div i{
  font-size: 24px;
  display: inline-block;
  padding-bottom: 5px;
}
.navCore div span{
  font-size: 14px;
  font-weight: bold;
}
</style>
