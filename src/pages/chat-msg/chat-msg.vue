<template>
  <div class="chat">
    <scroll-view scroll-y class="chat-container" :scroll-into-view="scrollId" @scrolltoupper="loadMore">
      <div class="chat-list">
        <div class="chat-item" v-for="(item, index) in nowChat" :key="index" :id="'item' + index">
          <div class="chat-content" v-if="item.from_account_id !== imAccount">
            <img :src="currentMsg.employee.avatar" class="avatar">
            <div class="chat-msg-box other" >
              <div class="arrow-box">
                <div class="gray-arrow">
                  <div class="white-arrow"></div>
                </div>
              </div>
              <div class="chat-msg-content other">{{item.content}}</div>
            </div>
          </div>
          <div class="chat-content mine" v-if="item.from_account_id === imAccount">
            <div class="chat-msg-box mine" v-if="item.type * 1 === 1">
              <div class="chat-msg-content mine">{{item.content}}</div>
              <div class="arrow-box">
                <div class="green-arrow"></div>
              </div>
            </div>
            <div class="chat-msg-goods" v-if="item.type * 1 === 2">
              <img :src="item.url" class="goods-img">
              <p class="goods-title">{{item.title}}</p>
            </div>
            <img :src="userInfo.avatar" class="avatar">
          </div>
        </div>
      </div>
    </scroll-view>
    <div class="chat-input border-top-1px">
      <div class="input-container" :class="system === 'android' ? 'android' : ''" ref="textBox">
        <textarea auto-height="true" fixed="true" class="textarea" maxlength="-1" @input="textInput" :value="inputMsg"></textarea>
      </div>
      <div class="submit-btn" @click="sendMsg">发送</div>
    </div>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
  import Toast from 'components/toast/toast'
  import {mapActions, mapGetters} from 'vuex'
  import webimHandler from 'common/js/webim_handler'
  import {Im} from 'api'
  import {ERR_OK} from 'api/config'
  import wx from 'common/js/wx'
  import * as wechat from 'common/js/wechat'
  export default {
    name: 'Chat',
    created() {
    },
    onShow() {
      if (this.imLogin) {
        webimHandler.getC2CMsgList(this.currentMsg.account) // 消息已读处理
        this.setNowCountNum(0)
        this.setListUnreadCount(this.currentMsg.account)
      } else {
        wx.showToast({title: '网络连接异常', icon: 'none', duration: 1000})
        setTimeout(() => {
          this.$router.back()
        }, 1000)
      }
    },
    beforeDestroy() {
      this.setCurrent({})
      this.setNowChat([])
    },
    onLoad() {
      this.setImIng(true)
      let phoneInfo = wx.getSystemInfoSync()
      let system = phoneInfo.system
      if (system.indexOf('IOS') !== -1) {
        this.system = 'iphone'
      } else {
        this.system = 'android'
      }
      this.userInfo = wx.getStorageSync('userInfo')
      this.imAccount = this.userInfo.im_account
      let data = {
        page: this.page,
        limit: 30,
        customer_id: this.userInfo.id,
        employee_id: this.currentMsg.employeeId
      }
      Im.getMsgList(data).then((res) => {
        if (res.error === ERR_OK) {
          let list = res.data.reverse()
          this.setNowChat(list)
          this.scrollId = 'item' + (list.length - 1)
        }
        wechat.hideLoading()
      })
    },
    onUnload() {
      this.setImIng(false)
    },
    methods: {
      ...mapActions([
        'setNowChat',
        'setImIng',
        'setNowCountNum',
        'setListUnreadCount'
      ]),
      loadMore() {
        if (this.noMore) return
        let data = {
          page: this.page++,
          limit: 30,
          customer_id: this.userInfo.id,
          employee_id: this.currentMsg.employee.im_account
        }
        Im.getMsgList(data).then((res) => {
          if (res.error === ERR_OK) {
            if (res.data.length) {
              let resData = res.data.reverse()
              let list = [...resData, ...this.nowChat]
              this.setNowChat(list)
            } else {
              this.noMore = true
              this.page--
            }
          }
          wechat.hideLoading()
        })
      },
      sendMsg() {
        let value = this.inputMsg.trim()
        if (!value) {
          this.$refs.toast.show('发送消息不能为空')
          return
        }
        webimHandler.onSendMsg(value, 'philly').then(res => {
          let msg = {
            from_account_id: this.userInfo.im_account,
            avatar: this.userInfo.avatar,
            content: value,
            time: res.MsgTime,
            msgTimeStamp: res.MsgTime,
            nickName: this.userInfo.nickname,
            sessionId: this.userInfo.im_account,
            unreadMsgCount: 0,
            type: 1
          }
          let list = [...this.nowChat, msg]
          this.setNowChat(list)
          this.inputMsg = ''
          this.scrollId = 'item' + (list.length - 1)
        }, err => {
          this.$refs.toast.show(err)
        })
      },
      textInput(e) {
        this.inputMsg = e.mp.detail.value
      }
    },
    data() {
      return {
        inputMsg: '',
        list: [1, 2, 3, 4],
        id: '',
        page: 1,
        userInfo: {},
        imAccount: '',
        scrollId: 'item0'
      }
    },
    components: {
      Toast
    },
    computed: {
      ...mapGetters([
        'currentMsg',
        'nowChat',
        'imLogin'
      ])
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .chat
    width: 100vw
    height: 100vh
    position: fixed
    left: 0
    top: 0
    background: $color-background
    display: flex
    flex-direction: column
    justify-content: space-between
    z-index: 200
    .chat-container
      width: 100%
      height: 100vh
      padding-bottom: 38px
      box-sizing: border-box
      .chat-list
        padding-bottom: 40px
      .chat-item
        padding: 0 15px
        margin-top: 15px
        .chat-content
          display: flex
          .avatar
            width: 45px
            height: 45px
          .chat-msg-box
            flex: 1
            overflow: hidden
            display: flex
            .chat-msg-content
              padding: 13px 15px
              border-radius: 8px
              line-height: 19px
              font-size: $font-size-14
              font-family: $font-family-medium
              word-wrap: break-word
              word-break: break-all
            .chat-msg-content.other
              background: $color-white
              border: 0.5px solid #D6DCE0
            .chat-msg-content.mine
              background: $color-green
          .other.chat-msg-box
            margin-right: 50px
            .arrow-box
              width: 10px
              height: 45px
              position: relative
              .gray-arrow
                width:0
                height:0
                border-width: 5px 6px 5px 0
                border-style: solid
                border-color: transparent #D6DCE0 transparent transparent/*透明 灰 透明 透明 */
                position: absolute
                right: 0
                top: 17.5px
                .white-arrow
                  width:0
                  height:0
                  border-width: 5px 6px 5px 0
                  border-style: solid
                  border-color: transparent #FFF transparent transparent/*透明 灰 透明 透明 */
                  position: absolute
                  left: 1px
                  top: -5px
          .mine.chat-msg-box
            margin-left: 50px
            justify-content: flex-end
            .arrow-box
              width: 10px
              height: 45px
              position: relative
              .green-arrow
                width:0
                height:0
                border-width: 5px 0 5px 6px
                border-style: solid
                border-color: transparent transparent transparent $color-green/*透明 灰 透明 透明 */
                position: absolute
                left: 0
                top: 17.5px
          .chat-msg-goods
            width: 200px
            height: 150px
            border: 0.5px solid rgba(0,0,0,0.10)
            border-radius: 8px
            background: $color-white
            margin-right: 6px
            overflow: hidden
            font-size: 0
            .goods-img
              width: 100%
              height: 120px
            .goods-title
              line-height: 30px
              font-size: $font-size-12
              font-family: $font-family-regular
              padding: 0 10px
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              color: $color-text
        .chat-content.mine
          justify-content: flex-end

    .chat-input
      position: fixed
      left: 0
      bottom: 0
      right: 0
      min-height: 38px
      background: $color-background-f9
      padding: 6px 15px
      display: flex
      align-items: flex-end
      .submit-btn
        width: 50px
        height: 36px
        border: 1px solid rgba(0,0,0,0.10)
        border-radius: 2px
        background: $color-white
        text-align: center
        line-height: 36px
        font-size: $font-size-14
        font-family: $font-family-meddle
        margin-left: 5px
      .input-container
        flex: 1
        min-height: 36px
        border: 1px solid rgba(0,0,0,0.10)
        background: $color-white
        overflow-y: auto
        padding: 0 10px
        .textarea
          width: 100%
          max-height: 100px
          padding: 0
          margin: 0
          border: 0 none
          font-size: $font-size-14
      .android.input-container
        min-height: 28px
        padding-top: 8px
</style>
