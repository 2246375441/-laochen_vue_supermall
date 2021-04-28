<template>
  <div id="app">
    <keep-alive exclude="Detail,
    CategoryData,Login,Profile,Profile,Cart,
    Address,AddressList,Order,Collection,Integral,ProfileSettings,OrderDetails,KeFu_Char,YhChar,YhCharList">
        <router-view></router-view>
    </keep-alive>
    <main-tab-bar></main-tab-bar>
    <ke-fu-tab-bar></ke-fu-tab-bar>
  </div>
</template>

<script>
import MainTabBar from 'components/content/mainTabbar/MainTabBar'
import KeFuTabBar from 'components/content/KeFuTabbar/KeFuTabBar'

export default {
  name: 'App',
  data(){
    return{
    }
  },
  components: {
    MainTabBar,
    KeFuTabBar
  },
  mounted(){
    let token = window.localStorage.getItem('token')
    this.$axios({
      method: 'post',
      url:'token',
      data:this.$qs.stringify({token}),
    }).then(res=>{
      if(res.data.state ===400){
        window.localStorage.removeItem('tokne')
        return
      }
    })
  },
  watch:{
    // $route(to,form){
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      // if(to.meta.index > from.meta.index){
  	  // //设置动画名称
      //   this.transitionName = 'slide-left';
      // }else{
      //   this.transitionName = 'slide-right';
      // }
      // if(to.fullPath==='/home'){
      //   this.transitionName = 'slide-left'
      // }
    // }   
  }
}
</script>

<style scoped>
  @import "assets/css/base.css";
  .view {
  	width: 100%;
	  position: absolute;
  }
	.slide-right-enter-active,
	.slide-right-leave-active,
	.slide-left-enter-active,
	.slide-left-leave-active {
	  will-change: transform;
	  transition: all 250ms;
	  position: absolute;
	}
	.slide-right-enter {
	  opacity: 0;
	  transform: translate3d(-100%, 0, 0);
	}
	.slide-right-leave-active {
	  opacity: 0;
	  transform: translate3d(100%, 0, 0);
	}
	.slide-left-enter {
	  opacity: 0;
	  transform: translate3d(100%, 0, 0);
	}
	.slide-left-leave-active {
	  opacity: 0;
	  transform: translate3d(-100%, 0, 0);
	}
</style>
