<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" :is-checked="isChe" @click.native="checkCilck"></check-button>
      <span>全选</span>
    </div>

    <div class="price">
      合计:{{Math.floor(total * 100) / 100}}
    </div>

    <div class="calculate" @click="cartPayment">
      购买
    </div>
  </div>
</template>

<script>
import CheckButton from '../../../components/content/checkButton/CheckButton'
export default {
  name:'NewBottonBar',
  props:{
    NewCatrData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      // 全选框处于选中 还是未选中
      webBtn:false
    }
  },
  components:{
    CheckButton
  },
  computed: {
    // 显示是否全选状态
    isChe(){
      let sum = 0
      for(let i =0,len = this.NewCatrData.length;i<len;i++){
        if(this.NewCatrData[i].checked*1===1){
          sum = sum +1
        }
      }
      if(sum>0 && sum<this.NewCatrData.length*1){
        return false
      }else if(sum ==0){
        return false
      }else if(sum==this.NewCatrData.length*1){
        return true
      }
    },
    // 计算勾选综合价格
    total(){
      let total = 0
      for(let i = 0,len =this.NewCatrData.length;i<len;i++ ){
        if(this.NewCatrData[i].checked==="1"){
          total = total + (this.NewCatrData[i].nowPrice*1 * this.NewCatrData[i].total*1)
        }
      }
      return total
    }
  },
  mounted(){
    // 挂载监听 组件通知的 筛选之后的所有数据
    this.$bus.$on('filterOrderData',(data)=>{
      if(!this.$bus.orderData){
        this.$bus.orderData = data
      }else{
        this.$bus.$emit('orderDataEmit',data)
      }
      // console.log(this.$bus.orderData)
    })
  },
  beforeDestroy (){
    this.$bus.$off("filterOrderData");
  },
  methods: {
    // 点击全选
    checkCilck(){
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'cart/all',
        data:this.$qs.stringify({token}),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
          return
        }
        // console.log(res.data)
        this.webBtn = res.data.webBtn
        this.$bus.$emit('ItemGetData')
      })
    },
    // 购物车支付
    cartPayment(){
      if(window.localStorage.getItem('token')){
        // 存在
        // 向NewCatr组件 请求选中的数据
        if(this.total==0){
          // 当前用户没有选择商品
          this.$Toast('您目前没有选择商品,无法进行购买');
          return
        }
        this.$bus.$emit('getCart')
        this.$router.push({path:'/order',query:{
          p:'ca'
        }})
      }else{
        this.$Toast('您目前没有登录,无法进行操作');
      }
      
    }
  },
}
</script>

<style scoped>
.bottom-bar{
  border-top:solid 1px rgb(224, 224, 224);
  height: 40px;
  position: relative;
  background-color: rgb(242, 242, 242);
  display: flex;
  align-items: center;
}
.check-content{
  display: flex;
  align-items: center;
  height: 40px;
  margin-left: 10px;
}
.check-button{
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.price{
  margin-left: 20px;
}

.calculate{
  background-color: rgb(255, 129, 152);
  height: 100%;
  width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  color:white;
  position: absolute;
  right: 0;

}
</style>
