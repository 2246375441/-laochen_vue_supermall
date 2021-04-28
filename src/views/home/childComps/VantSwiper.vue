<template>
  <van-swipe class="my-swipe" :autoplay="1500" indicator-color="white">
    <van-swipe-item v-for="item in banners" :key="item.acm">
      <img v-lazy="item.image" class="banImg"/>
    </van-swipe-item>
  </van-swipe>
</template>

<script>
import Swipe  from 'vant/lib/swipe';
import 'vant/lib/swipe/style';
import SwipeItem   from 'vant/lib/swipe-item';
import 'vant/lib/swipe-item/style';
	export default {
    name: "VantSwiper",
    props: {
		  banners: {
		    type: Array,
        default: []
      }
    },
    components:{
      vanSwipe:Swipe,
      vanSwipeItem:SwipeItem
    }
	}
</script>

<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  height: 195px;
}
.banImg{
  width: 100%;
  height: 100%;
}
</style>
