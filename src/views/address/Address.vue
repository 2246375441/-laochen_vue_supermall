<template>
  <div>
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">添加收货地址</div>
    </navbar>


    <div class="item">
      <van-address-edit
      :area-list="mapData"
      :show-set-default="true"
      :show-delete="isRouterDelete"
      :address-info = "AddressInfo"
      @save="saveCallback"
      @delete="deleteCallback"
      :tel-validator="validator"/>
    </div>

  </div>
</template>

<script>
import map from '../../assets/map/map.js'
import navbar from '../../components/common/navbar/NavBar'
import vanAddressEdit  from 'vant/lib/address-edit';
import 'vant/lib/address-edit/style';
export default {
  name:'Address',
  data(){
    return{
      // 地图数据
      mapData:map,
      // addressList中点击修改跳转过来  存储数据(存储初始化数据)
      AddressInfo:{},
      // 删除按钮是否显示
      isRouterDelete:false,
      urlIS:null
    }
  },
  methods:{
    // 点击返回上一级页面
    RouterBack(){
      this.$router.go(-1)
    },
    // 保存回调函数
    saveCallback(content){
      // console.log(content)
      let token = window.localStorage.getItem('token')
      let data ={
        token,
        name:content.name,
        tel:content.tel,
        address:content.province+content.city+content.county+content.addressDetail,
        isDefault:content.isDefault,
        province:content.province,
        city:content.city,
        county:content.county,
        addressDetail:content.addressDetail,
        areaCode:content.areaCode,
        id:content.id||null
      }

      this.$axios({
        method: 'post',
        url:'address/add',
        data:this.$qs.stringify(data),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
          return
        }
        if(!this.urlIS){
          this.urlIS = true
        }
        this.$router.replace({path:`/addresslist/${this.urlIS}`})
      })

    },
    // 删除确定回调函数
    deleteCallback(content){
      let token = window.localStorage.getItem('token')
      let data = {
        token,
        id:content.id
      }
      this.$axios({
        method: 'post',
        url:'address/dele',
        data:this.$qs.stringify(data),
      }).then(res=>{
        this.$router.replace({path:`/addresslist/${this.urlIS}`})
      })

    },
    //手机号码验证
    validator(e) {
      let myreg1 = /^[1][3,4,5,7,8][0-9]{9}$/;
      let myreg2 = /^[2][3,4,5,7,8][0-9]{6}$/;
      if (!myreg1.test(e) && !myreg2.test(e)) {
        console.log("手机号错误");
        return false;
      } else{
        console.log('手机号正确')
        return true
      }
    }
  },
  components:{
    navbar,
    vanAddressEdit
  },
  mounted(){
    // 获取从addressList跳转过来的数据
    this.AddressInfo = this.$route.params
    this.urlIS = this.$route.params.urlIS
    if(this.AddressInfo.id){
      this.isRouterDelete =true
    }else{
      this.isRouterDelete =false
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
  watch:{
    '$route'(){
      this.AddressInfo = this.$route.params
      this.urlIS = this.$route.params.urlIS
      if(this.AddressInfo.id){
        this.isRouterDelete =true
      }else{
        this.isRouterDelete =false
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

.item{
  margin: 0 auto;
  width: 100%;
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
  border-bottom: solid 2px#f8f8f8;
  /* background-color: yellowgreen; */
}

</style>
