<template>
  <div class="box">
    <!-- 登录头部 -->
    <navbar class="navbar">
      <div slot="center">个人设置</div>
    </navbar>

    <!-- 头像区域 -->
    <div class="nav">
      <div class="nav_l">
        <img :src="info.img?img_fz(info.img):''" alt="" @click="edit_img(info.img)">
      </div>
      <div class="nav_r" @click="edit_info">
        <div class="wzs" style="font-size:24px; font-weight: bold;">{{info.username}}</div>
        <div class="wzs">个人简介:{{info.personalprofile}}</div>
        <div class="wzs">注册时间:{{info.registertime}}</div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="core" ref="coreBs">
      <div>
        <!-- 账号 -->
        <div class="item" style="border-top: solid 3px #ebe1e1;">
          <div>账号</div>
          <div>{{info.account}}</div>
        </div>
        <!-- 密码 -->
<!--        <div class="item">-->
<!--          <div>手机号</div>-->
<!--          <div>{{info.phone}}</div>-->
<!--        </div>-->
        <div class="item">
          <div>是否上线</div>
          <div>{{info.zx}}</div>
        </div>
      </div>
    </div>

    <!-- 图片上传 -->
    <v-popup v-model="showImgIS"
    :style="{ height: '40%',width: '70%'}"
    closeable  round @close="showIsfn()">
      <div class="showImgClass">
        <!-- 图片上传 -->
        <v-uploader v-model="fileList" multiple :max-count="1" preview-size="120px" accept="image/jpeg,image/jpg,image/png" :after-read="img_type"/>
        <v-button plain type="info" size="normal" @click="edit_img_qm">提交</v-button>
      </div>
    </v-popup>

    <!-- 名称,简介修改 -->
    <v-popup v-model="showInfoIS"
    :style="{ height: '50%',width: '90%'}"
    closeable  round @close="showIsfn()">
      <div class="showInfoClass">
        <v-field v-model="tj_info.username" label="用户名" />
<!--        <v-field v-model="tj_info.phone" type="digit" label="手机号" :disabled="info.phone==''" maxlength="11"/>-->
        <v-field v-model="tj_info.personalprofile" label="个人简介"
          rows="1"   :autosize="{maxHeight:100}" type="textarea"  maxlength="150"   show-word-limit
        ></v-field>
        <v-button plain type="info" size="normal" @click="info_qm">保存</v-button>
      </div>
    </v-popup>
  </div>
</template>

<script>
import navbar from '../../components/common/navbar/NavBar'
import Button from 'vant/lib/button';
import 'vant/lib/button/style';
import Uploader from 'vant/lib/uploader';
import 'vant/lib/uploader/style';
import Popup from 'vant/lib/popup';
import 'vant/lib/popup/style';
import  Field from 'vant/lib/field';
import 'vant/lib/field/style';
export default {
  name:'KeFu_Option',
  data(){
    return{
      coreBs:null,
      info:{},
      showImgIS:false,
      fileList:[],
      token2:'',
      showInfoIS:false,
      tj_info:{
        username:"",
        personalprofile:"",
        phone:''
      }
    }
  },
  created(){
    this.getInfo()
  },
  mounted(){
    // BS滚动
    this.token2 = localStorage.getItem('token2')
    this.coreBs = new this.$BS(this.$refs.coreBs,{
      probeType: 3,
      click:true
    })
  },
  methods:{
    // 请求用户数据
    getInfo(){
      var data = {
        token:localStorage.getItem('token2')
      }
      this.$axios({
        method: 'post',
        url:'kefu/info',
        data:this.$qs.stringify(data),
      }).then(res=>{
        this.info = res.data
        console.log(res.data)
      })
    },
    // 拼接图片
    img_fz(img){
      return `${this.website }${img}`
    },
    // 修改图片
    edit_img(imgurl){
      this.showImgIS = true
    },
    // 提交图片
    edit_img_qm(){
      console.log(this.fileList[0])
      if(this.fileList.length==0){
        return
      }else{
        if(this.fileList[0].file.size>2097152){
          this.fileList = []
          alert('请上传小于2M图片')
          return
        }else if(!(this.fileList[0].file.type=='image/jpeg'||this.fileList[0].file.type=='image/png')){
          this.fileList = []
          alert('请上传jpg或png格式图片')
          return
        }
        let data = {
          imgData:this.fileList[0].content,
          name: this.fileList[0].file.name,
        }
        this.$axios({
          method: 'post',
          url:'util/uploadimg',
          data:this.$qs.stringify(data),
        }).then(res=>{
          if(res.data.state===200){
            console.log(res.data.imgUrl)
            this.fileList = []
            this.$axios({
              method: 'post',
              url:'kefu/editimg',
              data:this.$qs.stringify({
                token2:this.token2,
                img:res.data.imgUrl
              }),
            }).then(res2=>{
              if(res2.data.state===200){
                // console.log(res2.data.state)
                alert('修改头像成功')
                this.showImgIS = false
                this.getInfo()
              }
            })
          }
        })
      }
    },
    // 上传图片验证
    img_type(){
      if(!(this.fileList[0].file.type=='image/jpeg'||this.fileList[0].file.type=='image/png')){
        this.fileList = []
        alert('请上传jpg或png格式图片')
        return
      }else if(this.fileList[0].file.size>2097152){
        this.fileList = []
        alert('请上传小于2M图片')
        return
      }
    },
    // 关闭数据处理
    showIsfn(){
      this.fileList = []
      this.tj_info = {
        username:"",
        personalprofile:"",
        phone:''
      }
    },
    // 打开修改用户数据框
    edit_info(){
      this.tj_info.username = this.info.username
      this.tj_info.personalprofile = this.info.personalprofile
      this.tj_info.phone = this.info.phone
      this.showInfoIS = true
    },
    // 提交名称,简介修改
    info_qm(){
      var data = {
        token2:this.token2,
        username:this.tj_info.username,
        personalprofile:this.tj_info.personalprofile
      }
      this.$axios({
        method: 'post',
        url:'kefu/edituser',
        data:this.$qs.stringify(data),
      }).then(res=>{
        if(res.data.state==400){
          window.localStorage.removeItem('token2')
          alert('用户数据过期,请重新登录')
          this.$router.replace({
            path:'/kflogin'
          })
        }else if(res.data.state==200){
          alert('修改成功')
          this.showInfoIS = false
          this.getInfo()
        }
      })
    },
  },
  components:{
    navbar,
    VPopup:Popup,
    VUploader:Uploader,
    VButton:Button,
    VField:Field
  },
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不能获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
    if(window.localStorage.getItem('token2')){
      next()
    }else{
      next('/kflogin')
    }
  },
}
</script>

<style scoped>
.box{
  width: 100vw;
  height: 100vh;
  background-color: white;
}
.navbar{
  background-color: #ff8198!important;
  color: white;
}


.nav{
  background-color: white;
  width: 100%;
  height: 140px;
  /* background-color: skyblue; */
  display: flex;
  padding-top: 20px;
  padding-bottom: 20px;
}
.nav_l{
  width: 100px;
  height: 100px;
  margin-left: 20px;
  margin-right: 20px;
}
.nav_l img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: skyblue;
}
.nav_r{
  width: calc(100% - 100px - 20px - 20px );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.wzs{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:2;
  overflow: hidden;
}
.core{
  height: calc(100% - 140px - 44px - 50px);
  width: 100%;
  overflow: hidden;
}

.item{
  display: flex;
  padding: 20px 20px;
  font-size: 24px;

  border-bottom: solid 3px #ebe1e1;
}
.item div:nth-child(1){
  width: 30%;
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


.showInfoClass{
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 20px;
}

.showInfoClass >>> .van-field__label{
  width: 60px !important;
}
</style>
