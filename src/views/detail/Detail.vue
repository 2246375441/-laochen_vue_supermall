<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>

    <div class="delailBS" ref="delailBS">
      <div>
        <vant-swiper :banners="topImages" />
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
        <detail-param-info :paramInfo="paramInfo" ref="params"></detail-param-info>
        <deta-comment-info :commentInfo="commentInfo" ref="comment"></deta-comment-info>
        <goods-list :goods="recommends" ref="recommend"></goods-list>
      </div>
    </div>

    <back-top @click.native="backClick" v-show="isShowBackTo"></back-top>
    <vant-deta-bottom-bar @addToCart="addToCart" @isDetaInfo="isDetaInfo" @collection="collection" :iid="iid" :shopname="shopname" :shopimg="shopimg" ref="bottomBar"/>
    <deta-info :isDetaInfo="isInfo" :skuInfo="skuInfo" :shop="shop" :iid="iid" @infoClose="infoClose" @imgDomKQ='imgDomKQ' @getCollection="getCollection"></deta-info>

    <div class="imgDom" @click="imgDomGb" v-show="imgDomIs" ref="imgDom">
      <img :src="imgDomUrl" alt="">
    </div>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetaCommentInfo from './childComps/DetaCommentInfo'
import VantSwiper from './childComps/VantSwiper'
import DetaInfo from './childComps/DetaInfo'
import BackTop from '../../components/content/backTop/BackTop'
import Scroll from '../../components/common/scroll/Scroll'
import {getDetail,Goods,Shop,GoodsParam,getRecommend} from '../../network/detail.js'
import {debounce} from '../../common/utils'
import GoodsList from '../../components/content/goods/GoodsList'
import VantDetaBottomBar from './childComps/VantDetaBottomBar'

export default {
  name:'Detail',
  data() {
    return {
      iid:null,
      topImages:[],
      goods:{},
      shop:{},
      detailInfo:{},
      paramInfo:{},
      commentInfo:{},
      recommends:[],
      themeTopYs:[],
      getThemeTopY:null,
      positionY:0,
      currentIndex:0,
      isShowBackTo:false,
      // 购物车数据
      skuInfo:{},
      // 加入购物车显示隐藏
      isInfo:{isInfo:false,type:''},
      //详情bs
      delailBS:null, 
      // 图片是否放大
      imgDomIs:false,
      // 放大图片URL
      imgDomUrl:'',
      // 商品名字
      shopname:'',
      // 商品图片
      shopimg:''
    }
  },
  created() {
    // 1 保存传入的iid
    this.iid = this.$route.params.iid

    // 2 根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 简写 const data = res.data.result
       const data = res.data.result

      // 1.获取顶部图片 轮播数据
      this.topImages = data.itemInfo.topImages

      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

      // 3.创建店铺信息
      this.shop = new Shop(data.shopInfo)

      // 4. 保存商品详情信息
      this.detailInfo = data.detailInfo

      // 5.保存参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule||{})

      // 6.保存评论信息
      if(data.rate.cRate !== 0){
        this.commentInfo = data.rate.list[0]
      }
      // 7. 获取商品 加入购物车时 选择框内部数据
      this.skuInfo = {...data.skuInfo,title:this.goods.title}

      // 添加历史记录
      this.historyAdd()

      this.shopname = this.goods.title
      this.shopimg = this.topImages[0] 
    }),

    // 3 请求推荐数据
    getRecommend().then(res => {
      // console.log(res)
      this.recommends = res.data.data.list
    })


      // 4 给getThemeTopY赋值  进行防抖
    this.getThemeTopY = debounce(() => {
        this.themeTopYs=[]
        // navbar 点击跳转
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop-44)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44)
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log('true2')
    })
  },
  components:{
    DetailNavBar,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetaCommentInfo,
    GoodsList,
    BackTop,
    DetaInfo,
    VantSwiper,
    VantDetaBottomBar
    // Toast
  },
  methods: {
    imageLoad(){
      this.delailBS.refresh()

      this.getThemeTopY()
    },
    titleClick(index){
      this.delailBS.scrollTo(0,-this.themeTopYs[index],100)
    },
    contentScroll(position){
      const positionY = -position.y

      let length = this.themeTopYs.length

      for(let i=0;i<length;i++){

        // DetailNavBar滚动到 位置时  改变  [商品，参数，评论，推荐]
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }

      }

      // 判断 返回按钮backTop 隐藏还是现实
      this.isShowBackTo = position.y <-1000
    },
    backClick(){
      this.delailBS.scrollTo(0,0,500)
    },
    addToCart(){
      // 1 获取购物车 需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // 2 将商品添加到购物车里(使用了vuex)
      this.$store.dispatch('addCart',product).then(res => {

        this.$toast.show(res,1500)
        console.log(res)
      })
    },
    // 加入购物车的显示与隐藏
    isDetaInfo(isInfo){
      // console.log(isInfo);
      this.isInfo = isInfo
    },
    infoClose(){
      this.isInfo.isInfo = false
    },
    imgDomGb(){
      this.$refs.imgDom.style.opacity = 0
      this.$refs.imgDom.style.transitionDuration = '0.5s'
      setTimeout(() => {
        this.imgDomIs = false
      },600);
    },
    imgDomKQ(imgUrl){
      this.imgDomUrl = imgUrl
      this.imgDomIs = true
      setTimeout(() => {
        this.$refs.imgDom.style.opacity = 1
        this.$refs.imgDom.style.transitionDuration = '0.5s'
      },0);
    },
    // 点击收藏/取消收藏
    collection(type){
      let token = window.localStorage.getItem('token')
      let data = {
        iid:this.iid,
        xl:this.goods.columns[0],
        sc:this.goods.columns[1],
        img:this.topImages[0],
        title:this.skuInfo.title,
        priceRange:this.skuInfo.priceRange,
        defaultPrice:this.skuInfo.defaultPrice,
        token,
        type
      }
      let newData = this.$qs.stringify(data)
      this.$axios({
        method: 'post',
        url:'collection/love',
        data:newData,
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        } 
        // 触发 子组件 事件
        this.$refs.bottomBar.getLoveKG()
      })
      
    },
    // 添加历史记录
    historyAdd(){
      let token = window.localStorage.getItem('token')
      let data = {
        iid:this.iid,
        xl:this.goods.columns[0],
        sc:this.goods.columns[1],
        img:this.topImages[0],
        title:this.skuInfo.title,
        priceRange:this.skuInfo.priceRange,
        defaultPrice:this.skuInfo.defaultPrice,
        shopName:this.shop.name,
        token
      }
      let newData = this.$qs.stringify(data)
      this.$axios({
        method: 'post',
        url:'history/add',
        data:newData,
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }
      })
    },
    // 通知子组件更新购物车小红标
    getCollection(){
      this.$refs.bottomBar.carTotal()
    }
  },
  mounted() {
    // 详情页BS滚动
    this.delailBS = new this.$BS(this.$refs.delailBS,{
      probeType: 3,
      click:true
    })
    this.delailBS.on('scroll',(position) => {
      let y = position.y
      let length = this.themeTopYs.length
      for(let i=0;i<length;i++){
        // DetailNavBar滚动到 位置时  改变  [商品，参数，评论，推荐]
        if(this.currentIndex !== i && (-y >= this.themeTopYs[i] && -y < this.themeTopYs[i+1])){
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      // 判断 返回按钮backTop 隐藏还是现实
      this.isShowBackTo = y <-1000
    })
  },
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
}
</script>

<style>
#detail{
  position: relative;
  z-index: 999;
  background-color: #fff;
  height: 100vh;

}

.contenthe{
  height: calc(100% - 44px - 52px);
}
.delailBS{
  height: calc(100% - 44px - 58px);
  overflow: hidden;
  position: relative;
}

.detail-nav{
  position: relative;
  z-index: 999;
  background-color: #fff;
}


.imgDom{
  position: fixed;
  top: 0;
  z-index: 999999;
  background-color: black;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  opacity:0;
}
.imgDom img{
  width: 100%;
  height: 84%;
}
</style>
