<template>
  <div class="card-list">
    <div class="card-item" v-for="(item, index) in cardList" :key="index" @click="_goCard(item)">
      <p class="card-come">{{item.created_at}} {{item.from_name}}</p>
      <div class="card-box" v-if="item.employee">
        <img src="./bg-cardholder@2x.png" class="bg-img">
        <div v-if="item.status !== 0" class="bg-img shield" :class="item.status === 2 ? 'shield-disable' : 'shield'">{{item.status === 1 ? '此名片已屏蔽' : '此名片已删除'}}</div>
        <div class="card-left">
          <p class="card-buss">{{item.employee.department}}</p>
          <p class="card-name">{{item.employee.name}}</p>
          <p class="card-position">{{item.employee.position}}</p>
          <p class="card-phone"><img class="icon card-phone-icon" src="./icon-telephone@2x.png">159-2057-1999</p>
          <p class="card-times">浏览 {{item.click_count}}次</p>
        </div>
        <div class="card-right">
          <image src="" class="card-header" :src="item.employee.avatar">
            <span class="content-count" v-if="item.unReadMsgCount" @click.stop="_goChat(item)">{{item.unReadMsgCount}}</span>
          </image>
          <div class="card-icon-box" @click.stop="_showLong(index)">
            <img class="card-icon" :src="item.status === 1 ? '/static/icon-more_white@2x.png' : '/static/icon-more@2x.png'">
            <div class="card-use" :class="{'card-use-active': item.show}" @click.stop="_cardHolderDoClose(item.id, item.status)">
              <img class="icon card-use-icon" src="./icon-screen@2x.png">
              <span class="card-use-text">{{item.status === 0 ? '屏蔽名片' : '开启名片'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="down-box">
      <img src="./pic-zanbozc@2x.png" class="sponsor">
    </div>
    <toast ref="toast"></toast>

  </div>
</template>

<script>
  // import { ERR_OK } from 'api/config'
  import Toast from 'components/toast/toast'
  import { mapActions, mapGetters } from 'vuex'
  // import webimHandler from 'common/js/webim_handler'

  export default {
    name: 'card-list',
    data () {
      return {
        page: 1,
        loadMore: true
      }
    },
    onShow () {
      this._getCardList()
      let { employeeId, fromType, fromId } = this.currentMsg
      this.setCurrentMsg({ employeeId, fromType, fromId })
    },
    // 下拉刷新
    onReachBottom () {
      if (!this.loadMore) {
        return
      }
      this.page++
      this._getCardList()
    },
    computed: {
      ...mapGetters([
        'cardList',
        'currentMsg'
      ])
    },
    methods: {
      ...mapActions(['setCurrentMsg', 'setDescMsg', 'setCardList', 'getCardList', 'showCardUse', 'cardHolderDoClose']),
      _setMsg (item) {
        //  存id
        wx.setStorageSync('EmployeeId', item.employee.id)
        let user = wx.getStorageSync('userInfo')
        let data = { 'flow_id': item.flow_id, 'card_holder_id': item.id, 'merchant_id': 10, 'employee_id': item.employee.id, 'customer_id': user.id }
        this.setCurrentMsg(Object.assign({}, item, { employeeId: item.employee.id }))
        this.setDescMsg(data)
      },
      _goCard (item) {
        if (item.status !== 0) {
          return
        }
        this._setMsg(item)
        this.$router.push({ path: '/pages/card/card', isTab: true })
      },
      _goChat (item) {
        if (item.status !== 0) {
          return
        }
        if (item.unReadMsgCount <= 0) {
          return
        }
        this._setMsg(item)
        this.$router.push('/pages/chat-msg/chat-msg')
      },
      _showLong (index) {
        this.showCardUse(index)
      },
      _getCardList () {
        this.getCardList(this.page)
      },
      _cardHolderDoClose (id, status) {
        this.cardHolderDoClose({ id, status, vue: this })
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
    min-height: 100vh
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
      height: $font-size-14
      color: $color-888888
      font-size: $font-size-14
    .card-name
      height: $font-size-14
      margin-top: 15px
      color: $color-text
      font-size: $font-size-24
    .card-position
      height: $font-size-14
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
        position: relative
        overflow: visible
        .content-count
          position: absolute
          right: -7.5px
          top: -7.5px
          min-width: 15px
          height: 15px
          border-radius: 50%
          background: $color-F9543C
          border: 1px solid $color-white
          line-height: 15px
          font-size: $font-size-12
          color: $color-white
          font-family: $font-family-medium
          text-align: center
      .card-icon-box
        width: 45px
        height: 40px
        bottom: -15px
        right: -15px
        display: flex
        z-index: 10
        justify-content: center
        align-items: center
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

  .down-box
    width: 100%
    height: 82.5px
    display: flex
    align-items: center
    justify-content: center
    .sponsor
      width: 95px
      height: 33.5px

</style>
