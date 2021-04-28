import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
// 首页
const Home = () => import('../views/home/Home')
// 分类
const Category = () => import('../views/category/Category')
// 购物车
const Cart = () => import('../views/cart/Cart')
// 我的
const Profile = () => import('../views/profile/Profile')
// 商品详情
const Detail = () => import('../views/detail/Detail.vue')
// 登录
const Login = () => import('../views/login/Login')
// 个人设置
const ProfileSettings = () => import('../views/profile/ProfileSettings.vue')
// 确认订单
const ConfirmOrder = () => import('../views/confirm_order/ConfirmOrder.vue')
// 订单列表
const OrderList = () => import('../views/confirm_order/OrderList.vue')
// 地址添加
const Address = () => import('../views/address/Address.vue')
// 地址列表
const AddressList = () => import('../views/address/AddressList.vue')
// 优惠券
const Coupon = () => import('../views/profile/Coupon.vue')
// 订单详情
const OrderDetails = () => import('../views/confirm_order/OrderDetails.vue')
// 收藏
const Collection = () => import('../views/collection/Collection.vue')
// 历史记录
const History = () => import('../views/profile/History.vue')
// 我的积分
const Integral = () => import('../views/profile/Integral.vue')
// 提交Bug
const BugView = () => import('../views/bugview/BugView.vue')
// 客服登录
const KfLogin = () => import('../views/kefu/KfLogin.vue')
// 客服聊天
const KeFu_List = () => import('../views/kefu/KeFu_List.vue')
// 客服设置
const KeFu_Option = () => import('../views/kefu/KeFu_Option.vue')
// 客服用户聊天页面
const KeFu_char =  () => import('../views/kefu/KeFu_Char.vue')
// 用户(选客服列表)
const YhCharList =  () => import('../views/yh_char/YhCharList.vue')
// 用户(聊天页面)
const YhChar =  () => import('../views/yh_char/YhChar.vue')


const Login2 = () => import('../views/login/login2.vue')


// 客服 测试单元
const KeFu_CS =  () => import('../views/kefu/KeFu_CS.vue')


// 1安装插件
Vue.use(VueRouter)

// 2创建路由对象
const routes = [
  {
    path:'',
    redirect:'/home'
  },
  {
    path:'/home',
    component:Home,
  },
  {
    path:'/category',
    component:Category
  },
  {
    path:'/profile',
    component:Profile
  },
  {
    path:'/history',
    component:History
  },
  {
    path:'/collection',
    component:Collection
  },
  {
    path:'/cart',
    component:Cart
  },
  {
    // 动态路由
    path:'/detail/:iid',
    component:Detail
  },
  {
    path:'/login',
    component:Login,
    name:Login
  },
  {
    path:'/settings',
    component:ProfileSettings
  },
  {
    path:'/order',
    component:ConfirmOrder,
    name:'order'
  },
  {
    path:'/address',
    component:Address,
    name:'address'
  },
  {
    path:'/addresslist/:order',
    component:AddressList,
    name:'addresslist'
  },
  {
    path:'/coupon',
    component:Coupon
  },
  {
    path:'/orderlist',
    component:OrderList
  },
  {
    path:'/orderdeta/:id',
    component:OrderDetails
  },
  {
    path:'/integral',
    component:Integral
  },
  {
    path:'/bugview',
    component:BugView
  },
  {
    path:'/kflogin',
    component:KfLogin,
    name:KfLogin
  },
  {
    path:'/kflist',
    component:KeFu_List,
    name:'KeFu_List'
  },
  {
    path:'/kfoption',
    component:KeFu_Option,
    name:'KeFu_Option'
  },
  {
    path:'/kfchar',
    component:KeFu_char,
    name:'KeFu_char'
  },
  {
    path:'/kfcs',
    component:KeFu_CS,
    name:'KeFu_CS'
  },
  {
    path:'/yhlist',
    component:YhCharList,
    name:'YhCharList'
  },
  {
    path:'/yhchar',
    component:YhChar,
    name:'YhChar'
  },
  {
    path:'/login2',
    component:Login2,
    name:'Login2'
  },
  {
    path: '*',
    component: Home
  }

]

const router = new VueRouter({
  routes,
  // 去掉# 启动history模式
  // base: process.env.BASE_URL,
  // 打包上传开启history模式
  // mode:'history'
  mode:'hash'
})


// 3.导出
export default router
