<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive" :class="{'active':selectType===2}"
            @click.stop.prevent="select(2,$event)">{{desc.all}}<i
        class="count">{{ratings.length}}</i></span>
      <span class="block positive" :class="{'active':selectType===0}"
            @click.stop.prevent="select(0,$event)">{{desc.positive}}<i
        class="count">{{positives.length}}</i></span>
      <span class="block negative" :class="{'active':selectType===1}"
            @click.stop.prevent="select(1,$event)">{{desc.negative}}<i
        class="count">{{negatives.length}}</i></span>
    </div>
    <div class="switch" @click.stop.prevent="toggleContent"
         :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2

  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed: {
      positives() {
        return this.ratings.filter(rating => {
          return rating.rateType === POSITIVE
        })
      },
      negatives() {
        return this.ratings.filter(rating => {
          return rating.rateType === NEGATIVE
        })
      }
    },
    methods: {
      select(type, event) {
        if (!event._constructed) {
          return
        }
        this.$emit('select', type)
      },
      toggleContent(event) {
        if (!event._constructed) {
          return
        }
        this.$emit('toggle')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  @import "../../common/stylus/color"

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px($borderColor)
      font-size 0
      .block
        display: inline-block
        padding: 10px 12px
        margin-right: 8px
        border-radius 1px
        font-size 12px
        line-height: 12px
        color rgb(77, 85, 93)
        &.active
          color white
        .count
          font-style: normal
          margin-left: 2px
          font-size 8px
        &.positive
          background: rgba(0, 160, 220, .2)
          &.active
            background: $mainColor
        &.negative
          background: rgba(77, 85, 93, .2)
          &.active
            background: rgb(77, 85, 93)

    .switch
      padding: 12px
      line-height: 24px
      border-bottom: 1px solid $borderColor
      color $fontColorGrey
      font-size 0
      &.on
        .icon-check_circle
          color #00c850
      .icon-check_circle
        display inline-block
        vertical-align: top
        margin-right 4px
        font-size 24px
      .text
        display inline-block
        vertical-align: top
        font-size 12px


</style>
