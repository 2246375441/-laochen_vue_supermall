<template>
  <div class="order">
    <!-- 顶部 -->
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">确认订单</div>
    </navbar>
    <!-- 地址处理 -->
    <div class="address">
      <!-- 没有地址时 显示dom -->
      <div class="addressno" v-if="!addressDom" @click="routerAddress">
        <div>
          <span>+</span>
          <span>添加地址</span>
        </div>
        <div>
          <i class="iconfont icon-jiantouyou"></i>
        </div>
      </div>

      <!-- 有地址时 显示dom -->
      <div class="addressjg" v-else>
        <div>
          <i class="iconfont icon-ren"></i>
        </div>
        <div>
          <h4>{{ AddressData.name }}</h4>
          {{ AddressData.tel }} <br />
          <div class="info">{{ AddressData.address }}</div>
        </div>
        <div>
          <i class="iconfont icon-shuben" @click="routerAddressList"></i>
        </div>
      </div>
    </div>

    <!-- 优惠券 -->
    <coupon @onChangeCoupon="onChangeCoupon" :totalPrice="totalPrice" ref="couponRef"/>

    <div ref="orderBS" class="orderBS">
      <div>
        <!-- 商品 -->
        <div
          class="item"
          v-for="item in commodityData"
          :key="item.img + item.style + item.size"
        >
          <div class="item-header">
            <i class="iconfont icon-dianpu"></i>
            {{ item.shopName }}
          </div>
          <div class="item-box">
            <div class="item-l">
              <img :src="item.img" alt="" @load="imgload" />
            </div>
            <div class="item-r">
              <div class="item-r-title">
                {{ item.Fashion }}
              </div>
              <div class="item-r-box">
                <div>样式:{{ item.style }}</div>
                <div>尺码:{{ item.size }}</div>
                <div>
                  共{{ item.total }}件
                  <span
                    >￥{{
                      Math.floor(item.total * item.nowPrice * 100) / 100
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <bottom-button :totalPrice="totalPrice" @tiJiaoData="tiJiaoData"/>
  </div>
</template>

<script>
import navbar from "../../components/common/navbar/NavBar";
import BottomButton from "./childComps/BottomButton";
import Coupon from "./childComps/Coupon";
export default {
  name: "ConfirmOrder",
  data() {
    return {
      // BS
      orderBS: null,
      // 是否显示地址 还是 添加地址
      addressDom: false,
      // 存储地址数据
      AddressData: {},
      // 存储商品数据
      commodityData: [],
      // 已选优惠券
      Coupon:{},
      // 实际消费
      PaidIn:0
    };
  },
  mounted() {
    this.orderBS = new this.$BS(this.$refs.orderBS, {
      click: true,
    });
    // 判断请求数据还是使用路由传递参数
    this.getOrRoute();

    // 初始化传递过来的商品数据(从购物车传递的数据)
    // console.log(this.$bus.orderData)
    this.commodityData = this.$bus.orderData;
    this.$bus.$on("orderDataEmit", (data) => {
      this.commodityData = data;
      this.$bus.orderData = data;
      this.orderBS.refresh();
    });

    // 修改地址数据
    this.$bus.$on("AddressData", (data) => {
      this.AddressData = data;
    });

    // 触发购物券组件
    setTimeout(() => {
      this.$refs.couponRef.showListClick(false)
    }, 1000);
  },
  methods: {
    // 点击返回上一级页面
    RouterBack() {
      if(this.$route.query.p=='ca'){
        this.$router.replace({path:'/cart'})
      }else if(this.$route.query.p=='de'){
        this.$router.replace({path:'/detail/'+this.$route.query.iid})
      }else{
        if(!this.$bus.backOrderPath.p){
          this.$router.go(-1)
        }else{
          if(this.$bus.backOrderPath.p=='ca'){
            this.$router.replace({path:'/cart'})
          }else if(this.$bus.backOrderPath.p=='de'){
            this.$router.replace({path:'/detail/'+this.$bus.backOrderPath.iid})
          }
        }
      }
    },
    routerAddress() {
      this.$bus.backOrderPath = this.$route.query
      this.$router.push({ path: "/address" });
    },
    routerAddressList() {
      this.$bus.backOrderPath = this.$route.query
      this.$router.push({ path: "/addresslist/true" });
    },
    // 判断请求数据还是使用路由传递参数
    getOrRoute() {
      if (this.$route.params.id) {
        this.AddressData = this.$route.params;
        this.addressDom = true;
      } else {
        this.getAddress();
      }
    },
    // 请求地址数据
    getAddress() {
      this.AddressData = {}
      let token = window.localStorage.getItem("token");
      this.$axios({
        method: "post",
        url: "address/list",
        data: this.$qs.stringify({ token }),
      }).then((res) => {
        if (res.data.state === 400) {
          // token 过期或解析失败
          window.localStorage.removeItem("token");
          return;
        }
        if (res.data.state === 300) {
          // console.log('没有地址')
          this.addressDom = false;
        } else if (res.data.state === 200) {
          // console.log('有地址')
          this.addressDom = true;
          // 循环所有数据 看是否有默认数据
          // 没有则选择第一个数据
          let i = false;
          for (const key in res.data) {
            if (
              res.data[key].isDefault === true ||
              res.data[key].isDefault == "true" ||
              res.data[key].isDefault === 1 ||
              res.data[key].isDefault === "1"
            ) {
              this.AddressData = res.data[key];
              i = true;
            }
          }
          if (!i) {
            // console.log(res.data)
            this.AddressData = res.data[0];
          }
        }
      });
    },
    imgload() {
      // 图片加载完成触发
      this.orderBS.refresh();
    },
    // 选择优惠券触发
    onChangeCoupon(data){
      this.Coupon = data
      // console.log(this.Coupon)
    },
    // 提交订单 给服务器
    tiJiaoData(){
      if (!this.commodityData){
        this.$Toast('没有商品,提交订单失败！');
        return
      }
      if (!this.addressDom){
        this.$Toast('请优先把地址设置完毕,再提交订单');
        return
      }
      let token = window.localStorage.getItem("token");
      // 判断上传商品数量 是否大于 1
      if(this.commodityData.length===1){
        this.commodityData[0].PaidIn = this.PaidIn
      }else{
        // 判断用户是否使用优惠券
        if(this.Coupon.value){
          let couponValue = (this.Coupon.value*1) / 100 / (this.commodityData.length*1)
          let n = Math.floor(couponValue * 100) / 100;
          for(let i=0,len=this.commodityData.length;i<len;i++){
            this.commodityData[i].PaidIn = Math.floor((this.commodityData[i].nowPrice*this.commodityData[i].total-n) * 100) / 100;
          }
        }else{
          for(let i=0,len=this.commodityData.length;i<len;i++){
            this.commodityData[i].PaidIn =Math.floor((this.commodityData[i].nowPrice*this.commodityData[i].total) * 100) / 100;
          }
        }
      }
      // 处理数据 统一交给服务器
      let commodityLength = this.commodityData.length
      const data = {
        address:this.AddressData,
        commodity:this.commodityData,
        coupon:this.Coupon,
        token,
        commodityLength
      }
      this.$axios({
        method: "post",
        url: "order/add",
        data: this.$qs.stringify(data),
      }).then((res) => {
        if (res.data.state === 400) {
          // token 过期或解析失败
          window.localStorage.removeItem("token");
          return;
        }else if(res.data.state===200){
          // 购买成功回调 提示框
          this.$Dialog.alert({
            message: '购买成功',
          }).then(() => {
            this.$router.replace({path:'/orderlist'})
            // 更新最底部导航条 购物车小红标志
            this.$bus.$emit('getCartTotal')
          });
        }
      });
    }
  },
  components: {
    navbar,
    BottomButton,
    Coupon,
  },
  computed: {
    totalPrice() {
      let j = 0;
      if (this.commodityData) {
        for (let i = 0, len = this.commodityData.length; i < len; i++) {
          let n = this.commodityData[i].total * this.commodityData[i].nowPrice;
          let ns = Math.floor(n * 100) / 100;
          j = j + ns;
        }
        if(this.Coupon.value){
          j = j - (this.Coupon.value*1 / 100)
        }
      }
      this.PaidIn = j
      return j
    },
  },
  // 钩子执行前，组件实例还没被创建
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
    '$route'(item){
      // 判断item.params是否是空对象
      let is = null
      if (Object.keys(item.params).length  == 0) {
        is =  true
      } else {
        is = false
      }


      if(!this.addressDom){
        this.getAddress()
      }
      if(is == true){
        this.addressDom = false
        this.getAddress()
      }
      
    }
  }
};
</script>

<style scoped>
.order {
  width: 100%;
  height: 100vh;
  background-color: #f8f8f8;
}
.navbar {
  background-color: #ff8198 !important;
  color: white;
}

.orderBS {
  margin-top: 10px;
  height: calc(100vh - 44px - 60px - 80px - 10px - 50px );
  position: relative;
  overflow: hidden;
}

.address {
  height: 80px;
  width: 100%;
  background-color: white;
  font-size: 24px;
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
  line-height: 80px;
  padding: 0 30px;
  border-bottom: 4px solid #48a0f9;
}

.addressno {
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.addressno div:nth-child(1) {
  line-height: 40px;
}
.addressno div:nth-child(1) span:nth-child(1) {
  width: 40px;
  height: 40px;
  background-color: #1989fa;
  display: inline-block;
  text-align: center;
  color: white;
  border-radius: 5px;
  margin-right: 20px;
}
.addressno div:nth-child(1) span:nth-child(2) {
  font-size: 18px;
  color: black;
}

.addressjg {
  display: flex;
  /* align-items: center; */
  position: relative;
  width: 90%;
}
.addressjg div:nth-child(1) i {
  font-size: 25px;
}
.addressjg div:nth-child(2) {
  margin-top: 16px;
  font-size: 16px;
  margin-left: 20px;
  line-height: 24px;
}
.addressjg div:nth-child(2) h4 {
  display: inline-block;
  margin-right: 20px;
}
.addressjg div:nth-child(3) {
  position: absolute;
  right: 0;
}
.addressjg div:nth-child(3) i {
  font-size: 24px;
}

.item {
  width: 94%;
  height: 210px;
  margin: 0 auto;
  /* background-color: skyblue; */
  margin-top: 20px;
  border-radius: 20px;
  box-shadow: 1px 1px 3px rgb(212, 206, 206);
}
.item-header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  border-radius: 20px 20px 0 0;
  padding-left: 20px;
  background-color: white;
  border-bottom: 5px solid #f8f8f8;
}
.item-box {
  width: 100%;
  height: 170px;
  background-color: white;
  border-radius: 0 0 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-l {
  margin-left: 20px;
  width: 90px;
  height: 130px;
  background-color: red;
  border-radius: 8px;
}
.item-l img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.item-r {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.item-r-title {
  width: 200px;
  margin-right: 20px;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 18px;
}
.item-r-box {
  height: 90px;
  width: 200px;
  border-top: solid 1px rgb(185, 170, 170);
  /* background-color: yellowgreen; */
  padding-top: 20px;
}
.item-r-box div {
  font-size: 17px;
  color: #bfabab;
  margin-bottom: 4px;
}
.item-r-box div span {
  color: red;
}

.info {
  width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
