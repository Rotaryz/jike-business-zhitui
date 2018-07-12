<template>
  <div class="card">
    <div class="card-top">
      <div class="bc-img-box">
        <img :src="cardMsg.avatar ? cardMsg.avatar : defaultImg" class="bc-img" mode="aspectFill">
        <div class="cards-link" @click="toCards">
          <img src="./icon-change@2x.png" class="cards-link-icon">
          <div class="red-dot"></div>
        </div>
      </div>
    </div>
    <div class="card-box">
      <div class="card-container">
        <p class="name-tel"><text class="nametxt">{{cardMsg.employee ? cardMsg.employee.name : ''}}</text><text class="tel">{{cardMsg.employee ? cardMsg.employee.business_card_mobile : ''}}</text></p>
        <p class="job-title">{{cardMsg.employee ? cardMsg.employee.position : ''}}</p>
        <p class="company">{{cardMsg.employee ? cardMsg.employee.department : ''}}</p>
        <div class="sig-txt">
          <p class="sig-text-p" v-if="cardMsg.employee && cardMsg.employee.signature">“ {{cardMsg.employee ? cardMsg.employee.signature : ''}} ”</p>
        </div>
        <div class="btn-box">
          <div class="btn-item">
            <img src="./icon-hot@2x.png" class="btn-icon">
            <div class="item-txt">人气 {{cardMsg.click_count}}</div>
          </div>
          <div class="btn-item" @click="dianzan">
            <img src="./icon-zan@2x.png" class="btn-icon" v-show="!isLike">
            <img src="./icon-zan_select@2x.png" class="btn-icon" v-show="isLike">
            <div class="item-txt">点赞 {{likeCount}}</div>
          </div>
          <div class="btn-item" @click="shareCard">
            <img src="./icon-intransit@2x.png" class="btn-icon">
            <div class="item-txt">转发 {{cardMsg.share_count}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="title-box" v-if="cardMsg.employee && (cardMsg.employee.business_card_mobile || cardMsg.employee.email || cardMsg.employee.address)">
      <div class="left"></div>
      <div class="title-txt">个人信息</div>
      <div class="right"></div>
    </div>
    <div class="msg-container" v-if="cardMsg.employee && (cardMsg.employee.business_card_mobile || cardMsg.employee.email || cardMsg.employee.address)">
      <div class="msg-detail">
        <div class="msg-item border-bottom-1px" v-if="cardMsg.employee && cardMsg.employee.business_card_mobile">
          <div class="left">
            <div class="title">手机</div>
            <div class="text">{{cardMsg.employee ? cardMsg.employee.business_card_mobile : ''}}</div>
          </div>
          <div class="right">
            <div class="line"></div>
            <div class="icon-box" @click="callPhone">
              <img src="./icon-tel@2x.png" class="icon-img">
            </div>
          </div>
        </div>
        <div class="msg-item border-bottom-1px" v-if="cardMsg.employee && cardMsg.employee.email">
          <div class="left">
            <div class="title">邮箱</div>
            <div class="text">{{cardMsg.employee ? cardMsg.employee.email : ''}}</div>
          </div>
          <div class="right">
            <div class="line"></div>
            <div class="icon-box" @click="copyEmail">
              <img src="./icon-email@2x.png" class="icon-img">
            </div>
          </div>
        </div>
        <div class="msg-item border-bottom-1px" v-if="cardMsg.employee && cardMsg.employee.address">
          <div class="left">
            <div class="title">地址</div>
            <div class="text">{{cardMsg.employee ? cardMsg.employee.address : ''}}</div>
          </div>
          <div class="right">
            <div class="line"></div>
            <div class="icon-box" @click="showMap">
              <img src="./icon-address@2x.png" class="icon-img">
            </div>
          </div>
        </div>
        <div class="last-item">
          <div class="save-btn" @click="addContact">同步到通讯录</div>
        </div>
      </div>
    </div>
    <div class="title-box">
      <div class="left"></div>
      <div class="title-txt">主推产品</div>
      <div class="right"></div>
    </div>
    <div class="goods-list">
      <div class="goods-item" v-for="(item, index) in goodsList" :key="index">
        <div class="goods-img-box">
          <img :src="item.image_url" class="goods-img" mode="aspectFill">
        </div>
        <div class="goods-detail">
          <div class="goods-title">{{item.title}}</div>
          <div class="goods-desc">{{item.subtitle}}</div>
        </div>
      </div>
    </div>
    <div class="down-box">
      <img src="./pic-zanbozc@2x.png" class="sponsor">
    </div>

    <div class="msg-fix-box" @click="toChat">
      <img src="./icon-news@2x.png" class="msg-icon">
      <span class="msg-count">22</span>
    </div>
    <div class="cover" v-show="showCover" @click="closeCover">
    </div>
    <div class="bottom-box" :class="showCover ? 'show' : ''">
      <button open-type="share" hover-class="none" class="share-item" @click="behaviorMsg(10009)">发给好友</button>
      <div class="share-item border-top-1px" @click="qrCordImg">生成图片 保存分享</div>
      <div class="share-item last" @click="closeCover">取消</div>
    </div>
    <canvas canvas-id="target" class="canvas"></canvas>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Im} from 'api'
  import {mapGetters} from 'vuex'
  import * as wechat from 'common/js/wechat'
  import {ERR_OK} from 'api/config'
  import webimHandler from 'common/js/webim_handler'

  const shareArr = [1007, 1008, 1036, 1044, 1073, 1074]
  const qrCordArr = [1047, 1048, 1049, 1011, 1012, 1013]
  export default {
    data() {
      return {
        cardMsg: {},
        defaultImg: '../../static/img/pic-none@2x.png',
        goodsList: [],
        page: 1,
        noMore: false,
        isLike: false,
        lickCount: '',
        showCover: false
      }
    },
    onShareAppMessage(res) {
      let title = ` `
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      return {
        title: title,
        path: ''
      }
    },
    async onLoad() {
      let isShare = shareArr.indexOf(this.scene * 1)
      let isQrcord = qrCordArr.indexOf(this.scene * 1)
      let source = isShare !== -1 ? 1 : isQrcord !== -1 ? 2 : 0
      let data = {
        employee_id: this.currentMsg.employeeId,
        from_type: this.currentMsg.fromType,
        from_id: this.currentMsg.fromId,
        source
      }
      await Promise.all([
        this.getCardDetail(data),
        this.getGoodsList()
      ])
      wechat.hideLoading()
    },
    async onReachBottom() {
      if (this.noMore) return
      this.page++
      let res = await Im.getGoodsList(this.page)
      wechat.hideLoading()
      if (res.error === ERR_OK) {
        let resData = res.data
        if (!resData.length) {
          this.noMore = true
          this.page--
        }
        this.goodsList = [...this.goodsList, ...resData]
      }
    },
    methods: {
      toChat() {
        let id = 1
        let url = `/pages/chat-msg/chat-msg?id=${id}`
        wx.navigateTo({url})
        this.behaviorMsg(50001)
      },
      toCards() {
        wx.reLaunch({
          url: '/pages/card-list/card-list'
        })
      },
      async getCardDetail(data) {
        let res = await Im.getCardDetail(data)
        if (res.error === ERR_OK) {
          this.cardMsg = res.data
          this.isLike = this.cardMsg.is_like
          this.likeCount = this.cardMsg.like_count
        }
      },
      async getGoodsList() {
        let res = await Im.getGoodsList(this.page, 3)
        if (res.error === ERR_OK) {
          this.goodsList = res.data
        }
      },
      getQrCordImg() {
        Im.getQrCodeImg(this.currentMsg.id).then((res) => {
          if (res.error === ERR_OK) {
            this.qrCordMsg = res.data
          }
        })
      },
      async dianzan() {
        let id = this.cardMsg.id
        let res
        if (this.isLike) {
          res = await Im.clearZan(id)
          if (res.error === ERR_OK) {
            this.isLike = false
            this.likeCount--
            this.behaviorMsg(10002)
          }
        } else {
          res = await Im.lickZan(id)
          if (res.error === ERR_OK) {
            this.isLike = true
            this.likeCount++
            this.behaviorMsg(10001)
          }
        }
        wechat.hideLoading()
      },
      callPhone() {
        wx.makePhoneCall({
          phoneNumber: this.cardMsg.employee.business_card_mobile
        })
        this.behaviorMsg(10007)
      },
      copyEmail() {
        wx.setClipboardData({
          data: this.cardMsg.employee.email
        })
        this.behaviorMsg(10003)
      },
      showMap() {
        wx.openLocation({name: this.cardMsg.employee.department, address: this.cardMsg.employee.address})
        this.behaviorMsg(10004)
      },
      addContact() {
        wx.addPhoneContact({
          firstName: this.cardMsg.employee.name,
          organization: this.cardMsg.employee.department,
          title: this.cardMsg.employee.position,
          mobilePhoneNumber: this.cardMsg.employee.business_card_mobile
        })
        this.behaviorMsg(10008)
      },
      shareCard() {
        this.showCover = true
      },
      closeCover() {
        this.showCover = false
      },
      qrCordImg() {

      },
      behaviorMsg(code, product) {
        let type = code * 1 === 20005 ? 2 : 1
        /** let descMsg = {
          'flow_id': this.currentMsg.flow_id,
          'type': type,
          'card_holder_id': this.currentMsg.id,
          'merchant_id': wx.getStorageSync('merchantId'),
          'employee_id': this.currentMsg.employee.id,
          'customer_id': wx.getStorageSync('userInfo').id
        }**/
        let descMsg = {
          'flow_id': 1,
          'type': type,
          'card_holder_id': 1,
          'merchant_id': 1,
          'employee_id': 1,
          'customer_id': 1,
          'customer_name': 'abc'
        }
        let desc = JSON.stringify(descMsg)
        let ext = code.toString()
        let data = ''
        if (code * 1 === 20005) {
          data = product
        }
        let option = {
          desc,
          data,
          ext
        }
        // let account = this.currentMsg.employee.im_account
        let account = 'philly'
        webimHandler.onSendCustomMsg(option, account).then(res => {
          console.log(res)
        })
      }
    },
    computed: {
      ...mapGetters([
        'currentMsg',
        'scene'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/base"
  @import "~common/stylus/mixin"
  .card
    width: 100vw
    overflow: hidden
    background: $color-F0F2F5
    position: relative
    .card-top
      position: relative
      .bc-img-box
        width: 100vw
        height: 66vw
        position: relative
        .bc-img
          width: 100%
          height: 100%
        .cards-link
          position: absolute
          width: 40px
          height: 40px
          right: 15px
          top: 20px
          .cards-link-icon
            width: 100%
            height: 100%
          .red-dot
            width: 8px
            height: 8px
            background: $color-F9543C
            border: 1px solid $color-white
            border-radius: 50%
            position: absolute
            right: 2px
            top: 1px
    .card-box
      width: 100%
      box-sizing: border-box
      padding: 0 15px
      margin-top: -20vw
      position: relative
      .card-container
        background: $color-white
        border: 0.5px solid rgba(32,32,46,0.10)
        border-radius: 1px
        box-shadow: 0 4px 12px 0 rgba(43,43,145,0.07)
        width: 100%
        padding: 25px 8vw
        display: flex
        flex-direction: column
        justify-content: center
        box-sizing: border-box
        .name-tel
          line-height: 28px
          margin-bottom: 10px
          .nametxt
            font-family: $font-family-semibold
            font-size: 27px
            letter-spacing: 1.2px
            margin-right: 28px
          .tel
            font-family: $font-family-medium
            font-size: $font-size-16
            color: $color-56BA15
        .job-title
          font-family: $font-family-medium
          font-size: $font-size-14
          margin-bottom: 10px
        .company
          font-family: $font-family-medium
          font-size: $font-size-12
          color: $color-text-88
        .sig-txt
          width: 100%
          padding: 15px 0
          .sig-text-p
            padding: 15px 0
            font-size: $font-size-14
            font-family: $font-family-medium
            width: 100%
            overflow : hidden
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 2
            -webkit-box-orient: vertical
        .btn-box
          display: flex
          justify-content: space-between
          .btn-item
            display: flex
            flex-direction: column
            justify-content: center
            align-items: center
            .btn-icon
              width: 25px
              height: 25px
              margin-bottom: 8px
            .item-txt
              font-size: $font-size-12
              color: $color-text-88
              font-family: $font-family-medium


    .title-box
      margin-top: 10px
      height: 46px
      display: flex
      align-items: center
      justify-content: center
      .title-txt
        font-size: $font-size-16
        font-family: $font-family-light
        margin: 0 5px
      .left, .right
        width: 15px
        height: 16px
        position: relative
        &:after, &:before
          position: absolute
          content: ""
          display: block
          height: 1px
          background: $color-text
        &:before
          width: 15px
          top: 7px
        &:after
          width: 10px
          top: 11px
      .left
        &:before, &:after
          right: 0
      .right
        &:before, &:after
          left: 0


    .msg-container
      padding: 0 15px
      .msg-detail
        background: $color-white
        border: 0.5px solid rgba(32,32,46,0.10)
        border-radius: 1px
        box-shadow: 0 4px 12px 0 rgba(43,43,145,0.07)
        .msg-item
          margin-left: 15px
          height: 60px
          display: flex
          align-items: center
          .left
            flex: 1
            overflow: hidden
            display: flex
            .title
              font-size: $font-size-14
              color: $color-text-88
              font-family: $font-family-medium
              margin-right: 20px
            .text
              flex: 1
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              font-family: $font-family-medium
              font-size: $font-size-14
          .right
            width: 46px
            padding-left: 20px
            display: flex
            align-items: center
            .line
              width: 1px
              height: 17px
              background: $color-ccc
            .icon-box
              width: 15px
              height: 15px
              padding: 15px
              .icon-img
                width: 15px
                height: 15px
        .last-item
          height: 86px
          width: 100%
          display: flex
          align-items: center
          justify-content: center
          .save-btn
            width: 219px
            height: 40px
            background: $color-text
            line-height: 40px
            text-align: center
            font-size: $font-size-14
            color: $color-white
            font-family: $font-family-medium
            border-radius: 1px
            margin-bottom: 15px

    .goods-list
      padding: 0 15px
      .goods-item
        width: 100%
        overflow: hidden
        background: $color-white
        box-shadow: 0 4px 12px 0 rgba(43,43,145,0.07)
        margin-top: 15px
        .goods-img-box
          width: 100%
          padding-bottom: 63.7%
          position: relative
          box-shadow: 0 4px 12px 0 rgba(43,43,145,0.07)
          .goods-img
            width: 100%
            height: 100%
            position: absolute
            left: 0
            top: 0
        .goods-detail
          height: 85px
          padding: 0 15px
          .goods-title
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            font-size: $font-size-16
            font-family: $font-family-medium
            padding-top: 15px
          .goods-desc
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            font-size: $font-size-14
            font-family: $font-family-regular
            padding-top: 10px
      .goods-item:first-child
        margin-top: 0
    .down-box
      width: 100%
      height: 64.5px
      display: flex
      align-items: center
      justify-content: center
      .sponsor
        width: 95px
        height: 33.5px

    .msg-fix-box
      position: fixed
      right: 12px
      bottom: 100px
      width: 63px
      height: 66px
      .msg-icon
        width: 100%
        height: 100%
      .msg-count
        position: absolute
        right: 6px
        top: 3px
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
    .cover
      width: 100%
      height: 100%
      position: absolute
      left: 0
      top: 0
      background: rgba(32, 32, 46, 0.8)
    .bottom-box
      position: fixed
      z-index: 100
      left: 0
      bottom: -100%
      right: 0
      background: $color-F0F2F5
      transition: all .3s
      box-shadow: 0 -4px 12px 0 rgba(43,43,145,0.07)
      .share-item
        width: 100%
        height: 44px
        text-align: center
        line-height: 44px
        font-size: $font-size-14
        font-family: $font-family-regular
        background-color: $color-white
        border: 0 none
        padding: 0
        border-radius: 0
        &:before, &:after
          border: 0 none
      .last
        margin-top: 10px
    .bottom-box.show
      bottom: 0
    .canvas
      position: absolute
      left: 2000px
      top: 2000px
</style>
