<template>
  <div class="bbtn">
    <div>合计:￥{{Math.floor(totalPrice * 100) / 100}}</div>
    <button @click="tiJiaoData">提交订单</button>
  </div>
</template>

<script>
export default {
  name:'BottomButton',
  props: {
    totalPrice: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  methods:{
    tiJiaoData(){
      this.$emit('tiJiaoData')
    }
  }
}
</script>

<style scoped>
.bbtn{
  width: 100%;
  height: 50px;
  background-color: white;
  display: flex;
  justify-content: space-around;
}
.bbtn div{
  font-size: 20px;
  line-height: 50px;
}
.bbtn button{
  background: linear-gradient(90deg,#ff6034,#ee0a24);
  height: 38px;
  margin-top: 6px;
  width: 110px;
  color: white;
  border-radius: 20px;
}
</style>