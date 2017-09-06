<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggle">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-if="totalCount">{{totalCount}}</div>
          </div>
          <div class="price">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <!--<div class="pay " :class="{'not-enough':totalPrice<minPrice,enough:totalPrice>=minPrice}">-->
          <div class="pay " :class="totalPrice < minPrice ? 'not-enough':'enough'">
            {{payText}}
          </div>

        </div>
      </div>


      <div class="ball-container">
        <transition v-for="(ball , index) in balls"
                    @before-enter="beforeDrop"
                    @enter="drop"
                    @after-enter="afterDrop"
                    :key="index"
                    :css="false">
          <div class="ball" v-show="ball.isShow">
            <div class="inner inner-hook"></div>
          </div>

        </transition>
      </div>


      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>

          <mt-button class="empty"  @click.native="clearCart" type="primary">清空</mt-button>

          <!--<span class="empty" @click="clearCart">清空</span>-->

        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="(food,index) in selectedFoodList" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price"><span>￥{{food.price}}</span></div>
              <div class="cartcontrol-wrapper">
                <div class="cartcontrol">
                  <cartcontrol :food="food"
                               :update-food-count="updateFoodCount"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      </transition>
    </div>
    <div class="list-mask" v-show="listShow" @click="toggle"></div>
  </div>
</template>
<script>

  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import { Toast, MessageBox } from 'mint-ui';

  import cartcontrol from '../cartcontrol/cartcontrol.vue'


  /*Vue.component(Button.name, Button);*/

  export default{
    props:{
      selectedFoodList: Array,
      deliveryPrice: Number,
      minPrice: Number,
      /*clearCart: Function,*/
      updateFoodCount: Function
    },
    data(){
      return{
        isShow: false,
        balls: [ //所有小球状态的数组
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false}
        ],
        droppingBalls: [] //包含所有正在执行动画的ball
      }
    },
    computed: {
      totalPrice(){
          return this.selectedFoodList.reduce((preToal ,food)=>{
              return preToal + food.price*food.count
          },0)
      },
      totalCount(){
        return this.selectedFoodList.reduce((preToal ,food)=>{
          return preToal + food.count
        },0)
      },
      payText(){
        const minPrice=this.minPrice
        const totalPrice = this.totalPrice
        if(totalPrice===0){
          return `￥${minPrice}元起送`
        }else if(totalPrice<minPrice){
          return `还差￥${minPrice - totalPrice}元起送`
        }else{
          return `去结算`
        }
      },
      listShow(){
          if(!this.totalCount){
            this.isShow=false
            return false
          }

          if(this.isShow){
              this.$nextTick(()=>{
                  //如何只创建一个 scroll 对象
                    // 1 判断是否已经存在保护对象，如果不存在，进入2
                   //  2 创建对象后将对象保存起来
                  if(!this.scroll){
                    this.scroll=new BScroll(this.$refs.listContent,{
                      click: true
                    })
                  }else{
                      this.scroll.refresh()
                  }

              })

          }
          return this.isShow
      }
    },

    methods: {
        toggle(){
            if(this.totalCount){
              this.isShow = ! this.isShow
            }
        },
        clearCart(){
           // 触发事件: clearCartList

           /* if(confirm('确定清空么')){
              this.$emit('clearCartList')
            }*/


          MessageBox({
            title: '提示',
            message: '确定清空吗?',
            showCancelButton: true
          }).then(action => {
            console.log(action)
            if(action==='confirm') {
              this.$emit('clearCartList')
              Toast({
                message: '清理完成',
                position: 'middle',
                duration: 1000
              })
            }
          })


        },
        //让一个隐藏的小球开始显示drop动画
        startDropAnimation(startEl){
          // 找到一个隐藏的小球
          const ball=this.balls.find(ball=> !ball.isShow)
          if(ball){// 已经找到了
            ball.isShow=true
            ball.startEl=startEl //保存+号div
            this.droppingBalls.push(ball) // 保存ball
          }
        },
        // 指定el在动画开始时的状态(样式)
        beforeDrop(el){// el是小球div
          // 得到当前动画所对应的ball
          const ball=this.droppingBalls.shift()
          const startEl=ball.startEl
          // 计算偏移量
          let offsetY=0
          let offsetX=0
          const startElLeft=startEl.getBoundingClientRect().left
          const startElTop=startEl.getBoundingClientRect().top
          const elLeft = 32
          const elBottom= 22
          offsetX=startElLeft-elLeft
          offsetY= -(window.innerHeight-startElTop-elBottom)
          // 瞬间平移
          el.style.transform =`translate3d(0, ${offsetY}px, 0)`
          el.children[0].style.transform=`translate3d( ${offsetX}px, 0, 0)`
          // 保存ball
          el.ball=ball

        },

        // 指定el在动画结束时的状态(样式)
        drop(el){
          // 强制进行一次重排重绘
          const temp = el.clientHeight
          // 必须异步指定
          this.$nextTick(()=>{
              el.style.transform =`translate3d(0,0,0)`
            el.children[0].style.transform=`translate3d(0,0,0)`
          })
        },
        // 做一些收尾的工作(隐藏小球)
        afterDrop(el){

          // 必须延迟0.4s才能隐藏ball
          setTimeout(()=>{
              el.ball.isShow = false
          },400)

        }
    },
    components: {
      cartcontrol
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "../../commont/stylus/mixin.styl"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0) /*显示时的状态*/
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          /*color: rgb(0, 160, 220)*/

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
