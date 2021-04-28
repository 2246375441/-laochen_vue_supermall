<template>
  <div class="box">
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">订单详情</div>
    </navbar>

    <div class="item">
      <div class="nav">
        <i class="iconfont icon-dianpu"></i>
        {{orderData.shopName}}
      </div>
      <div class="core">
        <div class="core-l">
          <img :src="orderData.img" alt="">
        </div>
        <div class="core-r">
          <div class="core-header">{{orderData.Fashion}}</div>
          <div>{{orderData.style}}--{{orderData.size}}</div>
          <div>￥{{orderData.nowPrice}} * {{orderData.total}}</div>
          <div class="core-q">实付款<span>￥{{orderData.PaidIn}}</span></div>
        </div>
      </div>
    </div>

    <div class="address">
      <div class="add_nav">订单信息</div>
      <div class="add_info">
        <div>收货地址:</div>
        <div>{{orderData.addressUserName}},{{orderData.addressTel}},{{orderData.province}}&nbsp;{{orderData.city}}&nbsp;{{orderData.county}}&nbsp;{{orderData.addressDetail}}</div>
      </div>

      <div class="add_bh">
        <div>订单编号:</div>
        <div>{{orderData.orderTime}}{{orderData.id}}</div>
      </div>

      <div class="add_kf">
        <button  @click="kf">
          <i class="iconfont icon-kefu kf"></i>
          联系客服大大
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import navbar from '../../components/common/navbar/NavBar'
export default {
  name:'OrderDetails',
  mounted(){
    this.orderId = this.$route.params.id
    this.getData(this.orderId)
  },
  data(){
    return {
      // 商品id
      orderId:null,
      // 商品数据
      orderData:[]
    }
  },
  methods:{
    // 请求数据
    getData(id){
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'order/details',
        data:this.$qs.stringify({token,id}),
      }).then(res=>{
        if(res.data.state ===400){
          window.localStorage.removeItem('token')
        }else if(res.data.state ===300){
          this.$Toast('网络不佳,请稍后再试');
        }else if(res.data.state ===200){
          // console.log(res.data.data)
          this.orderData = res.data.data
        }

      })
    },
    // 点击返回上一级页面
    RouterBack(){
      this.$router.go(-1)
    },
    // 联系客服
    kf(){
      // this.$Toast('可恨的客服大大在偷懒！！')
      this.$router.push({
        path:'/yhlist',
        query:{
          iid:this.orderData.iid,
          shopname:this.orderData.Fashion,
          shopimg:this.orderData.img
        }
      })
    }
  },
  components:{
    navbar
  },
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不能获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
    if(window.localStorage.getItem('token')){
      next()
    }else{
      next('/login')
    }
  }
}
</script>

<style scoped>
.box{
  height: 100vh;
  width: 100%;
  background-color: #f4f4f4;
}
.navbar{
  background-color: #ff8198!important;
  color: white;
}
.item{
  margin-top: 10px;
  width: 94%;
  margin: 0 auto;
  margin-top: 10px;
  border-radius: 15px;
  height: 190px;
  background-color: white;
  padding: 7px;
}
.nav{
  width: 100%;
  font-size: 18px;
  height: 28px;
  line-height: 22px;
  /* border-bottom: solid 2px #f4f4f4; */
  border-bottom: solid 2px peru;
}
.nav i{
  /* margin-left: 8px; */
  font-size: 24px;
}

.core{
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.core-l{
  width: 100px;
  height: 130px;
}
.core-l img{
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.core-r{
  width: calc(100% - 100px - 20px );
  height: 130px;
}
.core-header{
  overflow:hidden;
  text-overflow: ellipsis;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  color: black;
}
.core-r div{
  margin-bottom: 10px;
}
.core-q{
  font-size: 22px;
}
.core-q span{
  color: red;
  font-weight: bold;
}



.address{
  width: 94%;
  height: 188px;
  margin: 10px auto 0 auto;
  background-color: white;
  border-radius: 15px;
  padding: 7px;
}
.add_nav{
  font-size: 20px;
  display: inline-block;
  width: 100%;
  border-bottom: solid 2px peru;
}
.add_info{
  display: flex;
  font-size: 14px;
}
.add_info div:nth-child(1){
  width:30%;
  height: 80px;
  display: flex;
  align-items: center;
  font-size: 18px;
}
.add_info div:nth-child(2){
  width: 70%;
  height: 80px;
  display: flex;
  align-items: center;
}
.add_bh{
  display: flex;
  font-size: 14px;
}
.add_bh div:nth-child(1){
  width:30%;
  height: 20px;
  display: flex;
  align-items: center;
  font-size: 18px;
}
.add_bh div:nth-child(2){
  width: 70%;
  height: 20px;
  display: flex;
  align-items: center;
}

.add_kf{
  margin-top: 10px;
  width: 100%;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  border-top:solid 2px peru ;
  color: skyblue;
}
.add_kf button{
  border: none;
  background-color: white;
}
.kf{
  font-size: 22px;
}
</style>
