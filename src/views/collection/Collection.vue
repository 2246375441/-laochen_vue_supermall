<template>
  <div class="Collection">
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center">我的收藏</div>
    </navbar>

    <!-- 搜索 -->
    <vant-search v-model="searchValue" placeholder="请输入搜索关键词" show-action @clear="onClear">
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </vant-search>

    <!-- 收藏列表 -->
    <div class="itemBoxBS" ref="itemBoxBS">
      <list-item @imgLoad="imgLoad" :ListItem="ListItem" :seBottom="seBottom"/>
    </div>

    <!-- 控制底下区域显示隐藏 -->
    <div class="se" @click="seBottomIs">
      <icon name="setting" size="30"  :color="seColor"/>
    </div>

    <!-- 全选/删除 -->
    <div class="seBottom" v-show="seBottom">
      <div class="seAll">
        <div style="margin-right:10px" v-show="!switchDisabled">全选:</div>
        <vantswitch v-model="allChe" @change="switchChange"  size="24px" v-show="!switchDisabled"/>
      </div>
      <!-- 删除按钮 -->
      <icon name="delete" size="30" @click="deleteBtn" :color="deleteColor"/>
    </div>
  </div>
</template>

<script>
import navbar from '../../components/common/navbar/NavBar'
import ListItem from './childComps/ListItem'
import Search from 'vant/lib/search';
import 'vant/lib/search/style';
import Icon from 'vant/lib/icon';
import 'vant/lib/icon/style'
import Switch from 'vant/lib/switch'
import 'vant/lib/switch/style'
export default {
  name:'Collection',
  data(){
    return{
      // 搜索
      searchValue:'',
      // 收藏列表滚动
      itemBoxBS:null,
      // 全选
      allChe:false,
      // 底下区域是否显示
      seBottom:false,
      // 控制按钮颜色
      seColor:'#abaeb3',
      // 收藏列表数据
      ListItem:[],
    }
  },
  mounted(){
    this.itemBoxBS = new this.$BS(this.$refs.itemBoxBS,{
      click:true
    })
    // 请求收藏数据
    this.getListItem()

  },
  methods:{
    // 点击返回上一级页面
    RouterBack(){
      this.$router.go(-1)
    },
    // 搜索事件
    onSearch(){
      this.getListItem(this.searchValue)
    },
    // 搜索框取消事件
    onClear(){
      this.getListItem()
    },
    // 图片加载完成
    imgLoad(){
      this.itemBoxBS.refresh()
    },
    // 控制底下是否显示
    seBottomIs(){
      this.seBottom = !this.seBottom
      if(this.seBottom){
        let dh = this.$refs.itemBoxBS.offsetHeight
        this.$refs.itemBoxBS.style.height= (dh - 50) + 'px'
        this.seColor = '#000000'
      }else{
        let dh = this.$refs.itemBoxBS.offsetHeight
        this.$refs.itemBoxBS.style.height= (dh + 50) + 'px'
        this.seColor = '#abaeb3'
      }
      this.itemBoxBS.refresh()
    },
    // 请求收藏列表数据
    getListItem(search){
      this.ListItem = []
      let token = window.localStorage.getItem('token')
      let data = null
      if(search){
        data = this.$qs.stringify({token,search})
      }else{
        data = this.$qs.stringify({token})
      }
      this.$axios({
        method: 'post',
        url:'collection/list',
        data:data,
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }
        if(res.data.data){
          for(let i=0,len=res.data.data.length;i<len;i++){
            res.data.data[i].is = false
          }
        }
        this.ListItem = res.data.data
      })
    },
    // 全选开关按钮
    switchChange(value){
      if(!this.ListItem){
        return
      }
      for (let i = 0; i < this.ListItem.length; i++) {
        this.ListItem[i].is = value
      }
    },
    // 删除按钮
    deleteBtn(){
      if(!this.ListItem){
        return
      }
      // 过滤is为true的商品
      let newList = this.ListItem.filter(item=>{
        return item.is ===true
      })
      // 过滤商品多余属性
      let newIid = newList.map((item)=>{
        return {iid:item.iid}
      })
      if(newIid.length ===0){
        return
      }
      this.$Dialog.confirm({
      message: '您确定移除这些吗?',
    }).then(() => {
      let token = window.localStorage.getItem('token')
      let data = this.$qs.stringify({token,newIid,total:newIid.length})
      this.$axios({
        method: 'post',
        url:'collection/alldelete',
        data:data,
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
        }
        this.allChe = false
        this.getListItem()
      })
    })
     .catch(() => {
      return
    });
    }
  },
  components:{
    navbar,
    vantSearch:Search,
    ListItem:ListItem,
    icon:Icon,
    vantswitch:Switch
  },
  computed:{
    deleteColor(){
      if(!this.ListItem){
        return '#abaeb3'
      }
      for (let i = 0; i < this.ListItem.length; i++) {
        if(this.ListItem[i].is===true){
          return '#000000'
        }else{
          return '#abaeb3'
        }
      }
    },
    // 全选滑块关闭还是开启
    switchDisabled(){
      if(!this.ListItem){
        return true
      }else{
        return false
      }
    }
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
  }
}
</script>

<style scoped>
.Collection{
  width: 100%;
  height: 100vh;
  position: relative;
}
.navbar{
  background-color: #ff8198!important;
  color: white;
}

.itemBoxBS{
  height: calc( 100vh - 50px - 60px );
  width: 100%;
  overflow: hidden;
  position: relative;
}

.se{
  display: flex;
  align-items: center;
  position: absolute;
  right: 20px;
  bottom: 100px;
  z-index: 999;
  background-color: white;
  border-radius: 50%;
  box-shadow: 1px 1px 5px rgb(165, 160, 160);
}

.seBottom{
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
.seAll{
  font-size: 20px;
  display: flex;
  width: 140px;
  height: 100%;
  align-items: center;
}
</style>
