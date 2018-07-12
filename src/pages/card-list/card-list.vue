<template>
  <div class="card-list">
    <div class="card-item" v-if="cardList.length" v-for="(item, index) in cardList" :key="index">
      <p class="card-come">{{item.created_at}} {{item.from_name}}</p>
      <div class="card-box" v-if="item.employee">
        <img src="./bg-cardholder@2x.png" class="bg-img">
        <div v-if="item.status !== 0" class="bg-img shield">此名片已屏蔽</div>
        <div class="card-left">
          <p class="card-buss">{{item.employee.department}}</p>
          <p class="card-name">{{item.employee.name}}</p>
          <p class="card-position">{{item.employee.position}}</p>
          <p class="card-phone"><img class="icon card-phone-icon" src="./icon-telephone@2x.png">159-2057-1999</p>
          <p class="card-times">浏览 {{item.click_count}}次</p>
        </div>
        <div class="card-right">
          <img src="" class="card-header" :src="item.employee.avatar">
          <div class="card-icon-box">
            <img src="" class="card-icon" src="./icon-more@2x.png" @click="_showLong(index)">
            <div class="card-use" :class="{'card-use-active': item.show}" @click="_cardHolderDoClose(item.id, item.status)">
              <img src="" class="icon card-use-icon" src="./icon-screen@2x.png">
              <span class="card-use-text">{{item.status === 0 ? '屏蔽名片' : '开启名片'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <toast ref="toast"></toast>

  </div>
</template>

<script>
  // import { ERR_OK } from 'api/config'
  import { Card } from 'api'
  import { ERR_OK } from '../../api/config'
  import * as wechat from 'common/js/wechat'
  import Toast from 'components/toast/toast'

  export default {
    name: 'card-list',
    data () {
      return {
        page: 1,
        cardList: [],
        loadMore: true
      }
    },
    onLoad () {
      this._getCardList()
    },
    // 下拉刷新
    onReachBottom () {
      if (!this.loadMore) {
        return
      }
      this.page++
      this._getCardList()
    },
    methods: {
      _showLong (index) {
        this.cardList[index].show = !this.cardList[index].show
      },
      _getCardList () {
        Card.cardHolderList({ page: this.page }).then((res) => {
          if (res.error === ERR_OK) {
            if (res.data.length) {
              res = res.data.map((item) => {
                item.show = false
                return item
              })
            } else {
              this.loadMore = false
            }
            wechat.hideLoading()
            if (this.page === 1) {
              this.cardList = res
              return
            }
            this.cardList = this.cardList.concat(res)
            console.log(this.cardList)
          }
        })
      },
      _cardHolderDoClose (id, status) {
        switch (status) {
          case 0:
            Card.cardHolderDoClose({ card_holder_id: id }).then((res) => {
              if (res.error === ERR_OK) {
                let index = this.cardList.findIndex(item => item.id === id)
                this.cardList[index].status = 1
              }
              wechat.hideLoading()
              console.log(res)
            })
            break
          case 1:
            Card.cardHolderCancelClose({ card_holder_id: id }).then((res) => {
              if (res.error === ERR_OK) {
                let index = this.cardList.findIndex(item => item.id === id)
                this.cardList[index].status = 0
              } else {
                this.$refs.toast.show(res.message)
              }
              wechat.hideLoading()
            })
            break
        }
      }
      //   名片详情跳转
    },
    components: {
      Toast
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .card-list
    height: 100vh
    background: $color-background

  .icon
    width: 14px
    height: 14px

  .card-item
    line-height: 1
    box-sizing: border-box
    padding: 0 4vw
    .card-come
      color: $color-888888
      font-family: $font-family-regular
      font-size: $font-size-14
      padding: 4vw 0 10.5px
    .card-box
      justify-content: space-between
      position: relative
      display: flex
      height: 169px
      box-sizing: border-box
      padding: 15px 14.5px
      font-family: $font-family-medium
      background: $color-white
      .bg-img
        left: 0
        top: 0
        height: 100%
        width: 100%
        position: absolute
      .shield
        z-index: 5
        text-align: center
        line-height: 169px
        color: $color-white
        font-family: $font-family-regular
        font-size: $font-size-16
        background: rgba(32, 32, 46, .8)
      .shield-disable
        z-index: 100
    .card-buss
      color: $color-888888
      font-size: $font-size-14
    .card-name
      margin-top: 15px
      color: $color-text
      font-size: $font-size-24
    .card-position
      margin-top: 10px
      color: $color-text
      font-size: $font-size-14
    .card-phone
      display: flex
      align-items: center
      color: $color-56
      font-size: $font-size-16
      margin-top: 15px
      .card-phone-icon
        margin-right: 5px
    .card-times
      margin-top: 20px
      color: $color-888888
      font-size: $font-size-12
    .card-right
      position: relative
      .card-header
        width: 60px
        height: 60px
        background: $color-white
      .card-icon-box
        width: 30px
        height: 40px
        bottom: 0
        right: 0
        display: flex
        z-index: 10
        justify-content: flex-end
        align-items: flex-end
        position: absolute
        .card-icon
          width: 20px
          height: 6px
        .card-use
          bottom: -45px
          right: 0
          height: 40px
          width: 0
          display: flex
          justify-content: center
          align-items: center
          color: $color-text
          font-size: $font-size-14
          border: 0.5px solid rgba(32, 32, 46, 0.10)
          box-shadow: 0 4px 12px 0 rgba(43, 43, 145, 0.07)
          background: $color-white
          position: absolute
          overflow: hidden
          opacity: 0
          transition: all 0.3s
          .card-use-text
            white-space: nowrap
            margin-left: 5px
        .card-use-active
          opacity: 1
          transition: all 0.3s
          z-index: 10
          width: 105px


</style>