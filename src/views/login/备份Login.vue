<template>
  <div>
    <!-- 登录头部 -->
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">登录</div>
    </navbar>

    <div class="content">
      <div class="content-img">
        <img >
      </div>
      <div class="content-bt" ref="contentBt">
        <div class="content-item active i-l" @click="btActive('login')">登录</div>
        <div class="content-item i-r" @click="btActive('register')">注册</div>
      </div>
      <div class="content-line" ref="contentLine"></div>

      <div class="core">
        <div class="core-login" v-show='isDOM' >
          <div>
            <span><i class="iconfont icon-zhanghaodenglu" />账号</span>
            <input type="text" name="account" placeholder="请输入账号" v-model="login.account" onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')">
          </div>
          <div>
            <span><i class="iconfont icon-mima" />密码</span>
            <input type="password" name="password" placeholder="请输入密码" v-model="login.password" onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')">
          </div>
          <button class="loginBtn" @click="login_yzm_kq">登录</button>
        </div>

        <div class="core-login" v-show='!isDOM' >
           <div>
            <span><i class="iconfont icon-banzumingcheng" />名称</span>
            <input type="text" name="username" placeholder="请输入名称" v-model="register.username">
          </div>
          <div>
            <span><i class="iconfont icon-zhanghaodenglu" />账号</span>
            <input type="text" name="account" placeholder="请输入账号" v-model="register.account" onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')" >
          </div>
          <div>
            <span><i class="iconfont icon-mima" />密码</span>
            <input type="password" name="password" placeholder="请输入密码" v-model="register.password"  onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')" >
          </div>
          <button class="loginBtn" @click="register_yzm_kq">注册</button>
        </div>
      </div>
      
    </div>

    <!-- 悬浮框(扩展功能) -->
    <div class="xfk">
      <vant-icon name="youzan-shield" @click="xfk_show = true"/>
    </div>

    <vant-popup v-model="login_show" :style="{ height: '40%',width: '70%'}">
      <div class="yzm">
        <div style="width: 200px;height: 50px; margin-top:40px" id="login_yzm"></div>
        <vant-field v-model="login_yzm" label="验证码" placeholder="请输入验证码"/>
        <vant-button type="primary" size="small" color="#efefef" icon="certificate" @click="loginBtn">提交</vant-button>
      </div>
    </vant-popup>

    <vant-popup v-model="register_show" :style="{ height: '40%',width: '70%'}">
      <div class="yzm">
        <div style="width: 200px;height: 50px; margin-top:40px" id="register_yzm"></div>
        <vant-field v-model="register_yzm" label="验证码" placeholder="请输入验证码"/>
        <vant-button type="primary" size="small" color="#efefef" icon="certificate" @click="registerBtn">提交</vant-button>
      </div>
    </vant-popup>


    <vant-popup v-model="xfk_show" position="right" :style="{ height: '100%',width:'30%' }">
      <div class="xfc_dom">
        <vant-button icon="manager" type="primary" @click="kf_router">客服登录</vant-button>
      </div>
    </vant-popup>

  </div>
</template>

<script>
import navbar from '../../components/common/navbar/NavBar'
import Popup from 'vant/lib/popup';
import 'vant/lib/popup/style';
import Field from 'vant/lib/field';
import 'vant/lib/field/style';
import Button from 'vant/lib/button';
import 'vant/lib/button/style';
import Icon from 'vant/lib/icon';
import 'vant/lib/icon/style';
export default {
  name: "Login",
  data(){
    return{
      btLeft:[], //登录和注册距离右边位置
      bt:'login', //目前处于登录还是注册
      login:{ //用户登录数据
        // account:'admin',
        // password:'admin123456',
        account:'',
        password:'',
      },
      register:{ //用户注册
        account:'',
        password:'',
        username:''
      },
      // 登录验证码
      login_show:false,
      login_yzm:'',
      login_vzm_obj:{},
      // 注册验证码
      register_show:false,
      register_yzm:'',
      register_vzm_obj:{},
      // 悬浮框
      xfk_show:false
    }
  },
  components:{
    navbar,
    vantPopup:Popup,
    vantField:Field,
    vantButton:Button,
    vantIcon:Icon
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
    // 打开登录验证码弹框
    login_yzm_kq(){
      if(this.login.account && this.login.password){
        setTimeout(()=>{
          // 初始化验证码
          this.login_vzm_obj = new this.$yzm("login_yzm");
        },300)
        this.login_show=true
      }else{
        this.$toast.show('请输入账号和密码',2000)
        return
      }
    },
    // 用户登录
    loginBtn(){
      var res = this.login_vzm_obj.validate(this.login_yzm);
      if(res){
        this.$axios({
          method: 'post',
          url:'login/l',
          data:this.$qs.stringify(this.login),
        }).then((res)=>{
          // state 200 登陆成功 返回数据
          // state 400 账号错误
          // state 401 密码错误
          if(res.data.state===200){
            // 登录成功
            this.$toast.show('登录成功',2000)
            this.$router.push({path: '/profile'})
            window.localStorage.setItem('token',res.data.token)
            window.localStorage.setItem('sf','yh')
            window.localStorage.setItem('account_yh',res.data.account)
            this.$bus.$emit('initCartTotal')
          }else if(res.data.state===400){
            // 账号错误
            this.$toast.show('账号错误',2000)
          }else if(res.data.state===401){
            // 密码错误
            this.$toast.show('密码错误',2000)
          }
        })
      }else{
        this.$toast.show('验证码错误',2000)
      }

    },
    // 打开用户注册验证码弹框
    register_yzm_kq(){
      if(this.register.account && this.register.password &&this.register.username){
        // 三者不允许一致
        if (this.register.account ===this.register.username ||this.register.account ===this.register.password||this.register.password ===this.register.username) {
          this.$Dialog.alert({
            message: '名称,账号,密码不允许有一致的',
          }).then(() => {
            return
          });
        }else{
          setTimeout(()=>{
            // 初始化验证码
            this.register_vzm_obj = new this.$yzm("register_yzm");
          },300)
          this.register_show=true
        }
      }else{
        this.$toast.show('请输入账号、密码、用户名',2000)
        return
      }
    },
    // 用户注册
    registerBtn(){
      var res = this.register_vzm_obj.validate(this.register_yzm);
      if(res){
        this.$axios({
          method: 'post',
          url:'login/r',
          data:this.$qs.stringify(this.register),
        }).then((res)=>{
          if(res.data.state===200){
            // 登录成功 逻辑
            this.$toast.show('登录成功',2000)
            this.$router.push({path: '/profile'})
            window.localStorage.setItem('token',res.data.token)
            window.localStorage.setItem('sf','yh')
            window.localStorage.setItem('account_yh',res.data.account)
            console.log(res.data)
            this.$bus.$emit('initCartTotal')
          }else if(res.data.state===300){
            // 账号存在
            this.$toast.show('账号存在',2000)
          }
        })
      }else{
        this.$toast.show('验证码错误',2000)
      }

    },
    // 客服登录
    kf_router(){
      this.xfk_show = false
      this.$Dialog.confirm({
        title: '提示',
        message: '即将跳转客服登录界面',
      })
        .then(() => {
          // on confirm
          this.$router.push({
            path:'kflogin'
          })
          return
        })
        .catch(() => {
          return
        });
    }
  },
  computed:{
    isDOM(){
      if(this.bt =='login'){
        return true
      }else{
        return false
      }
    }
  }
}
</script>

<style scoped>
.navbar{
  background-color: #ff8198!important;
  color: white;
}

.backCss{
  font-size: 24px;
}

.content{
  width: 100%;
  height: 60vh;
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
  background-color: #ff8198;
}

.core{
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.core-login{
  width: 100%;
  border-top: solid 1px #dfe1e9;
}
.core-login>div{
  margin-top: 5px;
  padding: 15px;
  border-bottom: solid 1px #dfe1e9;
}
.core-login>div>span{
  margin-right: 50px;
}
.core-login>div>input{
  border: none;
  outline: 0;
}
.loginBtn{
  width: 110px;
  height: 40px;
  transform:translate(-50%);
  margin-left: 50%;
  margin-top: 20px;
  border: none;
  border-radius: 20px;
}

.yzm{
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;

}
.yzm .van-button__content{
  color: black;
  margin: 0 10px;
}


.xfk{
  position: fixed;
  bottom:70px;
  right: 20px;
  z-index: 999;
  width: 50px;
  height: 50px;
  font-size: 50px;
}

.xfc_dom{
  display: flex;
  width: 100%;
  height: 100%;
  background-color: white;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>
