<template>
  <div>

    <div class="item" v-for="item in ListItem" :key="item.iid">
      <div class="item-l" v-show="seBottom">
        <checkbox v-model="item.is"/>
      </div>
      <div class="item-r" @click="routerDetail(item.iid)">
        <div class="item-img">
          <img :src="item.img" alt="" @load="imgLoad" >
        </div>
        <div class="item-nav">
          <div>{{item.title}}</div>
          <div>{{item.xl}}</div>
          <div>{{item.sc}}</div>
          <div class="item-jc">{{item.defaultPrice}}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Checkbox  from 'vant/lib/checkbox';
import 'vant/lib/checkbox/style';
export default {
  name:'ListItem',
  props: {
		ListItem: {
		  type: [Array],
      default() {
		    return []
      }
    },
    seBottom: {
		  type: [Boolean],
      default() {
		    return false
      }
    },
  },
  methods:{
    // 图片加载完成通知父组件
    imgLoad(){
      this.$emit('imgLoad')
    },
    // 跳转该商品
    routerDetail(iid){
      this.$router.push({path:'/detail/'+iid})
    }
  },
  components:{
    checkbox:Checkbox
  }
}
</script>

<style scoped>
.item{
  width: 100%;
  height: 130px;
  /* background-color: skyblue; */
  display: flex;
  align-items: center;
  padding: 7px;
  border-bottom: solid 2px rgb(206, 204, 204);
  margin-top: 10px;
}
.item-l{
  width: 20px;
  margin-right: 5px;
}
.item-r{
  width: calc( 100% - 20px );
  height: 100%;
  display: flex;
  /* background-color: green; */
}
.item-img{
  width: 97px;
  height: 115px;
  margin-right: 10px;
}
.item-img img{
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.item-nav{
  width: calc( 100% - 97px - 10px );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.item-nav div:nth-child(1){
  overflow:hidden;
  text-overflow: ellipsis;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  font-size: 16px;
  color: black;
}
.item-jc{
  font-size: 20px;
  color: red;
}

</style>