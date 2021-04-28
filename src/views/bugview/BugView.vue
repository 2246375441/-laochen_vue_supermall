<template>
  <div>
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">Bug提交</div>
    </navbar>

    <v-notice-bar
      left-icon="volume-o"
      text="此处留言提交BUG(点击右下角按钮提交Bug)"
    />

    <!-- bug栏 -->
    <div class="bugList" ref="bugListBs">
      <van-collapse v-model="bugListName" >
        <van-collapse-item v-for="item in bugData" :key="item.data.id" :name="item.data.id" >
          <template #title>
            <div class="bugNav">
              <div style="marginRight:10px">
                <van-tag type="primary" v-if="item.data.buglv*1===0">轻微</van-tag>
                <van-tag type="warning" v-if="item.data.buglv*1===1">普通</van-tag>
                <van-tag type="danger" v-if="item.data.buglv*1===2">严重</van-tag>
              </div>
              <div style="marginRight:10px">{{item.username}} {{item.data.subtime}}</div>
              <van-tag plain type="warning" v-if="item.data.bugrepair*1===0">通知中</van-tag>
              <van-tag plain type="primary" v-if="item.data.bugrepair*1===1">正在修复</van-tag>
              <van-tag plain type="success" v-if="item.data.bugrepair*1===2">修复完成</van-tag>
            </div>
          </template>
          {{item.data.bugcontext}}
        </van-collapse-item>
      </van-collapse>
    </div>
    
    <!-- 按钮 -->
    <div class="btn" @click="TJshowBtn">
      <van-icon name="warning" size="40px"/>
    </div>

    <van-popup v-model="TJshow" round closeable 
    :style="{ height: '60%',width:'80%' }" >
      <div class="tjk">
        <div>
          <label for="buglv" style="marginRight:10px;marginLeft:15px">bug等级</label>
          <select name="buglv" v-model="buglv">
            <option value="0">轻微</option>
            <option value="1">普通</option>
            <option value="2">严重</option>
          </select>
        </div>
        <van-field
          v-model="bugContext"
          rows="5"
          autosize
          type="textarea"
          placeholder="请输入内容"
          maxlength="150"
          show-word-limit
        />
        <van-button plain type="info" block @click="getAddBug">提交</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import NoticeBar  from 'vant/lib/notice-bar';
import 'vant/lib/notice-bar/style';
import Collapse  from 'vant/lib/collapse';
import 'vant/lib/collapse/style';
import CollapseItem  from 'vant/lib/collapse-item';
import 'vant/lib/collapse-item/style';
import Tag from 'vant/lib/tag';
import 'vant/lib/tag/style';
import Icon from 'vant/lib/icon'
import 'vant/lib/icon/style'
import Popup from 'vant/lib/popup';
import 'vant/lib/popup/style';
import Field from 'vant/lib/field';
import 'vant/lib/field/style';
import Button from 'vant/lib/button';
import 'vant/lib/button/style';
import navbar from '../../components/common/navbar/NavBar'
import lcData from '../../tool/data.js'
export default {
  name:'BugView',
  data(){
    return{
      // 当前打开哪个折叠内容
      bugListName:[],
      // bs滚动
      bugBs:null,
      // 请求数据
      bugData:[],
      // 是否显示添加框
      TJshow:false,
      // bug等级
      buglv:0,
      // bug内容
      bugContext:''
    }
  },
  mounted(){
    setTimeout(()=>{
      this.bugBs = new this.$BS(this.$refs.bugListBs,{
        click:true
      })
    },100)

    this.getBugData()
  },
  methods:{
    // 点击返回上一级页面
    RouterBack(){
      this.$router.go(-1)
    },
    // 请求数据
    getBugData(){
      this.bugData = []
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'bugdata/list',
        data:this.$qs.stringify({token}),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }
        if(!res.data.data){
          return
        }
        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].data.subtime=lcData.format(res.data.data[i].data.subtime *1000)
        }
        this.bugData = res.data.data
      })
    },
    // 展示添加框
    TJshowBtn(){
      this.TJshow = true
      this.bugContext = ''
    },
    // 提交bug数据
    getAddBug(){
      let token = window.localStorage.getItem('token')
      let data = {
        token,
        buglv:this.buglv,
        bugrepair:'0',
        bugcontext:this.bugContext
      }
      this.$axios({
        method: 'post',
        url:'bugdata/add',
        data:this.$qs.stringify(data),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }
        if(res.data.state===200){
          this.TJshow = false
          this.$Dialog.alert({
            message: '提交成功\nThanks♪(･ω･)ﾉ',
          }).then(() => {
            this.getBugData()
            this.bugBs.refresh()
          });
        }
      })
    }
  },
  components:{
    navbar,
    VNoticeBar:NoticeBar,
    VanCollapse:Collapse,
    VanCollapseItem:CollapseItem,
    VanTag:Tag,
    VanIcon:Icon,
    VanPopup:Popup,
    VanField:Field,
    VanButton:Button
  },
  watch:{
    bugListName(){
      this.$nextTick(()=>{
        this.bugBs.refresh()
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    if(window.localStorage.getItem('token')){
      next()
    }else{
      next('/login')
    }
  },
}
</script>

<style scoped>
.navbar{
  background-color: #ff8198!important;
  color: white;
}

.bugList{
  width: 100%;
  height: calc(100vh - 44px - 40px);
  position: relative;
  overflow: hidden;
}

.bugNav{
  display: flex;
}

.btn{
  position: absolute;
  bottom: 40px;
  right: 30px;
}

.tjk{
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>