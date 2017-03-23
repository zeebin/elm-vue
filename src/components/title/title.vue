<template>
  <div class="head-title">
    <div class="line"></div>
    <div class="text">{{this.text}}</div>
    <div class="line"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      text: {
        type: String
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .head-title
    display: flex
    padding:0 36px
    margin: 30px auto 24px
    .line
      flex 1
      position: relative
      top: -6px
      border-bottom: 1px solid rgba(255, 255, 255, .2)
    .text
      padding: 0 12px
      font-size 14px
      font-weight: 700
</style>
