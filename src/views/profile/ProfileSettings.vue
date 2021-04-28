<template>
  <div class="box">
    <!-- 头部 -->
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">用户信息</div>
    </navbar>

    <!-- 头像设置 -->
    <div class="item" @click="show('showImgIS')">
      <div>
        <img :src="imgSrc">
      </div>
      <div>
        <div>头像设置</div>
        <i class="iconfont icon-jiantouyou"></i>
      </div>
    </div>
    <v-popup v-model="showImgIS"
    :style="{ height: '40%',width: '70%'}"
    closeable  round>
      <div class="showImgClass">
        <!-- 图片上传 -->
        <v-uploader v-model="fileList" multiple :max-count="1" preview-size="120px"/>
        <v-button plain type="info" size="normal" @click="TjIMG">提交</v-button>
      </div>
    </v-popup>


    <!-- 手机号 -->
    <div class="item2" @click="ts('手机号不支持修改!','phone')">
      <div>
        手机号
      </div>
      <div>
        <div>{{userInfo.phone}}</div>
        <i class="iconfont icon-jiantouyou"></i>
      </div>
    </div>
    <v-popup v-model="showPhone" :style="{ height: '20%',width: '70%'}" closeable  round>
      <div class="showUserNameClass">
        <div>手机号只允许修改一次！！！</div>
        <v-field v-model="phone" placeholder="请输入手机号" />
        <v-button plain type="info" size="small" @click="tjPhone">提交</v-button>
      </div>
    </v-popup>


    <!-- 账号 -->
    <div class="item2" @click="ts('账号不支持修改!')">
      <div>
        账号
      </div>
      <div>
        <div>{{userInfo.account}}</div>
        <i class="iconfont icon-jiantouyou"></i>
      </div>
    </div>

    <!-- 名称 -->
    <div class="item2" @click="show('showUserName')">
      <div>
        名称
      </div>
      <div>
        <div>{{userInfo.username}}</div>
        <i class="iconfont icon-jiantouyou"></i>
      </div>
    </div>

    <!-- 个人简介 -->
    <div class="item2" @click="show('showUserName')">
      <div style="width:120px">
        个人简介
      </div>
      <div>
        <div>{{userInfo.personalprofile}}</div>
        <i class="iconfont icon-jiantouyou"></i>
      </div>
    </div>

    <v-popup v-model="showUserName" :style="{ height: '50%',width: '70%'}" closeable  round>
      <div class="showUserNameClass">
        <v-field v-model="username" placeholder="请输入名称" />
        <v-field v-model="personalprofile" rows="2" maxlength="135" autosize  type="textarea" placeholder="请输入个人简介"/>
        <v-button plain type="info" size="small" @click="tjUser">提交</v-button>
      </div>
    </v-popup>

    <!-- 退出 -->
    <div class="BtnTC">
      <button @click="removeToken">退出登录</button>
    </div>

  </div>
</template>

<script>
import Button from 'vant/lib/button';
import 'vant/lib/button/style';
import Uploader from 'vant/lib/uploader';
import 'vant/lib/uploader/style';
import Popup from 'vant/lib/popup';
import 'vant/lib/popup/style';
import  Field from 'vant/lib/field';
import 'vant/lib/field/style';
import navbar from '../../components/common/navbar/NavBar'
export default {
  name:'ProfileSettings',
  components:{
    navbar,
    VPopup:Popup,
    VUploader:Uploader,
    VButton:Button,
    VField:Field
  },
  data(){
    return {
      // 用户数据
      userInfo:{},
      // 头像修改框是否显示
      showImgIS:false,
      // 图片上传
      fileList:[],
      // 头像图片
      imgSrc:'',
      // 账户修改框是否显示
      showUserName:false,
      // 新账户名
      username:'',
      // 新简介
      personalprofile:'',
      // 手机号
      phone:'',
      // 手机修改框是否显示
      showPhone:false
    }
  },
  mounted(){
    this.getData()
  },
  methods:{
    // 点击返回上一级页面
    RouterBack(){
      this.$router.go(-1)
    },
    // 请求数据
    getData(){
      this.userInfo = {}
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'user/info',
        data:this.$qs.stringify({token}),
      }).then(res=>{
        this.userInfo = res.data
        // 生成图片后缀uuid
        let uuid = (((1+Math.random())*0x10000)|0).toString(16).substring(1) + (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        if (!this.userInfo.img){
          this.imgSrc = this.website+'images/'+'laochenDefault Avatar.jpg' + `?uuid=` + uuid
        }else{
          this.imgSrc = this.website+this.userInfo.img + `?uuid=` + uuid
        }
        this.username=res.data.username
        this.personalprofile =res.data.personalprofile
      })
    },
    // 退出删除token
    removeToken(){
      // vant组件弹框
      this.$Dialog.confirm({
        title: '退出提示',
        message: '您确定要退出登录吗?',
      })
      .then(() => {
        this.$bus.$emit('initCartTotal','tc')
        window.localStorage.removeItem('token')
        this.$router.push({path:'/login'})
      })
      .catch(() => {
        return
      });
    },
    // 打开隐藏设置框
    show(dataKey){
      this[dataKey] = true
    },
    // 提交头像设置
    TjIMG(){
      let token = window.localStorage.getItem('token')
      let data = {
        token,
        imgData:this.fileList[0].content,
        // lastModified: this.fileList[0].file.lastModified,
        // lastModifiedDate: this.fileList[0].file.lastModifiedDate,
        name: this.fileList[0].file.name,
        // size: this.fileList[0].file.size,
        // type: this.fileList[0].file.type,
        // webkitRelativePath:this.fileList[0].file.webkitRelativePath
      }
      console.log(this.fileList[0])
      this.$axios({
        method: 'post',
        url:'user/upload',
        data:this.$qs.stringify(data),
      }).then(res=>{
        // console.log(res.data)
        if(res.data.state===200){
          this.showImgIS = false
          this.getData()
          this.fileList = []
        }
      })
    },
    // 提示(参数为提示文字内容)
    ts(text,type){
      if(type==='phone'&&(this.userInfo.phone===''||this.userInfo.phone==null)){
        this.showPhone = true
      }else{
        this.$Toast(text)
      }
    },
    // 提交修改用户名和个人简介数据
    tjUser(){
      let token = window.localStorage.getItem('token')
      let data = {
        token,
        username:this.username,
        personalprofile:this.personalprofile
      }
      this.$axios({
        method: 'post',
        url:'user/edituser',
        data:this.$qs.stringify(data),
      }).then(res=>{
        if(res.data.state===200){
          this.showUserName = false
          this.getData()
        }
      })
    },
    //修改手机
    tjPhone(){
      if(!(/^1[34578]\d{9}$/.test(this.phone))){
        this.$Toast('手机账号有误,请修改！');
        return
      }
      let token = window.localStorage.getItem('token')
      let data = {
        token,
        phone:this.phone
      }
      this.$axios({
        method: 'post',
        url:'user/phone',
        data:this.$qs.stringify(data),
      }).then(res=>{
        if(res.data.state===200){
          this.showPhone = false
          this.getData()
        }
      })
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
  },
}
</script>

<style scoped>
.box{
  width: 100%;
  height: 100vh;
  background-color: #f8f8f8;
  /* background-color: skyblue; */
}

.navbar{
  background-color: #ff8198!important;
  color: white;
}

.item{
  width: 100%;
  height: 80px;
  background-color: white;
  display: flex;
  justify-content: space-between;
}
.item div{
  display: flex;
  line-height: 70px;
  padding: 0 15px;
}
.item div img{
  margin-top: 6px;
  width: 68px;
  height: 68px;
  border-radius: 50%;
}

.item2{
  width: 100%;
  height: 60px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
}
.item2 div{
  display: flex;
  line-height: 60px;
  padding: 0 15px;
}

.BtnTC{
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.BtnTC button{
  width: 70%;
  height: 40px;
  color: rgb(255, 255, 255);
  background: linear-gradient(to right, rgb(255, 96, 52), rgb(238, 10, 36));
  border: 0px;
}


.showImgClass{
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 20px;
}

.showUserNameClass{
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
