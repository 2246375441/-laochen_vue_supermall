<template>
  <div class="Profile" ref="ProfileBS">
    <div>
      <profile-home :userInfo='userInfo' :imgSrc='imgSrc'></profile-home>
      <profile-core></profile-core>
      <profile-core-bottom></profile-core-bottom>
    </div>
  </div>
</template>

<script>
import NavBar from '../../components/common/navbar/NavBar'
import ProfileHome from './childComps/ProfileHome'
import ProfileCore from './childComps/ProfileCore'
import ProfileCoreBottom from './childComps/ProfileCoreBottom'

export default {
  name:'Profile',
  components:{
    NavBar,
    ProfileHome,
    ProfileCore,
    ProfileCoreBottom
  },
  mounted(){
    // 开启滚动
    this.ProfileBS = new this.$BS(this.$refs.ProfileBS,{
      click:true
    })
    this.getData()

    this.initUser()
  },
  data(){
    return {
      //整个页面滚动bs,
      ProfileBS:null,
      //请求数据
      userInfo:{},
      //头像地址
      imgSrc:''
    }
  },
  methods: {
    // this.$toast.show('个人模块木有开发！',2000)
    // 请求数据
    getData(){
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'user/info',
        data:this.$qs.stringify({token}),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }
        this.userInfo = res.data
        let uuid = (((1+Math.random())*0x10000)|0).toString(16).substring(1) + (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        this.imgSrc = this.website+this.userInfo.img + `?uuid=` + uuid
      })
    },
    // 初始化数据
    initUser(){

    }
  },
}
</script>

<style scoped>
.Profile{
  background-color: #f7f7f7;
  height: calc( 100vh - 50px );
  position: relative;
  overflow: hidden;
}
</style>
