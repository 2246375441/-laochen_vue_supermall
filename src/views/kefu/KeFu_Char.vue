<template>
  <div class="box">
    <!-- 头部表示-显示用户名 -->
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">用户:{{kui.split('_')[1]}} (房间号:{{kui.split('_')[2]}})</div>
    </navbar>

    <!-- 聊天记录区域 -->
    <div class="charlist" ref="charlistBS">
      <div>
        <!-- <div class="chartimer">2021/3/5-15:45</div> -->

        <!-- 聊天信息 -->
        <div v-for="(item) in charData" :class="item.fason==0?'item1':'item2'" :key="item.id">
          <div class="item1_l" v-show="item.fason==0">
            <div v-if="!item.content==''" class="wz_content">{{item.content}}</div>
              <!-- <img :src="tppj(item.content_img)" alt="" v-if="item.content==''" style="width:100%;height:auto;" :onerror="defaultImg"> -->
            <vant-image
                width="100%"
                :src="item.content_img==''||item.content_img==null?'':tppj(item.content_img)"
                v-if="item.content==''"
                @click='img_fd(item.content_img)'
            >
              <template v-slot:loading>
                  <vant-loading type="spinner" size="30"  color="#1989fa"/>
                </template>
                <template v-slot:error>
                  <vant-loading type="spinner" size="30"  color="#1989fa"/>
                </template>
            </vant-image>
          </div>
          <div class="item1_r" v-show="item.fason==0">
            <img :src="item.img==''||item.img==null?'':tppj(item.img)" alt="">
          </div>


          <div class="item2_r" v-show="item.fason==1">
            <img :src="item.img==''||item.img==null?'':tppj(item.img)" alt="">
          </div>
          <div class="item2_l" v-show="item.fason==1">
              <div v-if="!item.content==''" class="wz_content">{{item.content}}</div>
              <!-- <img :src="tppj(item.content_img)" alt="" v-if="item.content==''" style="width:100%;height:auto;" :onerror="defaultImg"> -->
              <vant-image
                width="100%"
                :src="item.content_img==''||item.content_img==null?'':tppj(item.content_img)"
                v-if="item.content==''"
                @click='img_fd(item.content_img)'
              >
                <template v-slot:loading>
                  <vant-loading type="spinner" size="30"  color="#1989fa"/>
                </template>
                <template v-slot:error>
                  <vant-loading type="spinner" size="30"  color="#1989fa"/>
                </template>
              </vant-image>
          </div>
        </div>


      </div>
    </div>

    <!-- 底部操作 -->
    <div class="charbottom">
      <div>
        <vant-icon name="add-o" class="char_icon" @click="char_tool=!char_tool"/>
      </div>
      <vant-field
        v-model="tj_value"
        rows="1"
        :autosize="{maxHeight:200}"
        type="textarea"
        placeholder="请输入内容"
        class="char_input"
        style=""
      />
      <div class="char_icons">
        <vant-icon name="smile-o" class="char_icon" @click="bqk_kq"/>
        <vant-icon name="back-top" class="char_icon" @click="tj_input"/>
      </div>

      <div class="zb"></div>

      <!-- 表情框 -->
      <transition name="van-slide-up">
        <div class="char_bq" v-show="char_bq" ref="charbqBS">
          <div class="char_bq_box">
            <div v-for="(item,index) in bqArr"
              :key="index"
              @click="bq_input(item)">
            {{item}}</div>
          </div>
        </div>
      </transition>

      <!-- 工具栏 -->
      <transition name="van-slide-up">
        <div class="char_tool" ref="chartoolBS" v-show="char_tool">
          <div class="xf_bq_box" >

            <div class="tool_item">
              <!-- <vant-icon name="photo-o" class="tool_icon"/> -->
              <!-- <div>图片上传</div> -->
              <!-- <input type="file" style="display:none" ref="input_flie" accept="image/jpeg,image/jpg,image/png" @change="file_img"/> -->
              <vant-uploader v-model="fileList" :preview-image="false" :after-read="img_upload">
                <div>
                  <vant-icon name="photo-o" class="tool_icon" />
                  <div>图片上传</div>
                </div>
              </vant-uploader>
            </div>

          </div>
        </div>
      </transition>
    </div>


  </div>
</template>

<script>
import navbar from '../../components/common/navbar/NavBar'
import vantField from 'vant/lib/field';
import 'vant/lib/field/style';
import vantIcon from 'vant/lib/icon';
import 'vant/lib/icon/style';
import vantUploader from 'vant/lib/uploader';
import 'vant/lib/uploader/style';
import vantImage from 'vant/lib/image';
import 'vant/lib/image/style';
import vantLoading from 'vant/lib/loading';
import 'vant/lib/loading/style';

import {bq_data} from '../../assets/js/biaoqing.js'

export default {
  name:'KeFu_Char',
  data(){
    return{
      charlistBS:null,
      charbqBS:null,
      chartoolBS:null,
      tj_value:'',// 输入框文字
      xf_is:true,// 悬浮按钮是否显示
      char_bq:false,// 表情框
      char_tool:false,// 工具栏
      bqArr:[], // 表情数据
      ws:null,
      connected:false, // 标识服务器是否连接成功
      sendRetryCount:1, // 记录重试发送的次数||处理发送数据失败,重新发送
      connectRetryCount:1,// 重新连接服务器的次数||处理发送数据失败,重新连接服务器
      ws_timer:null, // ws重连定时器
      kui:'', // 客服_用户_商品iid
      token2:'', //客服token
      charData:[], //聊天数据
      fileList:[], //图片数据
      fileURL:'' //图片上传之后返回路径
    }
  },
  created(){
    this.bqArr = bq_data
    this.kui = this.$route.query.kui
    this.init_ws()
  },
  mounted(){
    this.token2 = localStorage.getItem('token2')
    setTimeout(() => {
      // BS滚动
      this.charlistBS = new this.$BS(this.$refs.charlistBS,{
        probeType: 3,
        click:true
      })
      this.charbqBS = new this.$BS(this.$refs.charbqBS,{
        probeType: 3,
        click:true
      })
      this.chartoolBS = new this.$BS(this.$refs.chartoolBS,{
        click:true,
        scrollX: true,
        probeType: 3
      })
    }, 200);
  },
  methods:{
    // 点击返回上一级页面
    RouterBack(){
      this.$router.go(-1)
    },
    // 表情输入
    bq_input(bq){
      this.tj_value = this.tj_value + bq
      this.char_bq = false
    },
    // 拼接路径下图片
    tppj(img){
      return this.website + img
    },
    // 初始化连接ws
    init_ws(){
      // ws连接
      if (!window.WebSocket) {
        alert('您的游览器不支持webSocket')
        return
      }
      if(this.ws_timer){
        clearTimeout(this.ws_timer)
      }
      // this.ws = new WebSocket(this.kf_ws)
      this.ws = new WebSocket(this.kf_ws+this.kui)
      // 连接成功的事件
      this.ws.onopen = () => {
        this.connected = true
        this.connectRetryCount = 1
        console.log('连接webSocket服务端成功')
        // 初始化成功发送 请求聊天室数据
        var data = {
          action:'init_char',
          kui:this.kui,
          token2:this.token2
        }
        this.ws.send(JSON.stringify(data))
      }
      // 连接服务端失败
      this.ws.onclose = () => {
        this.connected = false
        // 自动重连
        this.connectRetryCount++
        this.ws_timer = setTimeout(() => {
          this.init_ws()
        }, this.connectRetryCount * 500)
        console.log('连接webSocket服务器失败')
      }

      // 连接成功之后处理逻辑与数据
      this.ws.onmessage = msg => {
        const res = JSON.parse(msg.data)
        console.log(res)
        if(res.action=='init_char'){
          // 服务端 返回该聊天室数据
          this.charData = res.data
          // 重新bs自适应
          setTimeout(() => {
            this.charlistBS.refresh()
            this.charlistBS.scrollTo(0,this.charlistBS.maxScrollY)
          }, 300);
        }else if(res.action=='tj_input'){
          if(res.data=='提交成功'){
            this.tj_value = ''
            var data = {
              action:'init_char',
              kui:this.kui,
              token2:this.token2
            }
            this.ws.send(JSON.stringify(data))
          }

        }
      }
    },
    // 聊天提交
    tj_input(){
      if(this.tj_value == ''){
        return
      }else{
        var data = {
          action:'tj_input',
          kui:this.kui,
          token2:this.token2,
          value:this.tj_value,
          fason:0,  //客服
          img:'',
          shopName:'客服无法提交shopName参数',
          shopImg:'客服无法提交.destroy()参数'
        }
        this.ws.send(JSON.stringify(data))
      }
    },
    // 图片提交
    img_upload(){
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
            var data = {
              action:'tj_input',
              kui:this.kui,
              token2:this.token2,
              value:'',
              fason:0,  //客服
              img:res.data.imgUrl
            }
            this.ws.send(JSON.stringify(data))
            this.char_tool = false
            this.fileList = []
          }
        })
      }
    },
    // 点击图片放大
    img_fd(imgUrl){
      console.log(this.tppj(imgUrl))
    },
    // 表情框开启
    bqk_kq(){
      this.char_bq=!this.char_bq
      setTimeout(() => {
        this.charbqBS.refresh()
      }, 100);
    }
  },
  computed:{
  },
  components:{
    navbar,
    vantField,
    vantIcon,
    vantUploader,
    vantImage,
    vantLoading,
  },
  beforeDestroy () {
    // 销毁bs
    this.charlistBS.destroy()
    this.charbqBS.destroy()
    this.chartoolBS.destroy()
    // 销毁前发送一次连线请求(下线请求)
    // var data = {
    //   action:'lixian',
    //   kui:this.kui
    // }
    // this.ws.send(JSON.stringify(data))
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
  position: relative;
  background-color: #ededed;
}
.navbar{
  background-color: #ff8198!important;
  color: white;
}


.charlist{
  width: 100%;
  height:calc( 100% - 44px - 60px );
  overflow: hidden;
}



.chartimer{
  width: 100%;
  text-align: center;
  padding-top:10px ;
  color: #999999;
}



.item1{
  display: flex;
  /* max-width: 100%; */
  justify-content: flex-end;
  padding: 10px;
}
.item1_r{
  width: 40px;
  height: 40px;
  border: solid 2px white;
  border-radius: 5px;
  margin-left: 10px;
}
.item1_r img{
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.item1_l{
  max-width:calc( 100% - 40px - 10px );
  background-color: #94ea68;
  border-radius: 5px;
  padding: 8px;
  color: black;
  line-height: 24px;
  letter-spacing:2px;
}



.item2{
  display: flex;
  /* width: 100%; */
  justify-content: flex-start;
  padding: 10px;
}
.item2_r{
  width: 40px;
  height: 40px;
  border: solid 2px white;
  border-radius: 5px;
  margin-right: 10px;
}
.item2_r img{
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.item2_l{
  max-width:calc( 100% - 40px - 10px );
  background-color: white;
  border-radius: 5px;
  padding: 8px;
  color: black;
  line-height: 24px;
  letter-spacing:2px;
}




/* 底部框 */
.charbottom{
  position: fixed;
  bottom: 0;
  width: 100%;
  /* height: 60px; */
  background-color: #f7f7f7;
  display: flex;
  align-items:flex-end;
  padding: 10px 10px;
  z-index: 9999999999;
}
.zb{
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #f7f7f7;
  z-index: -99;
  bottom: -10px;
  left: -10px;
}
.char_input{
  width:calc( 100% - 60px - 30px );
}
.char_icons{
  width: 60px;
  display: flex;
  justify-content: space-between;
}
.char_icon{
  font-size: 30px;
  padding-bottom: 5px;
}

/* 表情 */
.char_bq{
  width: 100%;
  height: 200px;
  position: absolute;
  top: -200px;
  left: 0;
  right: 0;
  background-color: #f7f7f7;
  overflow: hidden;
  z-index: -9999;
}
.char_bq_box{
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
}
.char_bq_box div{
  margin: 5px;
}
/* 工具栏 */
.char_tool{
  width: 100vw;
  height: 60px;
  position: absolute;
  top: -60px;
  left: 0;
  right: 0;
  background-color: #f7f7f7;
  overflow: hidden;
  white-space:nowrap;
  z-index: -9999;
}
.xf_bq_box{
  height: 60px;
  display: inline-block;
}
.tool_item{
  height: 60px;
  display: flex;
  align-items: center;
  width:80px;
  display: inline-block;
  text-align: center;
}
.tool_icon{
  font-size: 40px;
}
.tool_wz{
  display: inline-block;
}


/* 悬浮 */
.xf_bq{
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 40px;
  height: 40px;
  font-size: 40px;
  z-index: 999;
}
.wz_content{
  word-wrap: break-word;
  word-break: normal;
}


/* 框架样式修改 */
.van-cell{
  border-radius: 10px;
}

</style>
