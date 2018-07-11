<template>
  <div class="production">
    <div class="production-item" v-for="(item, index) in goodsList" :key="index" @click="_goDetail(item.id)">
      <div class="production-img-box">
        <img :src="item.image_url" mode="widthFix" class="production-img">
      </div>
      <p class="production-name">{{item.title}}</p>
      <p class="production-title">{{item.subtitle}}</p>
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
        goodsList: [],
        page: 1,
        loadMore: true
      }
    },
    onLoad () {
      this._getWebsite()
    },
    // 下拉刷新
    onReachBottom () {
      if (!this.loadMore) {
        return
      }
      this.page++
      this._getWebsite()
    },
    methods: {
      _getWebsite () {
        Website.goodsLists({ page: this.page }).then((res) => {
          if (res.error === ERR_OK) {
            if (this.page === 1) {
              this.goodsList = res.data
            } else {
              this.goodsList = this.goodsList.concat(res.data)
            }
            if (!res.data.length) {
              this.loadMore = false
            }
          }
          wechat.hideLoading()
        })
      },
      _goDetail (id) {
        let url = `/pages/goods-detail/goods-detail?id=${id}`
        this.$router.push(url)
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
      padding: 0 15px
      box-sizing: border-box
      font-size: $font-size-16
      font-family: $font-family-medium
      margin-top: 15px
    .production-title
      padding: 0 15px
      box-sizing: border-box
      margin-top: 10px
      text-indent: 15px
      font-size: $font-size-14
      font-family: $font-family-regular
</style>
