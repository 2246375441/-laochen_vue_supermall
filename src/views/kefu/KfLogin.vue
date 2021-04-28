<template>
  <div class="box">
    <!-- 登录头部 -->
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">客服登录</div>
    </navbar>

    <div class="core_box">
      <h1>{{bt=="login"?'客服登录页面':'客服注册页面'}}</h1>

        <div class="content">
          <div class="content-bt" ref="contentBt">
            <div class="content-item active i-l" @click="btActive('login')">登录</div>
            <div class="content-item i-r" @click="btActive('register')">注册</div>
          </div>
          <div class="content-line" ref="contentLine"></div>
        </div>

        <div class="login_box" v-show="bt=='login'">
          <v-field v-model="login.account" label="账号" placeholder="请输入账号" style="margin-bottom:20px;" onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"/>
          <v-field v-model="login.password" label="密码" placeholder="请输入密码" type="password" onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"/>
          <v-button type="primary" class="login_btn" @click="loginBtn">登录</v-button>
        </div>

        <div class="login_box" v-show="bt!=='login'">
          <v-field v-model="register.username" label="名称" placeholder="请输入名称" style="margin-bottom:20px;"/>
          <v-field v-model="register.account"  label="账号" placeholder="请输入账号" style="margin-bottom:20px;" onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"/>
          <v-field v-model="register.password" label="密码" placeholder="请输入密码" type="password" onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"/>
          <v-button type="primary" class="login_btn" @click="registerBtn">注册</v-button>
        </div>
    </div>
  </div>
</template>

<script>
import navbar from '../../components/common/navbar/NavBar'
import Field from 'vant/lib/field';
import 'vant/lib/field/style';
import Button from 'vant/lib/button';
import 'vant/lib/button/style';
export default {
  name:'KfLogin',
  data(){
    return{
      login:{ //用户登录数据
        account:'',
        password:'',
      },
      register:{ //用户注册
        account:'',
        password:'',
        username:''
      },
      bt:'login',
      btLeft:[]
    }
  },
  mounted(){
    const btDom = this.$refs.contentBt
    const l = btDom.querySelector('.i-l').offsetLeft
    const r = btDom.querySelector('.i-r').offsetLeft
    this.btLeft[0] = l
    this.btLeft[1] = r
    this.btActive(this.bt)
  },
  methods:{
    // 点击返回上一级页面
    RouterBack(){
      this.$router.go(-1)
    },
    // 客服登录
    loginBtn(){
      this.$axios({
        method: 'post',
        url:'kefu/l',
        data:this.$qs.stringify(this.login),
      }).then((res)=>{
        // state 200 登陆成功 返回数据
        // state 400 账号错误
        // state 401 密码错误
        if(res.data.state===200){
          // 登录成功
          this.$toast.show('登录成功',2000)
          window.localStorage.setItem('token2',res.data.token)
          window.localStorage.setItem('sf','kefu')
          this.$router.push({path: '/kflist'})
          console.log(res)
        }else if(res.data.state===400){
          // 账号错误
          this.$toast.show('账号错误',2000)
        }else if(res.data.state===401){
          // 密码错误
          this.$toast.show('密码错误',2000)
        }
      })
    },
    // 用户注册
    registerBtn(){
      this.$axios({
        method: 'post',
        url:'kefu/r',
        data:this.$qs.stringify(this.register),
      }).then((res)=>{
        if(res.data.state===200){
          // 登录成功 逻辑
          this.$toast.show('登录成功',2000)
          window.localStorage.setItem('token2',res.data.token)
          window.localStorage.setItem('sf','kefu')
          this.$router.push({path: '/kflist'})
          console.log(res)
        }else if(res.data.state===300){
          // 账号存在
          this.$toast.show('账号存在',2000)
        }
      })
    },
    // 下滑区域 根据点击而变化
    btActive(type){
      if(type=='login'){
        this.$refs.contentLine.style.transform = `translateX(${this.btLeft[0]}px)`
        this.bt = 'login'
      }else{
        this.$refs.contentLine.style.transform = `translateX(${this.btLeft[1]}px)`
        this.bt = 'register'
      }
      this.$refs.contentLine.style.transitionDuration = '0.3s'
    },
  },
  components: {
    VField:Field,
    VButton:Button,
    navbar
  }
}
</script>

<style scoped>
.box{
  width: 100vw;
  height: 100vh;
  background-color: #ff8198;
  color: white;
}
.navbar{
  background-color: #ff8198!important;
  color: white;
}


.qy{
  width: 100%;
  height: 40px;
}


.core_box{
  width: 100%;
  position: fixed;
  top: 20%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.login_box{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.login_btn{
  margin-top: 20px;
}

.content{
  width: 100%;
  /* height: 10vh; */
  margin-bottom: 10px;
}
.content-img{
  width: 100%;
  height: 170px;
}
.content-img img{
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #ff8198;
  transform:translate(-50%);
  margin-left: 50%;
  margin-top: 30px;
  margin-bottom: 40px;
}

.content-bt{
  display: flex;
  justify-content: space-around;
}
.content-item{
  display: block;
  width:40px;
  height: 32px;
  text-align: center;
}
.content-line{
  width:38px;
  height: 4px;
  background-color: white;
}
</style>