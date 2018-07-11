<script>
  import wx from 'common/js/wx'
  import {mapActions, mapGetters} from 'vuex'
  import {getParams} from 'common/js/util'
  import {Im} from 'api'
  import {ERR_OK} from 'api/config'
  import webimHandler from 'common/js/webim_handler'
  export default {
    mpType: 'app',
    created() {
    },
    async onShow(options) {
      this.setTargetPage('/' + options.path)// 设置目标页面
      let token = wx.getStorageSync('token')
      if (!token) {
        wx.reLaunch({url: `/pages/loading/loading`})
      } else {
        await this.loginIm()
      }
      let fromType, fromId, employeeId
      if (options.query.scene) { // 小程序码进来
        let sceneMsg = decodeURIComponent(options.query.scene)
        const params = getParams(sceneMsg)
        fromType = params.ft
        fromId = params.fi
        employeeId = params.e
      } else {
        fromType = options.query.fromType ? options.query.fromType : ''
        fromId = options.query.fromId ? options.query.fromId : ''
        employeeId = options.query.employeeId ? options.query.employeeId : ''
      }
      this.setCurrentMsg({fromType, fromId, employeeId})
      wx.setStorageSync('employeeId', employeeId)
      this.setScene(options.scene)
    },
    onLaunch(option) {
    },
    methods: {
      ...mapActions([
        'setTargetPage',
        'setCurrentMsg',
        'setScene'
      ]),
      async loginIm() {
        let userInfo = wx.getStorageSync('userInfo')
        let imAccount = userInfo.im_account
        Im.getImInfo(imAccount, false).then(async (res) => {
          if (res.error === ERR_OK) {
            let imInfo = res.data
            let loginInfo = {
              'sdkAppID': imInfo.im_sdk_appid, // 用户所属应用id,必填
              'appIDAt3rd': imInfo.im_sdk_appid, // 用户所属应用id，必填
              'accountType': imInfo.im_sdk_acounttype, // 用户所属应用帐号类型，必填
              'identifier': imInfo.im_account, // 当前用户ID,必须是否字符串类型，选填
              'identifierNick': userInfo.nickname, // 当前用户昵称，选填
              'userSig': imInfo.sig // 当前用户身份凭证，必须是字符串类型，选填
            }

            // 监听事件
            let listeners = {
              'onConnNotify': (resp) => {
                webimHandler.onConnNotify(resp)
              }, // 选填
              'onMsgNotify': async (msg) => {
                let res = await webimHandler.onMsgNotify(msg)
                console.log(res)
              }, // 监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
              'onGroupSystemNotifys': (msg) => {
              } // 监听（多终端同步）群系统消息事件，必填
            }

            let options = {
              'isAccessFormalEnv': true, // 是否访问正式环境，默认访问正式，选填
              'isLogOn': false// 是否开启控制台打印日志,默认开启，选填
            }

            let avatar = userInfo.avatar
            await webimHandler.sdkLogin(loginInfo, listeners, options, avatar)
          }
        })
      }
    },
    computed: {
      ...mapGetters([
        'currentMsg'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/index.styl"
</style>
