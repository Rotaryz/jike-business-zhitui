<template>
  <div class="production">
    <div class="production-item">
      <div class="production-img-box">
        <img src="./Snip20180707_9.png" mode="widthFix" class="production-img">
      </div>
      <p class="production-name">赞播智销商家版</p>
      <p class="production-title">销售利器，帮助企业抓住每一条线索</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { ERR_OK } from 'api/config'
  import { Website } from 'api'
  import * as wechat from 'common/js/wechat'

  export default {
    data () {
      return {
        goodsList: []
      }
    },
    created () {
      this._getWebsite()
    },
    methods: {
      _getWebsite () {
        Website.goodsLists().then((res) => {
          if (res.error === ERR_OK) {
            this.goodsList = res.data
            console.log(res.data)
          }
          wechat.hideLoading()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .production
    height: 100vh
    padding: 4vw
    background: $color-background

  .production-item
    background: $color-white
    margin-bottom: 15px
    line-height: 1
    color: $color-text
    border-radius: 2px
    padding-bottom: 30px
    box-shadow: 0 4px 12px 0 rgba(43, 43, 145, 0.07)
    &:last-child
      margin-bottom: 0
    .production-img-box
      overflow: hidden
      height: 58.67vw
      .production-img
        width: 100%
    .production-name
      text-indent: 15px
      font-size: $font-size-16
      font-family: $font-family-medium
      margin-top: 15px
    .production-title
      margin-top: 10px
      text-indent: 15px
      font-size: $font-size-14
      font-family: $font-family-regular
</style>
