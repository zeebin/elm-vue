<template>
  <div>
    <div class="goods">
      <div class="menu-wrap" ref="menuWrap">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item"
              :class="{'current': currentIndex===index}"
              @click="selectMenu(index,$event)" ref="menuList">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon"
                    :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrap" ref="foodsWrap">
        <ul>
          <li class="food-list" v-for="item in goods" ref="foodList">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px"
                  @click.stop.prevent="selectFood(food,$event)">
                <div class="icon">
                  <img :src="food.icon" :alt="food.name" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old"
                                                                  v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrap">
                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :select-foods="selectFoods"
                :delivery-price="seller.deliveryPrice"
                :min-price="seller.minPrice"></shopcart>
    </div>
    <food :food="selectedFood" @add="addFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import shopcart from '@/components/shopcart/shopcart'
  import cartcontrol from '@/components/cartcontrol/cartcontrol'
  import food from '@/components/food/food'

  const ERR_OK = 0
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height = this.listHeight[i]
          let nextHeight = this.listHeight[i + 1]
          if (!nextHeight || (this.scrollY >= height && this.scrollY < nextHeight)) {
            return i
          }
        }
        return 0
      },
      selectFoods () {
        let foods = []
        this.goods.forEach(good => {
          good.foods.forEach(food => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    created () {
      this.$http.get('/api/goods').then(response => {
        if (response.body.errno === ERR_OK) {
          this.goods = response.body.data
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    methods: {
      selectMenu(index, event) {
        if (!event._constructed) {
          return
        }
        this.scrollY = this.listHeight[index]
        this.foodsScroll.scrollTo(0, -this.scrollY)
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return
        }
        this.selectedFood = food
        this.$refs.food.show()
      },
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrap, {
          click: true
        })

        this.foodsScroll = new BScroll(this.$refs.foodsWrap, {
          probeType: 3,
          click: true
        })
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight() {
        let foodList = this.$refs.foodList
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      addFood(target) {
        this._drop(target)
      },
      _drop(target) {
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target)
        })
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  @import "../../common/stylus/color"

  .goods
    display: flex
    position absolute
    top: 184px
    bottom 46px
    width 100%
    overflow: hidden
    .menu-wrap
      flex 0 0 80px
      width: 80px
      background: $grey
      .menu-item
        display: table
        height: 54px
        width 56px
        padding: 0 12px
        line-height: 14px
        .icon
          display: inline-block
          vertical-align top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          vertical-align middle
          font-size 12px
          border-1px(rgba(7, 17, 27, .1))
        &.current
          background: #fff
          position: relative
          &::before
            content ''
            position absolute
            left 0
            top 0
            width: 3px
            height: 100%
            background: $mainColor
          .text
            font-weight: 700
            &::after
              border-color: transparent
    .foods-wrap
      flex 1
      background: #fff
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background: $grey
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, .1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex 1
          .name
            margin: 2px 0 8px
            height: 14px
            line-height: 14px
            font-size 14px
            color rgb(7, 17, 27)
          .desc, .extra
            margin-bottom: 6px
            line-height: 10px
            font-size 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 14px
            margin-bottom: 8px
          .extra
            .count
              margin-right 12px
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
            right: 0
            bottom 12px


</style>
