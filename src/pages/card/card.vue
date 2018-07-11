<template>
  <div class="card">
    <div class="card-top">
      <div class="bc-img-box">
        <img src="https://picsum.photos/800/800/?image=534" class="bc-img" mode="aspectFill">
        <div class="cards-link">
          <img src="./icon-change@2x.png" class="cards-link-icon">
        </div>
      </div>
      <div class="card-box">
        <div class="card-box-content">
          <img src="./bg-cardholder@2x.png" class="card-box-bc">
          <div class="card-container">
            <p class="name-tel"><text class="name">张三丰</text><text class="tel">15920571999</text></p>
            <p class="job-title">产品经理</p>
            <p class="company">广州集客网络科技有限公司</p>
            <div class="sig-txt">
              <p class="sig-text-p">“ 生活，总是把我们打磨的光鲜圆润 ”</p>
            </div>
            <div class="btn-box">
              <div class="btn-item">
                <img src="./icon-hot@2x.png" class="btn-icon">
                <div class="item-txt">人气 856</div>
              </div>
              <div class="btn-item">
                <img src="./icon-zan@2x.png" class="btn-icon" v-if="false">
                <img src="./icon-zan_select@2x.png" class="btn-icon">
                <div class="item-txt">点赞 856</div>
              </div>
              <div class="btn-item">
                <img src="./icon-intransit@2x.png" class="btn-icon">
                <div class="item-txt">转发 856</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="title-box">
        <div class="left"></div>
        <div class="title-txt">个人信息</div>
        <div class="right"></div>
      </div>
      <div class="msg-container">
        <div class="msg-detail">
          <div class="msg-item border-bottom-1px">
            <div class="left">
              <div class="title">手机</div>
              <div class="text">456451232121</div>
            </div>
            <div class="right">
              <div class="line"></div>
              <div class="icon-box">
                <img src="./icon-tel@2x.png" class="icon-img">
              </div>
            </div>
          </div>
          <div class="msg-item border-bottom-1px">
            <div class="left">
              <div class="title">邮箱</div>
              <div class="text">45645421565@qq.com</div>
            </div>
            <div class="right">
              <div class="line"></div>
              <div class="icon-box">
                <img src="./icon-email@2x.png" class="icon-img">
              </div>
            </div>
          </div>
          <div class="msg-item border-bottom-1px">
            <div class="left">
              <div class="title">地址</div>
              <div class="text">交话费卡积分兑换就恢复尽快发货单放机和的京东方金凤凰</div>
            </div>
            <div class="right">
              <div class="line"></div>
              <div class="icon-box">
                <img src="./icon-address@2x.png" class="icon-img">
              </div>
            </div>
          </div>
          <div class="last-item">
            <div class="save-btn">同步到通讯录</div>
          </div>
        </div>
      </div>
      <div class="title-box">
        <div class="left"></div>
        <div class="title-txt">主推产品</div>
        <div class="right"></div>
      </div>
      <div class="goods-list">
        <div class="goods-item">
          <div class="goods-img-box">
            <img src="https://picsum.photos/800/800/?image=522" class="goods-img" mode="aspectFill">
          </div>
          <div class="goods-detail">
            <div class="goods-title">较好的较好的复旦复华</div>
            <div class="goods-desc">还记得附件的防守对方换届大会较好的粉红色接口对接都发火</div>
          </div>
        </div>
      </div>
      <div class="down-box">
        <img src="./pic-zanbozc@2x.png" class="sponsor">
      </div>
    </div>
    <div class="msg-fix-box" @click="toChat">
      <img src="./icon-news@2x.png" class="msg-icon">
      <span class="msg-count">22</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
      }
    },
    methods: {
      toChat() {
        let id = 1
        let url = `/pages/chat-msg/chat-msg?id=${id}`
        wx.navigateTo({url})
      }
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
    .card-top
      .bc-img-box
        width: 100vw
        height: 0
        padding-bottom: 66%
        position: relative
        .bc-img
          width: 100%
          height: 100%
          position: absolute
          left: 0
          top: 0
        .cards-link
          position: absolute
          width: 40px
          height: 40px
          right: 15px
          top: 20px
          .cards-link-icon
            width: 100%
            height: 100%
      .card-box
        padding: 0 15px
        margin-top: -20vw
        .card-box-content
          height: 0
          padding-bottom: 73.9%
          position: relative
          background: $color-white
          border: 0.5px solid rgba(32,32,46,0.10)
          border-radius: 1px
          box-shadow: 0 4px 12px 0 rgba(43,43,145,0.07)
          .card-box-bc
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
          .card-container
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
            padding: 0 8vw
            display: flex
            flex-direction: column
            justify-content: center
            box-sizing: border-box
            .name-tel
              line-height: 28px
              margin-bottom: 8px
              .name
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
              margin-bottom: 8px
            .company
              font-family: $font-family-medium
              font-size: $font-size-12
              color: $color-text-88
            .sig-txt
              width: 100%
              height: 21vw
              display: flex
              align-items: center
              .sig-text-p
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
</style>
