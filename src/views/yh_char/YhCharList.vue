<template>
  <div class="box">
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">在线客服列表</div>
    </navbar>

    <!-- 客服列表 -->
    <div class="charlist" ref="charlistBS">
      <div>
        <div class="charitem" v-for="(item) in kefuInfo" :key="item.id" @click="kfxq(item)">
          <div class="charitem_l">
            <!-- <img :src="pjimg(item.img)" alt=""> -->
            <vant-image
              width="100%"
              height="100%"
              :src="item.img==null||item.img==''?'':pjimg(item.img)"
            >
             <template v-slot:error>暂无头像</template>
            </vant-image>
          </div>
          <div class="charitem_r">
            <div class="charitem_bt">
              {{item.username}}
            </div>
            <div class="charitem_jl">
              {{item.personalprofile}}
            </div>
            <div class="">
              {{item.registertime}}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <vant-popup v-model="kefuShow" :style="{ height: '60%', width:'80%' }">
        <div class="char_de">
          <div class="char_de_img">
            <vant-image
              width="100%"
              height="100%"
              :src="kefu_de.img==null||kefu_de.img==''?'':pjimg(kefu_de.img)"
            >
             <template v-slot:error>暂无头像</template>
            </vant-image>
          </div>
          <div class="char_de_wz">
            <span>姓名:</span>
            {{kefu_de.username}}
          </div>
          <div class="char_de_wz">
            <span>简介:</span>
            {{kefu_de.personalprofile}}
          </div>
          <div class="char_de_wz">
            <span>电话:</span>
            {{kefu_de.phone}}
          </div>
          <div class="char_de_wz">
            <span>注册时间:</span>
            {{kefu_de.registertime}}
          </div>
          <div class="char_de_btn">
            <vant-button plain type="info" @click="tz_yhchar">联系客服</vant-button>
          </div>
        </div>
      </vant-popup>
    </div>
  </div>
</template>

<script>
import navbar from '../../components/common/navbar/NavBar'
import vantImage from "vant/lib/image";
import "vant/lib/image/style";
import vantPopup from "vant/lib/popup";
import "vant/lib/popup/style";
import vantButton from "vant/lib/button";
import "vant/lib/button/style";
export default {
  name:'YhCharList',
  data(){
    return{
      charlistBS:null,
      token:'',
      kefuInfo:[],
      kefuShow:false,
      kefu_de:{},
      iid:'',
      account_yh:'',
      shopname:'',
      shopimg:''
    }
  },
  mounted(){
    this.account_yh = window.localStorage.getItem('account_yh')
    this.token = window.localStorage.getItem('token')
    this.iid = this.$route.query.iid
    this.shopname = this.$route.query.shopname
    this.shopimg = this.$route.query.shopimg
    setTimeout(() => {
      this.charlistBS = new this.$BS(this.$refs.charlistBS,{
        click:true
      })
    }, 400);
    this.getKeFuInfo()
  },
  methods:{
    // 点击返回上一级页面
    RouterBack(){
      this.$router.go(-1)
    },
    // 请求在线客服数据
    getKeFuInfo(){
      this.$axios({
        method: 'post',
        url:'kefu/allinfo',
        data:this.$qs.stringify({token:this.token})
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }else{
          this.kefuInfo = res.data.data
          console.log(this.kefuInfo)
        }
      })
    },
    // 拼接头像
    pjimg(img){
      return this.website + img
    },
    // 选择对应客服
    kfxq(item){
      this.kefu_de = item
      this.kefuShow = true
    },
    // 跳转聊天界面
    tz_yhchar(){
      this.kefuShow = false
      setTimeout(()=>{
        this.$router.push({
          path:"/yhchar",
          query:{
            kui:`${this.kefu_de.account}_${this.account_yh}_${this.iid}`,
            shopname:this.shopname,
            shopimg:this.shopimg
          }
        })
      },200)
    }
  },
  components:{
    navbar,
    vantImage,
    vantPopup,
    vantButton
  }
}
</script>

<style scoped>
.navbar{
  background-color: #ff8198!important;
  color: white;
}

.charlist{
  width: 100%;
  height: calc( 100vh - 45px );
  overflow: hidden;
}

.charitem{
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: solid 2px #d6d3d3;
}
.charitem_l{
  width: 80px;
  height: 80px;
}
.charitem_l img{
  width: 100%;
  height: 100%;
}
.charitem_r{
  display: flex;
  flex-direction: column;
  width: calc(100% - 80px - 20px);
  justify-content: space-between;
}
.charitem_bt{
  font-size: 24px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.charitem_jl{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  color: #a7a1a1;
}


.char_de{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.char_de_img{
  width: 120px;
  height:120px;
}
.char_de_img img{
  width: 100%;
  height: 100%;
}
.char_de_wz{
  font-size: 22px;
  width: 100%;
  margin: 5px 0;
}
.char_de_btn{
  margin: 10px 0;
}
</style>