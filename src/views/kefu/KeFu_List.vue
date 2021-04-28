<template>
  <div>
    <navbar class="navbar">
      <div slot="center">聊天列表</div>
      <div slot="right" class="navbar_right">
        <vant-icon name="search" size='22' @click="tz_search"/>
      </div>
    </navbar>
    
    <div class="charlist" ref="charlistBS">
      <div class="char_box">
        
        <!-- 聊天列表 -->
        <div class="c_item"  v-for="item in kefuList" :key="item.id" @click="zt_kflist(item.kefu_user_iid)">
          <div class="c_item_l">
            <img :src="item.shopImg" alt="" @load="tpjz">
            <!-- <div class="hd"></div> -->
          </div>
          <div class="c_item_r">
            <div class="c-item_r_bt">
              商品名:{{item.shopName}}
            </div>
            <div class="c-item_r_timer">
              联系用户:{{item.user}}
            </div>
            <div class="c-item_r_cont">
              聊天室:{{item.iid}}
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import navbar from '../../components/common/navbar/NavBar'
import vantIcon from 'vant/lib/icon';
import 'vant/lib/icon/style';
export default {
  name:'KeFu_List',
  components:{
    navbar,
    vantIcon
  },
  data(){
    return{
      charlistBS:null,
      token2:'',
      kefuList:[]
    }
  },
  created(){
    this.token2 = localStorage.getItem('token2')
    this.getKefuList()
  },
  mounted(){
    // BS滚动
    this.charlistBS = new this.$BS(this.$refs.charlistBS,{
      probeType: 3,
      click:true
    })
  },
  methods:{
    // 搜索按钮
    tz_search(){
      this.$Toast('暂无开发')
    },
    // 请求客服列表 信息数据
    getKefuList(){
      this.$axios({
        method: 'post',
        url:'kefu/information',
        data:this.$qs.stringify({
          token2:this.token2
        }),
      }).then(res=>{
        this.kefuList = res.data.data
      })
    },
    // 图片加载回调
    tpjz(){
      this.charlistBS.refresh()
    },
    // 跳转聊天室
    zt_kflist(kui){
      this.$router.push({
        path:'/kfchar',
        query:{
          kui
        }
      })
    }
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


.navbar_right{
  display: flex;
  align-items: center;
  height: 100%;
}


.charlist{
  width: 100%;
  height: calc( 100vh - 44px - 50px );
  overflow: hidden;
}
.c_item{
  margin: 5px 0 ;
  height: 120px;
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  border-bottom: solid 2px #e2dfdf;
}
.c_item_l{
  width: 80px;
  height: 100px;
  position: relative;
}
.c_item_l img{
  width: 100%;
  height: 100%;
  border: solid #d6d6d6 4px;
  border-radius: 5px;
}
.hd{
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #f55249;
  z-index: 999;
  top: -1px;
  right: -3px;
}
.c_item_r{
  width: calc(100% - 80px - 10px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.c-item_r_bt{
  font-weight: bold;
  font-size:22px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.c-item_r_timer{
  font-size: 20px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.c-item_r_cont{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>