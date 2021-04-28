<template>
  <div class="cart-list" ref="cartBS">
      <div>
        <new-catr-item :showData="item" v-for="(item,i) in NewCatrData" :key="i" @imgload="imgload">
        </new-catr-item>
      </div>
  </div>
</template>

<script>
import NewCatrItem from './NewCatrItem'

export default {
  name:'NewCatr',
  components:{
    NewCatrItem
  },
  data(){
    return {
      // 购物车BS
      cartBS:null
    }
  },
  props:{
    NewCatrData: {
      type: Array,
      default: []
    }
  },
  mounted(){
    // 购物车挂载BS
    this.cartBS = new this.$BS(this.$refs.cartBS,{
      click:true
    })
    
    // 当触发该事件时  返回选中的所有数据  在内部触发 去告诉NewBottonBar组件 筛选后的数据
    this.$bus.$on('getCart',()=>{
      let filterData = this.NewCatrData.filter((item)=>{
        return item.checked ==="1" || item.checked === 1
      })
      // console.log(filterData)
      this.$bus.$emit('filterOrderData',filterData)
    })
  },
  beforeDestroy(){
    this.$bus.$off("getCart");
  },
  methods:{
    // 监听图片加载完毕 触发重新计算BS回调
    imgload(){
      this.cartBS.refresh()
    }
  },
  computed: {
    
  },
  destroyed(){

  }
}
</script>

<style scoped>
.cart-list{
  height: calc(100% - 44px - 49px - 40px);
  position: relative;
  overflow: hidden;
}
.content{
  height: 100%;
  overflow: hidden;
}
</style>