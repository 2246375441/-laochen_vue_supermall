<template>
  <div class="bottom-bar">
    <vga>
      <vgai icon="chat-o" text="客服"  dot @click="routerCustomer "/>
      <vgai icon="cart-o" text="购物车" :badge="cartTotal" @click="routerCart"/>
      <vgai icon="star-o" text="收藏" @click="collection('true')" v-show="loveKG"/>
      <vgai icon="star" color="red" text="已收藏" @click="collection('false')" v-show="!loveKG"/>
      <vgab type="warning" text="加入购物车" @click="isDetaInfo('car')"/>
      <vgab type="danger" text="立即购买" @click="isDetaInfo('order')"/>
    </vga>
  </div>
</template>

<script>
import GoodsAction  from 'vant/lib/goods-action';
import 'vant/lib/goods-action/style';
import GoodsActionIcon  from 'vant/lib/goods-action-icon';
import 'vant/lib/goods-action-icon/style';
import GoodsActionButton  from 'vant/lib/goods-action-button';
import 'vant/lib/goods-action-button/style';

export default {
  name:'DetaBottomBar',
  data() {
    return {
      isInfo:false,
      cartTotal:0,
      loveKG:false
    }
  },
  props: {
	  iid: {
	    type: String,
      default() {
	      return ''
      }
    },
    shopname: {
	    type: String,
      default() {
	      return ''
      }
    },
    shopimg: {
	    type: String,
      default() {
	      return ''
      }
    },
  },
  mounted(){
    // 获取购物车下有多少订单
    this.carTotal()

    // 初始化 收藏按钮和取消按钮
    this.getLoveKG()
    
  },
  methods: {
    // 加入购物车/立即购买事件
    isDetaInfo(type){
      this.isInfo = true
      this.$emit('isDetaInfo',{isInfo:this.isInfo,type:type})
      // 打开商品样式选择区域的BS
      this.$bus.$emit('DetaInfoBS')
    },
    // 请求购物车下订单量
    carTotal(){
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
    },
    // 跳转购物车
    routerCart(){
      this.$router.push({path:'/cart'})
    },
    // 跳转客服
    routerCustomer(){
      this.$router.push({
        path:'/yhlist',
        query:{
          iid:this.iid,
          shopname:this.shopname,
          shopimg:this.shopimg
        }
      })
    },
    // 收藏按钮事件
    collection(type){
      this.$emit('collection',type)
    },
    // 添加收藏 或 取消收藏
    getLoveKG(){
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'collection/initialization',
        data:this.$qs.stringify({token,iid:this.iid}),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }
        if(res.data.state===200){
          this.loveKG = false
        }else if(res.data.state===201){
          this.loveKG = true
        }
      })
    }
  },
  components:{
    vga:GoodsAction,
    vgai:GoodsActionIcon,
    vgab:GoodsActionButton
  }
}

</script>

<style scoped>
.bottom-bar {
  height: 45px ;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  text-align: center;
}
</style>
