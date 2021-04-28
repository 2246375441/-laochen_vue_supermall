<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{NewCatrData.length}})</div>
    </nav-bar>

    <!-- 新商品列表 -->
    <new-catr :NewCatrData='NewCatrData'></new-catr>

    <!-- 新的底部汇总 -->
    <new-botton-bar :NewCatrData='NewCatrData'></new-botton-bar>

  </div>
</template>

<script>
import NavBar from '../../components/common/navbar/NavBar'
import NewCatr from './childComps/NewCatr'
import NewBottonBar from './childComps/NewBottonBar'


export default {
  name:'Cart',
  components:{
    NavBar,
    NewCatr,
    NewBottonBar
  },
  computed: {
    // 商品数量
    totalMax(){
      return this.$store.state.shop.showData.length
    }
  },
  data(){
    return{
      NewCatrData:[]
    }
  },
  mounted(){
    this.getData()

    // 子组件勾选 或 取消勾选触发 
    this.$bus.$on('ItemGetData',()=>{
      this.getData()
    })
  },
  methods:{
    // 请求购物车数据
    getData(){
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'cart/cart',
        data:this.$qs.stringify({token}),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
          return
        }
        this.NewCatrData = res.data
      })
    }
  },
}
</script>

<style scoped>
.cart{
  height: 100vh;
}
.nav-bar{
  background-color: var(--color-tint);
  color: #fff;
}
</style>
