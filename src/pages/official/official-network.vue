<template>
  <div class="official-network">
    <div class="goods-icon">
      <span class="goods-small-box goods-small-tall"></span>
      <span class="goods-small-box goods-small-width"></span>
      <span class="goods-small-text">公司介绍</span>
    </div>
    <div class="text">
      {{network.introduction}}
    </div>
    <div class="img-box">
      <img v-for="(item, index) in network.merchant_image" :key="index" :src="item.url" class="net-img" mode="widthFix">
    </div>
  </div>
</template>

<script>
  import { ERR_OK } from 'api/config'
  import { Website } from 'api'
  import * as wechat from 'common/js/wechat'

  export default {
    name: 'official-network',
    data () {
      return {
        network: {}
      }
    },
    onLoad () {
      this._getWebsite()
    },
    methods: {
      _getWebsite () {
        Website.website().then((res) => {
          if (res.error === ERR_OK) {
            this.network = res.data
          }
          wechat.hideLoading()
        })
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .official-network
    padding: 0 15px 15px
    min-height: 100vh
    background: $color-background

  .goods-icon
    font-size: $font-size-14
    color: $color-text
    font-family: $font-family-regular
    position: relative
    height: 63px
    .goods-small-box
      border-1px(#CCCCCC, 0px)
      all-center()
    .goods-small-tall
      height: 33px
      width: 95px
    .goods-small-width
      height: 27px
      width: 101px
    .goods-small-text
      all-center()

  .text
    border-all: (rgba(32, 32, 46, 0.10))
    box-shadow: 0 4px 12px 0 rgba(43, 43, 145, 0.07)
    border-radius: 2px
    background: $color-white
    font-size: $font-size-14
    font-family: $font-family-regular
    line-height: 22px
    padding: 15px
    box-sizing: border-box

  .img-box
    border-radius: 2px
    border-all: (rgba(32, 32, 46, 0.10))
    box-shadow: 0 4px 12px 0 rgba(43, 43, 145, 0.07)
    margin-top: 15px
    background: $color-white
    padding: 0 15px 15px
    .net-img
      margin-top: 15px
      width: 100%
</style>