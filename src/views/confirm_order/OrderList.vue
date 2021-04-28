<template>
  <div class="box">
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">订单</div>
    </navbar>

    <div class="search">
      <van-search v-model="seatchValue" placeholder="请输入搜索关键词" clearable show-action @clear="onClear">
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </div>

    <div class="itemBox" ref="itemBoxBS">

      <div>
        <div class="item" v-for="item in orderData" :key="item.id" @click="RouterOrderDetails(item.id)">
          <div class="item-l">
            <img :src="item.img" alt="" @load="imgLoad">
          </div>
          <div class="item-r">
            <div class="item-bt">{{item.Fashion}}</div>
            <div>店铺:{{item.shopName}}  {{item.size}} {{item.style}}</div>
            <div>购买时间:{{item.NewOrderTime}}</div>
            <div>￥<span>{{item.PaidIn}}</span> 共 {{item.total}}件</div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>



<script>
import lcData from '../../tool/data'
import vanSearch from 'vant/lib/search'
import 'vant/lib/search/style'
import navbar from '../../components/common/navbar/NavBar'
export default {
  name:'Order',
  components:{
    navbar,
    vanSearch
  },
  data(){
    return {
      // 搜索关键字
      seatchValue:'',
      orderData:[],
      itemBoxBS:null
    }
  },
  mounted(){
    this.getData()

    this.itemBoxBS = new this.$BS(this.$refs.itemBoxBS,{
      click:true
    })
  },
  methods:{
    // 点击返回上一级页面
    RouterBack(){
      this.$router.replace({path:'/profile'})
    },
    // 搜索按钮
    onSearch(){
      // console.log(this.seatchValue)
      this.getData(this.seatchValue)
    },
    // 取消按钮
    onClear(){
      this.getData()
    },
    // 请求数据
    getData(search){
      this.orderData = []
      let token = window.localStorage.getItem('token')
      let data = null
      if(search){
        data = this.$qs.stringify({token,search})
      }else{
        data = this.$qs.stringify({token})
      }
      this.$axios({
        method: 'post',
        url:'order/list',
        data:data,
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }
        var arr = []
        for(let item in res.data){
          if(item!=="state"&&item!=="info"){
            res.data[item].NewOrderTime = lcData.format(res.data[item].orderTime*1)
            arr.push(res.data[item])
          }
        }
        this.orderData = arr.reverse()
      })
    },
    // 图片加载监听
    imgLoad(){
      this.itemBoxBS.refresh()
    },
    // 跳转订单详情页
    RouterOrderDetails(OrderId){
      this.$router.push({path:'/orderdeta/'+OrderId})
    }
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
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  /* background-color: skyblue; */
}

.navbar{
  background-color: #ff8198!important;
  color: white;
}

.search{
  width: 100%;
  height: 55px;
}

.itemBox{
  width: 100%;
  height: calc( 100vh - 45px - 55px - 10px );
  position: relative;
  overflow: hidden;
}

.item{
  width: 94%;
  height: 100px;
  margin: 15px  auto 0 auto;
  display: flex;
}

.item-l{
  width: 88px;
  height: 100px;
}
.item-l img{
  border-radius: 10px;
  width: 100%;
  height: 100%;
}

.item-r{
  width: calc(100% - 88px);
  padding-left: 7px;
  font-size: 13px;
  /* font-weight: bold; */
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.item-r div:nth-child(2){
  color: #a79f9f;
}
.item-r div:nth-child(3){
  color: #a79f9f;
}
.item-r div:nth-child(4) span{
  font-size: 22px;
  color: red;
  margin-right: 15px;
}

.item-bt{
  overflow:hidden;
  text-overflow: ellipsis;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
}
</style>
