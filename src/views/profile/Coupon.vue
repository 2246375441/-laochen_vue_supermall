<template>
  <div class="couponsBox">
    <!-- 登录头部 -->
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">优惠券列表</div>
    </navbar>

    <div class="header">
      <search 
      placeholder="请输入兑换码"
      label="兑换码"
      left-icon=" "
      show-action
      v-model="jhm"
      > 
        <template #action>
          <div @click="onSearch">激活</div>
        </template>
      </search>
    </div>
    
    <div class="itemBox" ref="itemBoxBS">
      <div>
        <div class="item" v-for="item in couponData" :key="item.id">
          <div class="itemNav">
            <div>
              <div>{{item.valueDesc + item.unitDesc}}</div>
              <div>{{item.condition}}</div>
            </div>
            <div>
              <div>{{item.name}}</div>
              <div>{{item.startAt}}--{{item.endAt}}</div>
            </div>
          </div>
          <div class="itemBottom">
            {{item.description}}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import 'vant/lib/search/style'
import Search from 'vant/lib/search';

import navbar from '../../components/common/navbar/NavBar'
import lcData from '../../tool/data'
export default {
  name:'Coupon',
  components:{
    navbar,
    Search
  },
  data(){
    return{
      couponData:[],
      itemBoxBS:null,
      jhm:'',
      timer1:null,
      timer2:null
    }
  },
  mounted(){
    this.getData()

    this.timer1 = setTimeout(() => {
      this.itemBoxBS = new this.$BS(this.$refs.itemBoxBS,{
        click:true
      })
    }, 100);
  },
  methods: {
    // 请求数据
    getData(){
      this.couponData = []
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'coupon/list',
        data:this.$qs.stringify({token}),
      }).then(res=>{
        if(res.data.state ===400){
          window.localStorage.removeItem('token')
          return
        }
        for(let i = 0,len=res.data.data.length;i<len;i++){
          res.data.data[i].startAt = lcData.format(res.data.data[i].startAt*1000)
          res.data.data[i].endAt =lcData.format(res.data.data[i].endAt*1000)
        }
        this.couponData = res.data.data
      })
    },
    // 点击返回上一级页面
    RouterBack(){
      this.$router.go(-1)
    },
    // 激活码激活
    onSearch(){
      // console.log(this.jhm)
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'coupon/add',
        data:this.$qs.stringify({token,activationCode:this.jhm}),
      }).then(res=>{
        // console.log(res.data)
        if(res.data.state===300){
          // 激活码无效
          this.$Dialog.alert({
            message: '激活码无效',
          })
        }else if(res.data.state===301){
          // 激活码上限
          this.$Dialog.alert({
            message: '激活码使用上限',
          })
        }else if(res.data.state===200){
          // 激活成功
          this.$Dialog.alert({
            message: '激活成功',
          }).then(()=>{
            this.getData()
            this.timer2 = setTimeout(()=>{
              this.itemBoxBS.refresh()
            },100)
          })
        }
      })
    }
  },
  beforeDestroy(){
    clearTimeout(this.timer1)
    clearTimeout(this.timer2)
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
.couponsBox{
  width: 100%;
  height: 100vh;
  background-color: #f7f8fa;
}
.navbar{
  background-color: #ff8198!important;
  color: white;
  margin-bottom: 10px;
}

.header{
  width: 100%;
  height: 60px;
}

.itemBox{
  width: 100%;
  height: calc( 100vh - 45px - 70px );
  position: relative;
  overflow: hidden;
}
.item{
  width: 92%;
  height: 140px;
  background-color: white;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 0 4px rgb(0,0,0,.1);
  position: relative;
  margin-top: 10px;
}
.itemNav{
  width: 100%;
  height: 100px;
  position: absolute;
  display: flex;
}
.itemNav div:nth-child(1){
  width: 40%;

}
.itemNav div:nth-child(1) div:nth-child(1){
  font-size: 40px;
  line-height: 80px;
  width: 100%;
  text-align: center;
  color: red;
}
.itemNav div:nth-child(1) div:nth-child(2){
  width: 100%;
  text-align: center;
}
.itemNav div:nth-child(2){
  width: 60%;
}
.itemNav div:nth-child(2) div:nth-child(1){
  width: 100%;
  margin-top: 30px;
  font-weight: bold;
  font-size: 20px;
  color: black;
}
.itemNav div:nth-child(2) div:nth-child(2){
  width: 100%;
  font-size: 16px;
  margin-top: 10px;
}

.itemBottom{
  position: absolute;
  width: 100%;
  height: 40px;
  bottom: 0;
  line-height: 40px;
  padding-left: 20px;
  border-top: solid 2px #f7f8fa;
}
</style>