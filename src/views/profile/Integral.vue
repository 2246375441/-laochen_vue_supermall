<template>
  <div>
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">我的积分</div>
    </navbar>

    <div class="coreBs" ref="coreBs">
      <div>
        <!-- 积分 -->
        <div class="jf">
          <div class="y1">
            <div class="y2">
              <div class="y3">
                <div>积分余额</div>
                <div>{{Math.floor(integral * 100) / 100}}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 兑换按钮 -->
        <div class="dh">
          <v-button plain hairline type="info" round @click="dhBtn">
            兑换
          </v-button>
        </div>

        <!-- 账户明细标志 -->
        <div class="item-header">
          账户明细
        </div>

        <!-- 积分历史记录 -->
        <div class="item" v-for="item in integralData" :key="item.id">
          <div>{{item.record}}</div>
          <div>
            <div>{{item.new_data}}</div>
            <span>{{item.modify}}{{item.num}}</span>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import lcData from '../../tool/data.js'
import navbar from '../../components/common/navbar/NavBar'
import VButton  from 'vant/lib/button';
import 'vant/lib/button/style';
export default {
  name:'Integral',
  data(){
    return{
      coreBs:null,
      // 积分
      integral:0,
      // 积分历史操作数据
      integralData:[]
    }
  },
  mounted(){
    this.coreBs = new this.$BS(this.$refs.coreBs,{
      click:true
    })

    this.getIntegral()
    this.getIntegralData()
  },
  methods:{
    // 点击返回上一级页面
    RouterBack(){
      this.$router.go(-1)
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
        this.integral = res.data.data.integral * 1
      })
    },
    // 请求积分历史记录
    getIntegralData(){
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'integral/coreHis',
        data:this.$qs.stringify({token}),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }
        if(!res.data.data){
          return
        }
        for (let i = 0,len = res.data.data.length; i < len; i++) {
          res.data.data[i].new_data = lcData.format(res.data.data[i].opertime*1,'/',true)
        }
        this.integralData = res.data.data.reverse()
        this.$nextTick(()=>{
          this.coreBs.refresh()
        })
      })
    },
    // 兑换按钮
    dhBtn(){
      this.$Toast('兑换功能正在开发中~')
    }
  },
  components:{
    navbar,
    VButton
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
.navbar{
  background-color: #ff8198!important;
  color: white;
}

.coreBs{
  width: 100%;
  height: calc( 100vh - 44px );
  overflow: hidden;
  position: relative;
}

.jf{
  width: 320px;
  height: 260px;
  margin: 0 auto;
  padding-top: 30px;
  /* background-color: skyblue; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.y1{
  width: 250px;
  height: 250px;
  border: solid 8px #b8eaff;
  background-color: #57ccff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.y2{
  width: 220px;
  height: 220px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.y3 div:nth-child(1){
  font-size: 34px;
  color:#009ff1;
  font-weight:bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.y3 div:nth-child(2){
  font-size: 50px;
  color:#009ff1;
  font-weight:bold;
  text-align: center;
}


.dh{
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.van-button--normal{
  width: 300px !important;
  border-radius: 20px;
}
.van-button__text{
  color: #15a9f3 !important;
  font-size: 24px;
  /* font-weight: bold; */
}

.item-header{
  width: 100%;
  height: 36px;
  background-color: #f0f1ec;
  line-height: 36px;
  font-size: 18px;
  padding-left: 10px;
  margin-top: 15px;
  font-weight: bold;
  color: black;
}

.item{
  width: 100%;
  height: 100px;
  border-bottom: solid 2px #e8e8e8;
  padding:10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.item div:nth-child(1){
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  font-size: 20px;
  color: black;
}
.item div:nth-child(2){
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.item div:nth-child(2) div{
  font-size: 16px;
}
.item div:nth-child(2) span{
  font-size: 24px;
}
</style>
