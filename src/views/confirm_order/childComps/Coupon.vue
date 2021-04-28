<template>
  <div class="coupon">
    <!-- 优惠券单元格 -->
    <van-coupon-cell
      :coupons="coupons"
      :chosen-coupon="chosenCoupon"
      @click="showListClick(true)"
    />
    <!-- 优惠券列表 -->
    <van-popup
      v-model="showList"
      round
      position="bottom"
      style="height:90%; padding-top: 4px;"
      
    >
      <van-coupon-list
        :coupons="coupons"
        :chosen-coupon="chosenCoupon"
        :disabled-coupons="disabledCoupons"
        @change="onChange"
        @exchange="onExchange"
      />
    </van-popup>
  </div>
</template>

<script>
import vanCouponCell  from 'vant/lib/coupon-cell';
import 'vant/lib/coupon-cell/style';
import vanCouponList  from 'vant/lib/coupon-list';
import 'vant/lib/coupon-list/style';
import vanPopup  from 'vant/lib/popup';
import 'vant/lib/popup/style';
export default {
  name:'Coupon',
  components:{
    vanCouponCell,
    vanCouponList,
    vanPopup
  },
  props: {
    totalPrice: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      chosenCoupon: -1,
      coupons: [],
      disabledCoupons: [],
      showList:false,
      couponsData:[]
    }
  },
  mounted(){
    this.getData()
  },
  methods: {
    // 请求数据
    getData(){
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'coupon/list',
        data:this.$qs.stringify({token}),
      }).then(res=>{
        if(res.data.state ===400){
          window.localStorage.removeItem('token')
        }
        // this.coupons = res.data.data
        // this.disabledCoupons = res.data.data
        this.couponsData = res.data.data
      })
    },
    onChange(index) {
      this.showList = false;
      this.chosenCoupon = index;

      // console.log(this.coupons[index])
      this.$emit('onChangeCoupon',this.coupons[index])
    },
    onExchange(code) {
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'coupon/add',
        data:this.$qs.stringify({token,activationCode:code}),
      }).then(res=>{
        this.showList = false
        if(res.data.state===300){
          // 激活码无效
          this.$Dialog.alert({
            message: '激活码无效',
          })
        }else if(res.data.state===301){
          // 激活码上限
          this.$Dialog.alert({
            message: '激活码使用上限',
          })
        }else if(res.data.state===200){
          // 激活成功
          this.$Dialog.alert({
            message: '激活成功',
          }).then(()=>{
            this.getData()
            this.showListClick()
          })
        }
      })
    },
    showListClick(type){
      // 处理数据
      // console.log(this.totalPrice)
      this.disabledCoupons = []
      this.coupons = []
      for(let i =0,len=this.couponsData.length;i<len;i++){
        if(this.couponsData[i].max * 1 < this.totalPrice * 1){
          this.coupons.push(this.couponsData[i])
        }else{
          this.disabledCoupons.push(this.couponsData[i])
        }
      }

      this.showList = type
    }
  },
};
</script>

<style scoped>
.coupon{
  margin-top: 10px;
}
</style>