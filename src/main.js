import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import toast from './components/common/toast'
import BScroll from 'better-scroll'

import axios from 'axios'

import anime from 'animejs' // anime动画插件


// 导入验证码模块
import GVerify from './tool/yzm.js'

//引用iconfont
import './assets/iconfont/iconfont.css'

// import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

// vant dialog弹框
import { Dialog,Toast } from 'vant'
import 'vant/lib/dialog/style'
import 'vant/lib/toast/style'
Vue.use(Dialog);
Vue.use(Toast);
Vue.prototype.$Dialog = Dialog
Vue.prototype.$Toast = Toast

//绑定better-scroll到实例上
Vue.prototype.$BS = BScroll

// 绑定axios事件请求地址
// let baseURL = 'http://127.0.0.1:3000/'
let baseURL = "http://chenxinlong.xyz:60106"

// 绑定服务器域名地址
// Vue.prototype.website = 'http://127.0.0.1:3000/'
Vue.prototype.website = "http://chenxinlong.xyz:60106/"

// 绑定客服聊天地址
// Vue.prototype.kf_ws = 'ws://127.0.0.1:60107/'
Vue.prototype.kf_ws = "ws://chenxinlong.xyz:60107/"


const $axios = axios.create({
  baseURL:baseURL , 		      // 后台服务地址
  timeout: 60000,		      // 请求超时时间1分钟
  headers:{'Content-Type':'application/x-www-form-urlencoded'}
});
Vue.prototype.$axios = $axios

// 导入qs(处理请求数据)
import qs from 'qs'
Vue.prototype.$qs = qs

Vue.config.productionTip = false


// 安装toast插件
Vue.use(toast)
Vue.use(VueLazyLoad,{
  loading:require('./assets/img/common/placeholder.png')
})

// 添加事件总线对象$bus
Vue.prototype.$bus = new Vue()

// 导入验证码js
Vue.prototype.$yzm = GVerify

// 绑定动画插件到vue上
Vue.prototype.$anime = anime

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')



// 解决移动端 300ms
// Fastclick.attach(document.body)
