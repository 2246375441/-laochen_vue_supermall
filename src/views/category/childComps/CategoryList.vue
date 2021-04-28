<template>
  <div class="categorylist" ref="newScroll">
    <div>
      <li v-for="(item,index) in categoryList" :key="index" class="categorylist-li" @click="liClick(index)"
      :class="{liClass:index === isindex}"
      >{{item.title}}</li>
    </div>
  </div>
</template>

<script>
export default {
  name:'CategoryList',
  data() {
    return {
      ispd:false,
      isindex:0,
      bs:null
    }
  },
  props:{
    categoryList:{
      type:Array,
      default(){
        return []
      }
    }
  },
  mounted() {
    this.bs = new this.$BS(this.$refs.newScroll,{
      click:true,
      scrollY:true
    })
  },
  updated() {
    this.bs.refresh()
  },
  methods: {
    liClick(index){
      this.isindex = index
      this.$emit('liClick',index)
    }
  },

}
</script>

<style scoped>
.categorylist{
  height: calc(100vh - 49px - 44px);
  width: 100px;
  background-color:rgb(246, 246, 246);
  overflow:hidden;
  position: relative;
}
.categorylist-li{
  width: 100%;
  height: 60px;
  line-height: 60px;
  list-style: none;
  text-align: center;
}
.liClass{
  background-color:rgb(255, 255, 255);
  border-left:solid 4px rgb(255, 87, 119) ;
  font-weight: 900;
  font-size: 18px;
}
</style>
