<template>
  <div class="cartcontrol">
    <transition name="rotate-fade">
      <div class="cart-decrease icon-remove_circle_outline"  @click.stop.prevent="decreaseCart($event)" v-show="food.count>0"></div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
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
      decreaseCart(event) {
        if (!event._constructed || !this.food.count) {
          return
        }
        if (this.food.count > 0) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/color"

  .cartcontrol
    font-size 0
    .cart-decrease, .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size 24px
      color $mainColor
    .cart-decrease
      &.rotate-fade-enter-active, &.rotate-fade-leave-active {
        transition: all .3s ease;
      }
      &.rotate-fade-enter, &.rotate-fade-leave-active {
        transform: translateX(24px) rotate(180deg);
        opacity: 0;
      }
      font-size 24px
    .cart-count
      display: inline-block
      vertical-align top
      width 12px
      padding-top: 6px
      line-height 24px
      font-size 10px
      color rgb(147,153,159)
      text-align center
    .cart-add
      font-size 24px

</style>
