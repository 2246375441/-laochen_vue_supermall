<template>
  <div class="box">
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">地址列表</div>
    </navbar>

    <div class="boxBS" ref="boxBS">
      <div>
        <address-list
        :list="list"
        default-tag-text="默认"
        v-model="chosenAddressId"
        @add="RouterAddress"
        @edit="editAddress"
        @select="selectCallback"
        ref="addresslist"
        />
      </div>
    </div>

    <div class="addBotton">
      <button class="addBtn" @click="RouterAddress">添加地址</button>
    </div>
  </div>
</template>

<script>
import navbar from '../../components/common/navbar/NavBar'
import addressList from 'vant/lib/address-list'
import 'vant/lib/address-list/style'
export default {
  name:'AddressList',
  data(){
    return {
      chosenAddressId:'0',
      list: [],
      boxBS:null,
      // 判断是否从订单跳转过来
      order:false
    }
  },
  mounted(){
    this.getData()

    setTimeout(()=>{
      this.boxBS = new this.$BS(this.$refs.boxBS,{
        click:true
      })
    },100)

    this.order = this.$route.params.order
  },
  methods:{
    // 请求数据
    getData(){
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'address/list',
        data:this.$qs.stringify({token}),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
          return
        }else if(res.data.state ===200){
          let list = []
          for(let item in res.data){
            if(item.replace(/[^\d]/g,"")){
              list.push(res.data[item])
            }
          }
          let lsIndex = 0
          for(let i =0,len=list.length;i<len;i++){
            if(list[i].isDefault=="false" || list[i].isDefault==0 ||list[i].isDefault=="0"){
              list[i].isDefault = false
            }else{
              list[i].isDefault = true
              lsIndex = i
            }
          }
          let list2 = list.splice(lsIndex,1)
          this.list = [list2[0],...list]
        }
      })
    },
    // 点击返回上一级页面
    RouterBack(){
      // this.$router.go(-1)
      console.log(this.$route.params.order)
      if(this.$route.params.order=='true'){
        this.$router.replace({path:"/order"})
      }else{
        this.$router.replace({path:"/profile"})
      }
    },
    // 点击添加新地址
    RouterAddress(){
      this.$router.push({path:'/address'})
    },
    // 修改地址
    editAddress(item){
      item.urlIS = this.$route.params.order
      this.$router.push({ name:'address', params: item})
    },
    // 选中触发
    selectCallback(item){
      if(this.order==="true"){
        // console.log(item)
        this.$bus.$emit('AddressData',item)
        this.$router.replace({name:'order',params:item})
      }
    }
  },
  components:{
    navbar,
    addressList
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


.boxBS{
  width: 100%;
  height: calc( 100vh - 44px - 50px );
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;
}


.addBotton{
  width: 100%;
  height: 50px;
  background-color: #f8f8f8;
  display: flex;
  justify-content: center;
}
.addBtn{
  border: 0;
  background: linear-gradient(90deg,#ff6034,#ee0a24);
  width: 90%;
  height: 40px;
  margin-top: 5px;
  color: white;
  border-radius: 20px;
}
.van-button{
  display: none;
}
.van-address-list{
  padding-bottom: 0;
  margin-bottom: 0;
}


</style>
