<template>
   <div>
     <van-tabbar v-model="active" route v-show="isDom" active-color="#ff8198" inactive-color="#000"> 
       <van-tabbar-item name="home" icon="hot" to="/home" >首页</van-tabbar-item>
       <van-tabbar-item name="search" icon="gift-card" to="/category" >分类</van-tabbar-item>
       <van-tabbar-item name="friends" icon="shopping-cart" to="/cart"  :badge="cartTotal" >购物车</van-tabbar-item>
       <van-tabbar-item name="setting" icon="manager" to="/profile" >我的</van-tabbar-item>
     </van-tabbar>
   </div>
</template>

<script>
import Tabbar  from 'vant/lib/tabbar';
import 'vant/lib/tabbar/style';
import TabbarItem  from 'vant/lib/tabbar-item';
import 'vant/lib/tabbar-item/style';
export default {
  name:'MainTabBar',
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
        val.path === '/home' ||
        val.path === '/category' ||
        val.path === '/cart' ||
        val.path === '/profile' ||
        val.path === '/login'   
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

    // 初始化购物车数量
    this.$bus.$on('initCartTotal',(type)=>{
      if(type=='tc'){
        this.cartTotal = 0
      }else{
        this.getCartTotal()
      }
    })
  },
  beforeDestroy(){
    this.$bus.$off('getCartTotal')
    this.$bus.$off('initCartTotal')
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
