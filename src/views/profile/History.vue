<template>
  <div class="box">
    <navbar class="navbar">
      <div class="back" slot="left">
        <i class="iconfont icon-fanhui backCss" @click="RouterBack"></i>
      </div>
      <div slot="center"><div>历史记录<span @click="allDelete" v-show="isAllDelete">(点我全清)</span></div></div>
    </navbar>

    <div class="search">
      <van-search
        v-model="seatchValue"
        placeholder="请输入搜索关键词"
        clearable
        show-action
        @clear="onClear"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </div>

    <div class="itemBox" ref="itemBoxBS">
      <div>
        <div
          class="item"
          @click="RouterOrderDetails(item.iid)"
          v-for="item in historyData"
          :key="item.id"
        >
          <div class="item-l">
            <img :src="item.img" alt="" @load="imgLoad" />
          </div>
          <div class="item-r">
            <div class="item-bt">{{ item.title }}</div>
            <div>店铺:{{ item.shopName }}</div>
            <div>{{ item.sc }} {{ item.xl }}</div>
            <div>
              ￥<span>{{ item.defaultPrice }}</span>
            </div>
            <div class="item-r-dele" @click.stop="deleteBtn(item.id)">
              <i class="iconfont icon-shanchu"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>



<script>
import vanSearch from "vant/lib/search";
import "vant/lib/search/style";
import navbar from "../../components/common/navbar/NavBar";
export default {
  name: "Order",
  components: {
    navbar,
    vanSearch,
  },
  data(){
    return {
      // 搜索关键字
      seatchValue: "",
      itemBoxBS: null,
      historyData: [],
    };
  },
  mounted(){
    this.getData();

    this.itemBoxBS = new this.$BS(this.$refs.itemBoxBS, {
      click: true,
    });
  },
  methods:{
    // 点击返回上一级页面
    RouterBack() {
      this.$router.go(-1);
    },
    // 搜索按钮
    onSearch() {
      this.getData(this.seatchValue);
    },
    // 取消按钮
    onClear() {
      this.getData();
    },
    // 请求数据
    getData(search) {
      this.historyData = [];
      let token = window.localStorage.getItem("token");
      let tjData = null;
      if (search) {
        tjData = { token, search };
      } else {
        tjData = { token };
      }
      let new_tjData = this.$qs.stringify(tjData);
      this.$axios({
        method: "post",
        url: "history/list",
        data: new_tjData,
      }).then((res) => {
        if (res.data.state === 400) {
          // token 过期或解析失败
          window.localStorage.removeItem("token");
        }
        if(!res.data.data){
          return
        }
        this.historyData = res.data.data.sort((a,b)=>{
          return  b.id - a.id 
        })
      });
    },
    // 图片加载监听
    imgLoad() {
      this.itemBoxBS.refresh();
    },
    // 跳转订单详情页
    RouterOrderDetails(OrderId) {
      this.$router.push({ path: "/detail/" + OrderId });
    },
    // 移除该历史记录
    deleteBtn(id){
      this.$Dialog.confirm({
      message: '您确定移除该商品历史记录吗?',
      })
      .then(() => {
        let token = window.localStorage.getItem('token')
        this.$axios({
          method: 'post',
          url:'history/delete',
          data:this.$qs.stringify({token,id}),
        }).then(res=>{
          if(res.data.state ===400){
            // token 过期或解析失败
            window.localStorage.removeItem('token')
          }
          this.getData()
        })
      })
      .catch(() => {
        return
      });
    },
    // 移除全部
    allDelete(){
      if(this.historyData.length===0){
        return
      }
      this.$Dialog.confirm({
        message: '您确定清空历史记录吗?',
      })
        .then(() => {
          let idArr = this.historyData.map(item=>{
            return {id:item.id}
          })
          let token = window.localStorage.getItem('token')
          let data = {
            token,
            idArr,
            total:idArr.length
          }
          this.$axios({
            method: 'post',
            url:'history/delete',
            data:this.$qs.stringify(data),
          }).then(res=>{
            if(res.data.state ===400){
              // token 过期或解析失败
              window.localStorage.removeItem('token')
            }
            this.getData()
          })
        })
        .catch(() => {
          return
        });
    }
  },
  computed:{
    isAllDelete(){
      if(this.historyData.length===0){
        return false
      }else{
        return true
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
};
</script>

<style scoped>
.box {
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  /* background-color: skyblue; */
}

.navbar {
  background-color: #ff8198 !important;
  color: white;
}

.search {
  width: 100%;
  height: 55px;
}

.itemBox {
  width: 100%;
  height: calc(100vh - 45px - 55px - 10px);
  position: relative;
  overflow: hidden;
}

.item {
  width: 94%;
  height: 100px;
  margin: 15px auto 0 auto;
  display: flex;
}

.item-l {
  width: 88px;
  height: 100px;
}
.item-l img {
  border-radius: 10px;
  width: 100%;
  height: 100%;
}

.item-r {
  width: calc(100% - 88px);
  padding-left: 7px;
  font-size: 13px;
  /* font-weight: bold; */
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
}
.item-r div:nth-child(2) {
  color: #a79f9f;
}
.item-r div:nth-child(3) {
  color: #a79f9f;
}
.item-r div:nth-child(4) span {
  font-size: 22px;
  color: red;
  margin-right: 15px;
}

.item-bt {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}


.item-r-dele{
  position: absolute;
  bottom: 0;
  right: 0;
}
.item-r-dele i{
  font-size: 28px;
  color: #afa8a8;
}

</style>