import Vue from 'vue'
import store from '@/store'
import App from './App'
import MpvueRouterPatch from 'mpvue-router-patch'

Vue.config.productionTip = false
Vue.use(MpvueRouterPatch)

const app = new Vue({
  store,
  ...App
})
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#20202E',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      color: '#20202E',
      selectedColor: '#20202E',
      backgroundColor: '#fff',
      borderStyle: 'black',
      list: [
        {
          pagePath: 'pages/card/card',
          text: '名片',
          iconPath: '/static/img/icon-mycard@2x.png',
          selectedIconPath: '/static/img/icon-mycard_pressed@2x.png'
        },
        {
          pagePath: 'pages/product/product',
          text: '产品',
          iconPath: '/static/img/icon-product@2x.png',
          selectedIconPath: '/static/img/icon-product_pressed@2x.png'
        },
        {
          pagePath: 'pages/dynamic/dynamic',
          text: '动态',
          iconPath: '/static/img/icon-trends@2x.png',
          selectedIconPath: '/static/img/icon-trends_pressed@2x.png'
        },
        {
          pagePath: 'pages/official/official',
          text: '官网',
          iconPath: '/static/img/icon-website@2x.png',
          selectedIconPath: '/static/img/icon-website_pressed@2x.png'
        }
      ]
    }
  }
}
