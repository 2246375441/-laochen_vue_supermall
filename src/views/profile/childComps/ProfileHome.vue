<template>
  <div class="nav">
    <div class="navBar" @click="ColoredEggs">
      个人中心
    </div>

    <div class="userDom">
      <div class="userDomD1">
        <img :src="imgUrl" v-if="!userInfo.img">
        <img :src="imgSrc" v-if="userInfo.img">
        <div @click="routerPush('/login')" v-if="!userInfo.username">请登录</div>
        <div v-if="userInfo.username" @click="routerPush('/settings')">{{userInfo.username}}</div>
      </div>
      <div class="userDomD2">
        <div @click="wkf()">
          <span>0</span><br/>银行卡
        </div>
        <div @click="routerPush('/integral')">
          <span>{{Math.floor(integral * 100) / 100}}</span><br/>积分
        </div>
        <div @click="routerPush('/history')">
          <span>{{HistoryCount}}</span><br/>历史记录
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import DefaImgUrl from '../../../assets/img/profile/wdl.jpg'
export default {
  name:'ProfileHome',
  data(){
    return{
      imgUrl:DefaImgUrl,
      // 历史记录
      HistoryCount:0,
      // 积分
      integral:0
    }
  },
  props:{
    userInfo:{
      type:[Object],
    },
    imgSrc:{
      type:[String],
    }
  },
  mounted(){
    // 请求历史记录
    this.getHistoryCount()
    // 请求积分
    this.getIntegral()
  },
  methods:{
    // 点击跳转
    routerPush(path){
      this.$router.push({ path })
    },
    // 请求历史记录数量
    getHistoryCount(){
      let token = window.localStorage.getItem('token')
      if(!token){
        return
      }
      this.$axios({
        method: 'post',
        url:'history/count',
        data:this.$qs.stringify({token}),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }
        this.HistoryCount = res.data.total
      })
    },
    // 请求积分
    getIntegral(){
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'integral/core',
        data:this.$qs.stringify({token}),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }
        if(!res.data.data){
          return
        }
        this.integral = res.data.data.integral * 1
      })
    },
    // 提示未开发
    wkf(){
      this.$Toast('银行卡功能\n正在开发中')
    },
    ColoredEggs(){
      this.$Dialog.alert({
        title: '恭喜你发现小彩蛋(✪ω✪)',
        message: '开发者老陈微信:nmbm120\n (σﾟ∀ﾟ)σ..:*☆哎哟不错哦',
        theme: 'round-button'
      }).then(() => {
        // on close
      });
    }
  }
}
</script>

<style scoped>
.nav{
  width: 100%;
  height: 170px;
  background-color: #ff8198;
  margin-bottom: 110px;
}
.navBar{
  font-size: 24px;
  color: white;
  text-align: center;
  padding:20px 0;
}

.userDom{
  height: 200px;
  width:90%;
  margin: 0 auto;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 5px 15px -5px rgba(0,0,0,.5);
}

.userDomD1{
  height: 100px;
  width: 100%;
  display: flex;
}
.userDomD1 img{
  width: 74px;
  height: 74px;
  border-radius: 50%;
  margin-top: 15px;
  margin-left: 20px;
  margin-right: 10px;
}
.userDomD1 div{
  font-size: 24px;
  font-weight: bold;
  color: black;
  line-height: 100px;
  margin-left: 10px;
}

.userDomD2{
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}
.userDomD2 div{
  font-size: 20px;
  text-align: center;
}
.userDomD2 div span{
  font-weight: bold;
}


</style>
