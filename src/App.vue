<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view :seller="seller"></router-view>
    <loading></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header'
  import loading from './components/loading/loading'

  const ERR_OK = 0

  export default {
    data() {
      return {
        seller: {}
      }
    },
    created() {
      this.$http.get('/api/seller').then(response => {
        // get body data
        if (response.body.errno === ERR_OK) {
          this.seller = response.body.data
        }
      }, response => {
        // error callback
      })
    },
    name: 'app',
    components: {
      'v-header': header,
      loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin"
  @import "./common/stylus/color"

  .tab
    position relative
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, .1))
    .tab-item
      flex: 1
      text-align: center
      a
        display: block
        font-size: 14px
        color rgb(77, 85, 93)
        &.active
          color $highlightRed

</style>
