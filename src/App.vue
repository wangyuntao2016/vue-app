<template>
  <div>
    <ele-header :seller="seller"></ele-header>

      <div class="tab border-1px">
        <div class="tab-item">
          <!--<router-link to="/goods">商品</router-link>-->

          <router-link to="/goods">
            <mt-button  type="primary" size="small" plain>商品</mt-button>
          </router-link>
        </div>
        <div class="tab-item">

          <!--<router-link to="/ratings">评价</router-link>-->

          <router-link to="/ratings">
            <mt-button   type="danger" size="small" plain>评价</mt-button>
          </router-link>
        </div>

        <div class="tab-item">
          <!--<router-link to="/seller">商家</router-link>-->
          <router-link to="/seller">
            <mt-button   type="primary" size="small" plain>商家</mt-button>
          </router-link>
        </div>
      </div>

    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
  import axios from 'axios'
 import header from './components/header/header.vue'
  const ok=0;
  export default{
    data(){
        return{
            seller:{}
        }
    },
    created(){
      //1. 使用vue-resource发送ajax请求(express模拟接口)
        this.$http.get('/api/seller')
          .then(response=>{
            const result=response.body
            /*console.log(result)*/
            })
      //使用axios发送ajax请求(mockjs模拟接口)
      axios.get('/api2/seller')
        .then(response=>{
          const result=response.data
          if(result.code===ok){
            this.seller=result.data
          }
        })

    },
    components: {
        'ele-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './commont/stylus/mixin.styl'
  .tab
    display flex
    height 40px
    line-height 40px
    border-1px(rgba(7,17,27,.1))
    .tab-item
      font-size 14px
      width 0
      flex 1
      text-align center
      & > a
        display block
        color rgb(77,85,93)
        &.active
         color rgb(240,20,20)



</style>
