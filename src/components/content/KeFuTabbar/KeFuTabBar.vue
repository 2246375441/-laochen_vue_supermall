<template>
   <div>
     <van-tabbar v-model="active" route v-show="isDom" active-color="#ff8198" inactive-color="#000"> 
       <van-tabbar-item name="home" icon="comment" to="/kflist" >消息列表</van-tabbar-item>
       <van-tabbar-item name="home" icon="manager" to="/kfoption">个人设置</van-tabbar-item>
     </van-tabbar>
   </div>
</template>

<script>
import Tabbar  from 'vant/lib/tabbar';
import 'vant/lib/tabbar/style';
import TabbarItem  from 'vant/lib/tabbar-item';
import 'vant/lib/tabbar-item/style';
export default {
  name:'KeFuTabbar',
  components:{
    VanTabbar:Tabbar,
    VanTabbarItem:TabbarItem
  },
  data(){
    return {
      isDom:null,
      active:'',
      cartTotal:0
    }
  },
  watch: {
    // 监听路径,决定是否隐藏该DOM
    '$route' (val, old) {
      // 当前路由
      if(
        val.name === 'KeFu_List' ||
        val.name === 'KeFu_Option' 
      ){
        this.isDom = true
      }else{
        this.isDom = false
      }
    }
  },
  mounted(){
    this.getCartTotal()
    // 绑定在加入购物车
    this.$bus.$on('getCartTotal',()=>{
      this.getCartTotal()
    })
  },
  beforeDestroy(){
    this.$bus.$off('getCartTotal')
  },
  methods:{
    getCartTotal(){
      this.cartTotal = 0
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'cart/total',
        data:this.$qs.stringify({token}),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }
        this.cartTotal = res.data.total
      })
    }
  }
}
</script>

<style scoped>

</style>
