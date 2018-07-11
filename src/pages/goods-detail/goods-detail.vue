<template>
  <div class="goods-detail">
    <div class="cover-box">
      <img :src="goods.image_url" class="cover" mode="widthFix">
    </div>
    <div class="goods-title">
      <p class="goods-content">{{goods.title}}</p>
      <p class="content-reason">{{goods.subtitle}}</p>
    </div>
    <div class="goods-icon">
      <span class="goods-small-box goods-small-tall"></span>
      <span class="goods-small-box goods-small-width"></span>
      <span class="goods-small-text">产品详情</span>
    </div>
    <img :src="item.image_url" class="goods-img" v-for="(item, index) in goods.goods_images" :key="index" mode="widthFix">
    <div class="btn">
      <button class="btn-item btn-left" open-type="share">转发给朋友</button>
      <button class="btn-item btn-right">咨询</button>
    </div>
  </div>
</template>

<script>
  import { ERR_OK } from 'api/config'
  import { Website } from 'api'
  import * as wechat from 'common/js/wechat'

  export default {
    name: 'goods-detail',
    data () {
      return {
        goods: {}
      }
    },
    onLoad () {
      this._goods()
    },
    methods: {
      _goods () {
        let id = this.$route.query.id
        Website.goodsDetail(id).then((res) => {
          if (res.error === ERR_OK) {
            this.goods = res.data
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
  .goods-detail
    padding-bottom: 60px
  .cover-box
    overflow: hidden
    height: 230px
    .cover
      width: 100%

  .goods-title
    position: relative
    z-index: 40
    border-radius: 2px
    border-1px($color-col-line, 2px)
    background: $color-white
    height: 112px
    margin: -30px auto 0
    width: 92vw
    padding: 20px 25px
    box-sizing: border-box
    .goods-content
      line-height: 24px
      color: $color-text
      font-family: PingFangSC-Semibold
      font-size: 19px
    .content-reason
      font-family: $font-family-regular
      font-size: $font-size-medium
      color: $color-text
      margin-top: 10px

  .goods-icon
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

  .goods-img
    width: 100vw
    display: block

  .btn
    display: flex
    text-align: center
    position: fixed
    width: 100vw
    height: 45px
    left: 0
    bottom: 0
    .btn-item
      line-height: 45px
      color: $color-white
      font-family: $font-family-medium
      font-size: $font-size-16
      border-radius: 0
      &:after
        border: none
    .btn-left
      flex: 6
      background: $color-text

  .btn-right
    flex: 4
    background: $color-56
</style>