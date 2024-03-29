<template>
  <div>
    <div class="shopcart">
      <div class="content" @click.stop.prevent="toggleList">
        <div class="content-left">
          <div class="logo-wrap">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <span class="icon-shopping_cart"></span>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">
            ￥{{totalPrice}}
          </div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping"
                      @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fade">
        <div class="shopcart-list" v-show="listshow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click.stop.prevent="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food border-1px" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  ￥<span>{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrap">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listshow"
           @click.stop.prevent="listHide"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  /* eslint-disable no-unused-vars */
  import Vuex, {mapGetters, mapActions} from 'vuex'
  import BScroll from 'better-scroll'
  import cartcontrol from '@/components/cartcontrol/cartcontrol.vue'

  export default {
    props: {
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      }
    },
    computed: {
      totalPrice() {
        let total = 0
        this.selectFoods.forEach(food => {
          total += food.price * food.count
        })
        return total
      },
      totalCount() {
        let count = 0
        this.selectFoods.forEach(food => {
          count += food.count
        })
        return count
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}起送`
        } else {
          return '去结算'
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      listshow() {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    methods: {
      ...Vuex.mapMutations(['showLoading']),
      toggleList() {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      listHide() {
        this.fold = true
      },
      empty() {
        this.selectFoods.forEach(food => {
          food.count = 0
        })
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return
        }
        this.showLoading(true)
//        window.alert(`支付${this.totalPrice + this.deliveryPrice}元`)
      },
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeDrop(el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            el.style.display = ''
            el.style.webkitTransform = `translateY(${y}px)`
            el.style.transform = `translateY(${y}px)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translateX(${x}px)`
            inner.style.transform = `translateX(${x}px)`
          }
        }
      },
      dropping(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translateY(0)'
          el.style.transform = 'translateY(0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translateX(0)'
          inner.style.transform = 'translateX(0)'
          el.addEventListener('transitionend', done)
        })
      },
      afterDrop(el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      }
    },
    components: {
      cartcontrol
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/color"
  @import "../../common/stylus/mixin"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: $carbgcolor
      font-size 0
      color rgba(255, 255, 255, .4)
      .content-left
        flex 1
        .logo-wrap
          display: inline-block
          vertical-align top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width 56px
          height: 56px
          box-sizing border-box
          border-radius 50%
          background: $carbgcolor
          .logo
            width: 100%
            height: 100%
            border-radius 50%
            background: #2b343c
            text-align center
            &.highlight
              background: $mainColor
              .icon-shopping_cart
                color: white
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color: #80858a
          .num
            position: absolute
            display: inline-block
            top: 0
            right: 0
            height: 16px
            padding: 0 6px
            line-height: 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight: 700
            color white
            background: $highlightRed
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, .4)
        .price
          display: inline-block
          box-sizing border-box
          vertical-align top
          line-height: 24px
          margin-top: 12px
          padding-right: 12px
          border-right: 1px solid rgba(255, 255, 255, .1)
          font-size 16px
          font-weight: 700
          &.highlight
            color white
        .desc
          display: inline-block
          vertical-align top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size 10px
      .content-right
        flex 0 0 105px
        width: 105px
        .pay
          height 48px
          line-height: 48px
          text-align: center
          font-size 12px
          font-weight: 700
          background: #2b333b
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: white

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
      bottom: 48px
      left: 0
      z-index: -1
      width: 100%
      background: #f1f1f1;
      &.fade-enter-active, &.fade-leave-active
        transition: all .2s ease
      &.fade-enter, &.fade-leave-active
        transform: translateY(100%)
        opacity: 0
        background rgba(7, 17, 27, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: $grey
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        .title
          float: left
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float: right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height 240px
        overflow hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing border-box
          border-1px(rgba(7, 17, 27, .1))
          .name
            line-height: 24px
            font-size 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size 14px
            color $highlightRed
            span
              font-weight: 700
          .cartcontrol-wrap
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position fixed
    top: 0
    left: 0
    z-index 40
    width: 100%
    height: 100%
    overflow: auto
    background: rgba(7, 17, 27, .8)
    backdrop-filter: blur(5px)
    &.fade-enter-active, &.fade-leave-active
      transition: all .2s ease
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background rgba(7, 17, 27, 0)
</style>
