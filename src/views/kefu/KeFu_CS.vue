<template>
  <div>
    <div class="box"></div>
  </div>
</template>

<script>
export default {
  name:'KeFu_CS',
  mounted(){
    console.dir(this.$anime)
    var myAnimation = this.$anime({
      targets: ['.box'],
      bottom:'60px',
      opacity:'1',
      duration: 750
    });
  },
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不能获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
    if(window.localStorage.getItem('token2')){
      next()
    }else{
      next('/kflogin')
    }
  },
}
</script>

<style scoped>
.box{
  position: fixed;
  opacity: 0;
  bottom: -100px;
  width: 100px;
  height: 100px;
  background-color: skyblue;
}
</style>