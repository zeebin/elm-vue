<template>
  <div class="header">
    <div class="content-wrap">
      <div class="avatar">
        <img :src="seller.avatar" :alt="seller.name" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrap" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%">
    </div>
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrap clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrap">
              <star :score="seller.score" :size="48"></star>
            </div>
            <v-title :text="'优惠信息'"></v-title>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item, index) in seller.supports">
                <span class="icon"
                      :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <v-title :text="'商家公告'"></v-title>
            <div class="bulletin">
              <div class="content">{{seller.bulletin}}</div>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '@/components/star/star.vue'
  import title from '@/components/title/title.vue'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false
      }
    },
    methods: {
      showDetail() {
        this.detailShow = true
      },
      hideDetail() {
        this.detailShow = false
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    components: {
      star,
      'v-title': title
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .header
    position: relative
    color #fff
    background: rgba(7, 17, 27, .5)
    .content-wrap
      position: relative
      padding 24px 12px 18px 24px
      font-size 0
      .avatar
        display: inline-block
        vertical-align top
        img
          border-radius 2px
      .content
        display: inline-block
        font-size 14px
        margin-left: 16px
        .title
          margin: 2px 0 8px 0
          .brand
            display: inline-block
            vertical-align top
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            margin-left 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold

        .description
          margin-bottom: 10px
          line-height: 12px
          font-size: 12px
        .support
          lineheightScale(left top)
          .icon
            display: inline-block
            vertical-align top
            width: 24px
            height: 24px
            margin-right: 8px
            background-size: 24px 24px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            line-height: 24px
            font-size 20px

      .support-count
        lineheightScale(right bottom)
        position: absolute
        right: 12px
        bottom: 14px
        padding: 0 16px
        height: 48px
        line-height: 48px
        border-radius 28px
        background: rgba(0, 0, 0, .2)
        text-align: center
        .count
          vertical-align top
          font-size 20px
        .icon-keyboard_arrow_right
          margin-left: 4px
          line-height: 48px
          font-size 20px
    .bulletin-wrap
      position: relative
      height: 28px
      line-height: 29px
      padding: 0 22px 0 12px
      white-space nowrap
      overflow: hidden
      text-overflow ellipsis
      background: rgba(7, 17, 27, .2)
      .bulletin-title
        display: inline-block
        margin-top: 8px
        vertical-align top
        width: 22px
        height: 12px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        vertical-align top
        margin: 0 4px
        font-size 10px
      .icon-keyboard_arrow_right {
        position: absolute
        font-size 10px
        right: 12px
        top: 9px
      }

    .background
      position absolute
      top: 0
      left: 0
      width 100%
      height: 100%
      z-index -1
      overflow: hidden
      filter blur(10px)
    .detail
      position fixed
      top: 0
      left: 0
      z-index 100
      width: 100%
      height: 100%
      overflow: auto
      background: rgba(7, 17, 27, .8)
      backdrop-filter: blur(5px)
      &.fade-enter-active, &.fade-leave-active
        transition: all .2s ease
      &.fade-enter, &.fade-leave-active
        transform: translateY(100%)
        opacity: 0
        background rgba(7, 17, 27, 0)
      .detail-wrap
        min-height: 100%
        width 100%
        .detail-main
          margin-top: 64px
          padding-bottom: 64px
          .name
            line-height: 16px
            text-align center
            font-size 16px
            font-weight: 700
          .star-wrap
            margin-top: 18px
            padding: 2px 0
            text-align center
          .supports
            width: 80%
            margin: 0 auto
            .support-item
              padding: 0 12px
              margin-bottom: 12px
              font-size 0
              &:last-child
                margin-bottom: 0
              .icon
                display: inline-block
                width: 16px
                height: 16px
                vertical-align top
                margin-right: 6px
                background-size: 16px 16px
                background-repeat: no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')

              .text
                line-height: 16px
                font-size 12px
          .bulletin
            width 80%
            margin: 0 auto
            .content
              padding: 0 12px
              line-height: 24px
              font-size 12px

      .detail-close
        position: relative
        width: 32px
        height: 32px
        margin: -54px auto 0
        clear both
        font-size: 32px
</style>
