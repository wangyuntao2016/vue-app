<template>
  <div class="stars" :class=" `stars-${size}`">
    <span class="star " v-for="starClass in starClasses" :class="starClass"></span>
    <!--<span class="star on"></span>
    <span class="star on"></span>
    <span class="star half"></span>
    <span class="star off"></span>-->
  </div>
</template>
<script>

  const class_on='on'
  const class_half='half'
  const class_off='off'
  export default{
      props:{
        score:Number,
        size:Number
      },
    /*
    *  出现星星的计算
    *  3.4 ==> 3个全星 2个灰星
    *  3.5==>3个全星 1个半星 1个灰星
     */
      computed:{
        starClasses(){
          const scs=[]
          const score =this.score
          const scoreInteger=Math.floor(score) // 获取score 的整数
          //添加class_on
          for(let i=0;i<scoreInteger;i++){
              scs.push(class_on)
          }
          //添加class_half
          if(score-scoreInteger>=0.5){
              scs.push(class_half)
          }
          //添加class_off
          while(scs.length<5){
              scs.push(class_off)
          }
          /*let count=5-scs.length
          for(let i=0;i<count;i++){
            scs.push(class_off)
          }*/
          return scs

        }
      }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../commont/stylus/mixin.styl"

  .stars
    text-align center
    height 24px
    .star
      display inline-block
      background-repeat no-repeat
    &.stars-48
      .star
        margin-right 15px
        width 20px
        height 19px
        background-size 20px 19px
        &:last-child
          margin-right 0
        &.on
          bg-image("../star/star48_on")
        &.half
          bg-image("../star/star48_half")
        &.off
          bg-image("../star/star48_off")
    &.stars-36
      .star
        margin-right 5px
        width 15px
        height 15px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image("../star/star36_on")
        &.half
          bg-image("../star/star36_half")
        &.off
          bg-image("../star/star36_off")
    &.stars-24
      .star
        margin-right 5px
        width 10px
        height 10px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image("../star/star24_on")
        &.half
          bg-image("../star/star24_half")
        &.off
          bg-image("../star/star24_off")



</style>
