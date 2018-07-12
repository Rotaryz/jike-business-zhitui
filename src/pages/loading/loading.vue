<template>
  <div class="loading">
    <img src="./pic-impower@2x.png" class="loading-icon">
    <div class="loading-title">赞播智推欢迎你</div>
    <div class="loading-txt">请微信授权登录后查看销售员名片</div>
    <div class="loading-txt">你的信息和数据将受到保护</div>
    <div class="btn-box">
      <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo" class="loading-btn" hover-class="none">微信授权登录</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as wechat from 'common/js/wechat'
  import {Im} from 'api'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'
  import {chackTabPage} from 'common/js/util'
  import base from 'common/mixins/base'
  export default {
    mixins: [base],
    name: 'Loading',
    data() {
      return {
      }
    },
    methods: {
      async onGotUserInfo(e) {
        let res = e.mp.detail
        if (res.errMsg !== 'getUserInfo:ok') return
        let iv = res.iv
        let encryptedData = res.encryptedData
        let resCode = await wechat.login()
        let code = resCode.code
        let data = {
          iv,
          encryptedData,
          code
        }
        Im.getToken(data).then(async (resData) => {
          if (resData.error === ERR_OK) {
            let resMsg = resData.data
            wx.setStorageSync('userInfo', resMsg.customer_info)
            wx.setStorageSync('token', resMsg.access_token)
            console.log(this)
            await this.loginIm()
            if (chackTabPage(this.targetPage)) {
              wx.switchTab({url: this.targetPage})
            } else {
              wx.redirectTo({url: this.targetPage})
            }
          }
          wechat.hideLoading()
        })
      }
    },
    computed: {
      ...mapGetters([
        'targetPage'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/base"
  @import "~common/stylus/mixin"

  .loading
    width: 100vw
    height: 100vh
    display: flex
    flex-direction: column
    align-items: center
    .loading-icon
      width: 108.5px
      height: 102.5px
      padding: 25vw 0 25px
    .loading-title
      font-size: $font-size-16
      font-family: $font-family-medium
      letter-spacing: 0.6px
      margin-bottom: 20px
    .loading-txt
      font-size: $font-size-14
      color: $color-text-88
      font-family: $font-family-regular
      line-height: 19px
    .btn-box
      width: 100%
      box-sizing: border-box
      padding: 25px 20px 0
      .loading-btn
        width: 100%
        height: 40px
        border-radius: 2px
        background: $color-56BA15
        text-align: center
        line-height: 40px
        font-size: $font-size-14
        color: $color-white
        font-family: $font-family-regular
        &:before, &:after
          border: 0 none
</style>
