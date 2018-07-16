import {mapGetters, mapActions} from 'vuex'
import {Im} from 'api'
import {ERR_OK} from 'api/config'
import webimHandler from 'common/js/webim_handler'

const base = {
  methods: {
    ...mapActions([
      'setTargetPage',
      'setCurrentMsg',
      'setCustomCount',
      'setNowCount',
      'addNowChat',
      'setCardListUnRead',
      'setImLogin',
      'getCardList',
      'clearBehaviorList',
      'setNowCountNum',
      'setDescMsg'
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
              this.setCustomCount(res.fromAccount)
              if (this.currentMsg.account && (res.fromAccount === this.currentMsg.account)) {
                if (!this.imIng) {
                  this.setNowCount('add')
                } else {
                  this.addNowChat(res)
                }
              }
            }, // 监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
            'onGroupSystemNotifys': (msg) => {
            } // 监听（多终端同步）群系统消息事件，必填
          }

          let options = {
            'isAccessFormalEnv': true, // 是否访问正式环境，默认访问正式，选填
            'isLogOn': false// 是否开启控制台打印日志,默认开启，选填
          }

          let avatar = userInfo.avatar
          webimHandler.sdkLogin(loginInfo, listeners, options, avatar).then(async () => {
            this.setImLogin(true)
            // 建立连接
            let employeeId = wx.getStorageSync('employeeId')
            if (employeeId) {
              let reqData = {
                customer_id: userInfo.id,
                employee_id: employeeId,
                source: this.fromMsg.source,
                from_type: this.fromMsg.fromType,
                from_id: this.fromMsg.fromId
              }
              let resData = await Im.getConect(reqData, false)
              if (resData.error === ERR_OK) {
                let currentMsg = {
                  employeeId: resData.data.employee_id,
                  flowId: resData.data.flow_id,
                  nickName: resData.data.employee_name,
                  avatar: resData.data.employee_avatar,
                  account: resData.data.employee_im_account
                }
                let descMsg = {
                  flow_id: resData.data.flow_id,
                  card_holder_id: resData.data.card_holder_id,
                  merchant_id: resData.data.merchant_id,
                  employee_id: resData.data.employee_id,
                  customer_id: userInfo.id,
                  customer_name: userInfo.nickname
                }
                wx.setStorageSync('merchantId', resData.data.merchant_id)
                this.setCurrentMsg(currentMsg)
                this.setDescMsg(descMsg)
              }
            }
            // 读取名片夹列表
            this.getCardList(1)
            // 执行待完成的行为动作数组
            if (this.behaviorList.length && employeeId) {
              Promise.all(this.behaviorList.forEach((item) => {
                webimHandler.onSendCustomMsg(item, this.currentMsg.account)
              })).then(() => {
                this.clearBehaviorList()
              })
            }
            // 读取当前员工的未读信息
            if (employeeId) {
              let count = await webimHandler.getAnyUnread(this.currentMsg.account)
              this.setNowCountNum(count)
            }
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'currentMsg',
      'imIng',
      'cardList',
      'behaviorList',
      'fromMsg'
    ])
  }
}

export default base
