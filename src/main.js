
import Vue from 'vue'

import  VueResource  from "vue-resource"
import moment from 'moment'

import { Button } from 'mint-ui'

import app from './App.vue'
import router from './router'


import './commont/stylus/index.styl'

import "./mock/mockServer"

/* eslint-disable no-new */

// 自定义全局的过滤器（格式化日期和时间）
Vue.filter('date',function (value) {
  return moment(value).format('YYYY-MM-DD HH:mm:ss')

})

Vue.component(Button.name, Button)

Vue.use(VueResource)

new Vue({
  el:'#app',
  render: h=>h(app),
  router
})
