<template>
  <transition name="move-left">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" :alt="food.name">
          <div class="back" @click.stop.prevent="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old"
                                                          v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrap">
            <cartcontrol @add="addFood" :food="food"
                         ref="cartcontrol"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count===0"
                 @click.stop.prevent="addFirst($event)">加入购物车
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @select="selectRating" @toggle="toggleContent"
                        :select-type="selectType" :ratings="food.ratings"
                        :desc="desc" :only-content="onlyContent"></ratingselect>
          <div class="rating-wrap">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)"
                  v-for="rating in food.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" :src="rating.avatar" width="12"
                       height="12">
                </div>
                <div class="time">{{rating.rateTime}}</div>
                <p class="text">
                  <span
                    :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                  {{rating.text || '暂无内容'}}
                </p>
              </li>
            </ul>
            <div class="no-rating"
                 v-show="!food.ratings || !food.ratings.length"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import cartcontrol from '@/components/cartcontrol/cartcontrol'
  import split from '@/components/smallparts/split/split'
  import ratingselect from '@/components/ratingselect/ratingselect'
  /* eslint-disable no-unused-vars */
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    methods: {
      show() {
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = false
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide() {
        this.showFlag = false
      },
      addFirst(event) {
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        this.$emit('add', event.target)
      },
      addFood(target) {
        this.$emit('add', target)
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      },
      selectRating(type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/color"
  @import "../../common/stylus/mixin"

  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: white
    overflow: hidden
    &.move-left-enter-active, &.move-left-leave-active
      transition: all .2s ease
    &.move-left-enter, &.move-left-leave-active
      transform: translateX(100%)
      opacity: 0
      background transparent
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width 100%
        height 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size 20px
          color white
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size 14px
        font-weight: 700
        color $fontColor
      .detail
        margin-bottom: 18px
        line-height: 10px
        height 10px
        font-size 0
        .sell-count, .rating
          font-size 10px
          color: $fontColorGrey
        .sell-count
          margin-right: 12px
      .price
        line-height: 24px
        height 24px
        .now
          font-weight: 700
          margin-right 8px
          font-size 14px
          color: $highlightRed
        .old
          font-weight: 700
          text-decoration line-through
          font-size 10px
          color: $fontColorGrey
      .cartcontrol-wrap
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        line-height: 48px
        padding: 0 24px
        height 48px
        box-sizing border-box
        background: $mainColor
        border-radius 24px
        font-size 20px
        color white
        lineheightScale(right bottom)
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.2s
        &.fade-enter, &.fade-leave-active
          transform: scale(0, 0.5)
          opacity: 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size 14px
        color $fontColor
      .text
        line-height: 24px
        padding: 0 8px
        color $fontColorMidGrey
        font-size 12px
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size 14px
        color $fontColor
      .rating-wrap
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px($borderColor)
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size 10px
              color $fontColorGrey
            .avatar
              border-radius 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size 10px
            color $fontColorGrey
          .text
            line-height: 16px
            font-size 12px
            color $fontColor
            .icon-thumb_down, .icon-thumb_up
              margin-right: 4px
              line-height: 16px
              font-size 12px
            .icon-thumb_up
              color $mainColor
            .icon-thumb_down
              color $fontColorGrey

</style>
