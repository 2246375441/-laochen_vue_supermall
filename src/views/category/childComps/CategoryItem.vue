<template>
  <div class="item-wk">
    <div v-for="(item,index) in subcategory.list" :key="index" class="item-nk">
        <a :href="item.link" >
          <img :src="item.image" :alt="item.title" class="item-img" @load="imgload">
          <div class="item-wz">{{item.title}}</div>
        </a>
    </div>
  </div>
</template>

<script>
export default {
  name:'CategoryItem',
  props:{
    subcategory:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  methods: {
    imgload(){
      this.$emit("imgload")
    }
  },
}
</script>

<style scoped>
.item-wk{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.item-nk{
  width: 30%;
  text-align: center;
  margin:10px 0;
}
.item-img{
  width: 80%;

}
</style>
