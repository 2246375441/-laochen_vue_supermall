<template>
  <div class="wk" v-if="Object.keys(categoryitemtab).length !== 0">
    <div v-for="(item,index) in categoryitemtab[categorytab].data" :key="index" class="wkitem" @click="itemClick(index)">
      <div class="wkitem-dw">
        <img v-lazy="item.img" alt="" class="wkitem-img" ref="itemImg" @load="imgload">
        <div class="wkitem-wzq">
          <div class="wkitem-wz">{{item.title}}</div>
          <div>
            ￥ {{item.price}}☆ {{item.cfav}}
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
export default {
  name:'CategoryItemTab',
  props:{
    categoryitemtab:{
      type:Object,
      default(){
        return  {}
      }
    },
    categorytab:{
      type:String,
      default(){
        return  'pop'
      }
    }
  },
  methods: {
    itemClick(index){
      const iid = this.categoryitemtab[this.categorytab].data[index].iid
      this.$router.push("/detail/" + iid);

      // 发送数据到vuex 中 mutations
      // 通过mutations中的rex函数 修改 index中的rexData
      // CategoryData 去获取 修改完毕后的 rexData 数据


    },
    imgload(){
      this.$emit("imgload")
    }
  },
}
</script>

<style scoped>
.wk{
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.wkitem{
  width: 47%;
  /* height: 248px; 图片高度+40px*/
  height: 248px;
  margin-bottom: 5px;
}
.wkitem-dw{
  position: relative;
  height: 100%;
}
.wkitem-img{
  width: 100%;
}
.wkitem-wzq{
  width: 100%;
  position: absolute;
  bottom: 0;
  text-align: center;
}
.wkitem-wz{
  width: 20vh;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
