<template>
  <div class="wk">
    <!-- v-if="isDetaInfo" -->
    <div class="info" v-if="isDetaInfo.isInfo">
      <div class="infocon">
        <div class="infoClose" @click="infoClose">❌</div>

        <!-- 头部内容 -->
        <div class="infoNav">
          <div class="infoIMG">
            <i class="iconfont icon-fangda"></i>
            <img :src="showImg" alt="" class="infoImgClass" @click="imgDomKQ(showImg)">
          </div>
          <div class="infoTitle">
            <div class="infoTitleFont1"><span>￥</span>{{showPrice}}</div>
            <div class="infoTitleFont2">库存{{stock}}</div>
            <div class="infoTitleFont2">选择样式：{{Fashion}}</div>
          </div>
        </div>

          <div class="DetaInfoScroll" ref="DetaInfoBS">
            <div ref="DetaInfoBSChi">
              <!-- 样式选择区域 -->
              <div class="infoClassData">
                <div>{{skuInfo.props[0].label}}</div>
                <div class="infoClassDataItem">
                  <button class="infoClassDataItemDiv"  v-for="(item) in skuInfo.props[0].list" :key="item.styleId" @click="ListId0(item)" :class="{active:currentIndex1===item.styleId}">{{item.name}}</button>
                </div>
              </div>
              <div class="infoClassData">
                <div>{{skuInfo.props[1].label}}</div>
                <div class="infoClassDataItem">
                  <button class="infoClassDataItemDiv"  v-for="(item) in skuInfo.props[1].list" :key="item.sizeId" @click="ListId1(item)" :class="{active:currentIndex2===item.sizeId}">{{item.name}}</button>
                </div>
              </div>
              <div class="infoClassData">
                <div style="margin-bottom: 5px">数量:</div>
                <div class="infoClassDataItem2">
                  <div class="infoClassDataItem2_left" @click="Jian">-</div>
                  <input type="Number" v-model="total" class="infoClassDataItem2_content">
                  <div class="infoClassDataItem2_right" @click="Jia">+</div>
                </div>
                <div class="ts">{{ts}}</div>
              </div>
            </div>
          </div>
          
      </div>

      <!-- 确定 -->
      <div class="infoEnter" @click="handGO">确定</div>
    </div>
  </div>
</template>

<script>
import Scroll from "../../../components/common/scroll/Scroll";
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      shopData:{},
      currentIndex1:1,
      currentIndex2:100,
      // 数量少于1 提示
      ts:'',
      // 临时存储选择商品数据
      showItem:{},
      // 价格
      nowPrice:0,
      // 库存
      stock:0,
      // 选择样式:
      Fashion:'',
      // 购买数量
      total:1,
      // 点击购买之后 选择样式BS
      DetaInfoBS:null
    };
  },
  props: {
    isDetaInfo: {
      type: Object,
      default() {
        return {isInfo:false,type:''};
      }
    },
    skuInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    shop: {
      type: Object,
      default() {
        return {};
      }
    },
    iid:{
      type:[String,Number],
      default(){
        return 'NO'
      }
    }
  },
  mounted() {
    this.$bus.$on('DetaInfoBS',()=>{
      this.$nextTick(()=>{
        let wk = this.$refs.DetaInfoBS.offsetHeight
        let nk = this.$refs.DetaInfoBSChi.offsetHeight
        if (wk<nk){
          this.DetaInfoBS = new this.$BS(this.$refs.DetaInfoBS,{
            click:true,
          })
          // this.$bus.$emit('disableBS')
        }
      })
    })
  },
  beforeDestroy() {
    this.DetaInfoBS = null
    this.$bus.$off('DetaInfoBS')
  },
  methods: {
    ...mapActions([
      'CART_ADD'
    ]),
    // 点击关闭X 发送隐藏flase
    infoClose() {
      this.$emit("infoClose");
    },
    // 存储颜色 分类id
    ListId0(item){
      this.currentIndex1 = item.styleId
    },
    ListId1(item){
      this.currentIndex2 = item.sizeId
    },
    Jia(){
      if (this.total >=1) {
        this.total ++
      }
    },
    Jian(){
      if (this.total == 1) {
        this.ts = "最少购买一件";
          setTimeout(() => {
            this.ts = "";
          }, 1000)
      }else{
        this.total --
      }
    },
    // 添加购物车
    handGO(){
      // console.log(this.isDetaInfo.type)
      if(this.isDetaInfo.type==="car"){
        let token = window.localStorage.getItem('token')
        const ShowObj = {
          // Item:this.showItem,
          iid:this.iid,
          shopName:this.shop.name,
          nowPrice:this.nowPrice,
          Fashion:this.skuInfo.title,
          total:this.total,
          img:this.showItem.img,
          style:this.showItem.style,
          size:this.showItem.size,
          checked:false,
          token
        }
        let newShowObj =  this.$qs.stringify(ShowObj)

        this.$axios({
          method: 'post',
          url:'cart/add',
          data:newShowObj,
        }).then(res=>{
          if(res.data.state ===400){
            // token 过期或解析失败
            window.localStorage.removeItem('token')
          }
        })
        // 通知关闭该组件
        this.$emit("infoClose");
        // 提示加入购物车
        // this.$toast.show('加入购物车',1500)
        // 提示更新购物车小红标
        this.$emit('getCollection')
        // 更新最底部导航条 购物车小红标志
        this.$bus.$emit('getCartTotal')
      }else if(this.isDetaInfo.type==="order"){
        const ShowObj = {
          // Item:this.showItem,
          iid:this.iid,
          shopName:this.shop.name,
          nowPrice:this.nowPrice,
          Fashion:this.skuInfo.title,
          total:this.total,
          img:this.showItem.img,
          style:this.showItem.style,
          size:this.showItem.size,
          // checked:false,
          // token
        }

        // 将 订单页商品数据 存储在 this.$bus.orderData 中 为 [{}]
        if(!this.$bus.orderData){
          this.$bus.orderData = [ShowObj]
        }else{
          this.$bus.$emit('orderDataEmit',[ShowObj])
        }

        this.$router.push({path:'/order',query:{
          p:'de',
          iid:this.iid
        }})
      }
      
    },
    // 点击图片 通知父组件 将图片放大
    imgDomKQ(imgUrl){
      this.$emit('imgDomKQ',imgUrl)
    }
  },
  computed: {
    // 图片显示
    showImg(){
      // console.log(this.skuInfo.skus)
      const list = this.skuInfo.skus
      var bl = ''
      list.forEach((item,i) => {
        // console.log(item)
        if (item.styleId ==this.currentIndex1 && item.sizeId ==this.currentIndex2) {
          // console.log(item)
          this.showItem = item
          // console.log(this.showItem)
          return bl = item.img
        }
      });
      return bl
    },
    // 价格 和 库存 样式
    showPrice(){
      var price = this.showItem.nowprice.toString()
      const startStr = price.substr(0, (price.length - 2));
      const endTwoStr = price.substr((price.length - 2), 2);
      this.nowPrice = startStr + '.' + endTwoStr;
      // 库存
      this.stock = this.showItem.stock
      // 样式
      this.Fashion = this.showItem.style +' '+this.showItem.size
      return this.nowPrice
    }
  },
  components: {
    Scroll
  }
};
</script>

<style scoped>
.info {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  animation: infoAni 0.4s ease;
}

.info .infocon {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60vh;
  background-color: #fff;
  padding: 7px;
  animation: infoAni 0.7s ease;
  display: flex;
  flex-direction: column;
}

.infoClose {
  height: 20px;
  width: 100%;
  font-size: 20px;
  text-align: right;
  /*animation: infoAni 0.6s ease-out;*/
}

@keyframes infoAni {
  0% {
    /*height: 0;*/
    opacity: 0;
  }
  100% {
    /*height: 60vh;*/
    opacity: 1;
  }
}


.infoNav {
  width: 100%;
  height: 90px;
}

.infoIMG {
  width: 100px;
  height: 130px;
  background-color: cadetblue;
  position: absolute;
  top: -35px;
  left: 10px;
}
.infoIMG i{
  right: 0;
  font-size: 20px;
  color: rgb(243, 237, 237);
  background-color: #4e2a29;
  position: absolute;
}
.infoImgClass{
  width: 100%;
  height: 130px;
}
.infoTitle {
  width: 200px;
  height: 110px;
  position: absolute;
  top: 0px;
  left: 120px;
}
.infoTitle .infoTitleFont1 {
  font-size: 30px;
  color: black;
  margin: 5px;
}
.infoTitle .infoTitleFont1 span {
  font-size: 15px;
}
.infoTitle .infoTitleFont2 {
  font-size: 14px;
  color: rgb(137, 137, 137);
  margin: 5px;
}

.infoClassData {
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
}
.infoClassDataItem {
  display: flex;
  flex-wrap: wrap;
}
.infoClassDataItemDiv {
  border: solid 1px rgb(137, 137, 137);
  padding: 5px 10px 5px 10px;
  margin: 5px 10px 5px 10px;
  border-radius: 8px;
  background-color: white;
}

.infoClassDataItem2 {
  display: flex;
  flex-wrap: wrap;
}
.infoClassDataItem2 div {
  display: flex;
  flex-wrap: wrap;
  width: 40px;
  border: solid 1px rgb(137, 137, 137);
  padding: 5px 10px 5px 10px;
  display: flex;
  justify-content: center;
}
.infoClassDataItem2_left {
  border-radius: 8px 0 0 8px;
}
.infoClassDataItem2_right {
  border-radius: 0 8px 8px 0;
}
.infoClassDataItem2_content{
  width:40px;
  text-align: center;
}

.infoEnter {
  width: 100%;
  height: 50px;
  background-color: #ff5771;
  position: fixed;
  bottom: 0;
  left: 0;
  text-align: center;
  line-height: 50px;
  color: #fff;
  font-size: 17px;
}


.ts{
  font-size: 13px;
  margin-top: 3px;
}

.DetaInfoScroll{
  height: 230px;
  overflow: hidden;
  position: relative;
}
</style>
