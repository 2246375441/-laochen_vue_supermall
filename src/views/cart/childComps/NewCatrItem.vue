<template>
  <div id="shopping-cart-list-item" ref="item">
    <div class="item-selector">
      <check-button  @click.native="checkClick(showData)" :is-checked="showData.checked*1===0?false:true">
      </check-button>
    </div>
    <div class="item-img" @click="showDetail(showData)">
      <img :src="showData.img" alt="商品图片" />
    </div>
    <div class="item-info">
      <div class="item-name" @click="showDetail(showData)">
        <img src="../../../assets/img/profile/vip.svg" height="48" width="48" @load="imgload"/>
        {{showData.shopName}}
      </div>
      <div class="item-desc" @click="showDetail(showData)">
        {{showData.Fashion}}
      </div>
      <div class="item-msg" @click="showDetail(showData)">
        类别：{{showData.style}}, 
        尺码：{{showData.size}}
       
      </div>
      <div class="info-bottom">
        <div class="item-price left" @click="showDetail(showData)">
          ¥ {{showData.nowPrice}}
        </div>
        <div class="item-count right">
          <div @click="decrease(showData)">－</div>
          <div>{{showData.total}}</div>
          <div @click="increase(showData)">＋</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckButton from "../../../components/content/checkButton/CheckButton";
export default {
  name: "NewCatrItem",
  props: {
    showData: {
      type: Object,
      default: {}
    }
  },
  components: {
    CheckButton
  },
  methods: {
    //1、改变商品的选中状态
    checkClick(item) {
      //修改store里面的数据一定要经过mutations，否则调试插件监控不到
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'cart/che',
        data:this.$qs.stringify({
          token,
          id:item.id
        }),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
          return
        }
        // 通知父组件更新数据
        this.$bus.$emit('ItemGetData')
      })
    },
    //2、点击商品可再次进入详情页
    showDetail(item) {
      this.$router.push("/detail/" + item.iid);
    },

    //3、增加商品数量
    increase(item) {
      //调用mutations里面的增加方法
      // this.$store.commit('SET_ADD',item)
      let token = window.localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url:'cart/totaladd',
        data:this.$qs.stringify({
          token,
          id:item.id
        }),
      }).then(res=>{
        if(res.data.state ===400){
          // token 过期或解析失败
          window.localStorage.removeItem('token')
          return
        }
        // 通知父组件更新数据
        this.$bus.$emit('ItemGetData')
      })
    },

    //4、减少商品数量
    decrease(item) {
      let token = window.localStorage.getItem('token')
      let tj = ()=>{
        this.$axios({
          method: 'post',
          url:'cart/totalreduce',
          data:this.$qs.stringify({
            token,
            id:item.id
          }),
        }).then(res=>{
          if(res.data.state ===400){
            // token 过期或解析失败
            window.localStorage.removeItem('token')
            return
          }
          // 通知父组件更新数据
          this.$bus.$emit('ItemGetData')
        })
      }
      if(item.total==="1"){
        // 进行删除
        this.$Dialog.confirm({
          // title: '标题',
          message: '您确定移除该商品吗?',
        }).then(() => {
          tj()
        }).catch(()=>{
          return
        })
        return
      }else{
        tj()
      }
    },
    // 图片更新 触发父组件重新计算BS
    imgload(){
      this.$emit('imgload')
    }
  },
  mounted(){

  }
};
</script>

<style scoped>
  #shopping-cart-list-item {
    width: 100%;
    display: flex;
    font-size: 0;
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }

  .item-selector {
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item-name img {
    width: 20px;
    height: 20px;
    vertical-align: text-bottom;
  }

  .item-name{
    display: flex;
  }
  
  .item-desc {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .item-desc {
    text-align: left;
  }

  .item-msg {
    text-align: left;
    color: var(--color-high-text);
    font-size: 13px;
    margin-top: 7px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .item-img {
    padding: 5px;
  }

  .item-img img {
    width: 80px;
    height: 110px;
    display: block;
    border-radius: 5px;
  }

  .item-info {
    width: 100%;
    text-align: center;
    font-size: 17px;
    color: #333;
    padding: 5px 10px;
    position: relative;
    overflow: hidden;
  }

  .item-info .item-desc {
    font-size: 14px;
    color: #666;
    margin-top: 7px;
  }

  .info-bottom {
    margin-top: 7px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .info-bottom .item-price {
    color: orangered;
  }

  .item-count {
    margin-top: 10px;
    display: flex;
    text-align: center;
    height: 25px;
    width: auto;
  }
  .item-count div{
    height: 23px;
    line-height: 23px;
    outline: none;
    background-color: #fff;
    border: none;
    border: 1px solid rgba(0, 0, 0, 0.7);
    border-collapse: collapse;
    width: 30px;
  }
  .item-count div:last-child {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
  }
  .item-count div:first-child {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }
  .item-count div:nth-child(2) {
    border-right: none;
    border-left: none;
  }


</style>

