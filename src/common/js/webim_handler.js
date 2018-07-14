import webim from 'common/js/webim'

export default class webimHandler {
  static loginInfo = ''
  static selSess = '' // 当前会话
  static selType = 'C2C' // 会话类型，暂时默认C2C
  // sdk登录
  static sdkLogin (userInfo, listeners, options, avatar) {
    // web sdk 登录
    return new Promise((resolve, reject) => {
      webim.login(userInfo, listeners, options, async identifierNick => {
        // identifierNick为登录用户昵称(没有设置时，为帐号)，无登录态时为空
        console.debug(identifierNick)
        this.loginInfo = userInfo
        await this.setProfilePortrait({
          'ProfileItem': [
            { 'Tag': 'Tag_Profile_IM_Nick', 'Value': userInfo.identifierNick },
            { 'Tag': 'Tag_Profile_IM_Image', 'Value': avatar }
          ]
        })
        resolve()
        webim.Log.info('webim登录成功')
      },
      function(err) {
        console.error(err.ErrorInfo)
        reject(err)
      })
    })
  }

  // 修改帐号名称和头像
  static setProfilePortrait (options) {
    return new Promise((resolve, reject) => {
      webim.setProfilePortrait(options,
        res => {
          webim.Log.info('修改昵称成功')
          resolve()
        },
        err => {
          reject(err)
        }
      )
    })
  }

  // 获取最近联系人列表
  static getRecentContact (num = 10) {
    return new Promise((resolve, reject) => {
      webim.getRecentContactList({
        'Count': num // 最近的会话数 ,最大为 100
      }, resp => {
        console.log(resp)
        if (resp.SessionItem && resp.SessionItem.length > 0) {
          let data = Promise.all(resp.SessionItem.map(async (item) => {
            let type = item.Type
            if (type === webim.RECENT_CONTACT_TYPE.C2C) {
              let typeZn = '私聊'
              let info = await this.getCustomerMsg(item.To_Account)
              item = {
                type,
                typeZn,
                sessionId: item.To_Account,
                avatar: info.avatar,
                nickName: info.name,
                lastMsg: item.MsgShow,
                msgTimeStamp: item.MsgTimeStamp,
                msgSeq: item.MsgSeq,
                msgRandom: item.MsgRandom, // 消息随机数
                unreadMsgCount: item.UnreadMsgCount
              }
              return item
            }
          }))
          resolve(data)
        }
        // 业务处理
      }, err => {
        // 错误回调
        reject(err)
      })
    })
  }

  // 初始化未读数
  static async initUnread (data) {
    let sessMap = await this.getUnread()
    data.forEach((item) => {
      let name = 'C2C' + item.employee.im_account
      if (sessMap[name]) {
        item.unReadMsgCount = sessMap[name].unread()
      } else {
        item.unReadMsgCount = 0
      }
    })
    return new Promise((resolve, reject) => {
      resolve(data)
    })
  }
  // 获取当前用户的未读消息数
  static async getAnyUnread(account) {
    let sessMap = await this.getUnread()
    let name = 'C2C' + account
    if (sessMap[name]) {
      return sessMap[name].unread()
    } else {
      return 0
    }
  }

  // 获取未读会话数据
  static getUnread () {
    return new Promise((resolve, reject) => {
      webim.syncMsgs(() => {
        let sessMap = webim.MsgStore.sessMap()
        resolve(sessMap)
      })
    })
  }

  // 监听新消息(私聊(包括普通消息、全员推送消息)，普通群(非直播聊天室)消息)事件
  // newMsgList 为新消息数组，结构为[Msg]
  static onMsgNotify (newMsgList) {
    return new Promise(async (resolve, reject) => {
      let newMsg = newMsgList[0]
      let res = await this.handlderMsg(newMsg)
      resolve(res)
    })
  }

  // 处理消息（私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息）
  static handlderMsg (msg) {
    let fromAccount, fromAccountNick, sessType, subType, content, isSelfSend, seq, random
    return new Promise(async (resolve, reject) => {
      fromAccount = msg.getFromAccount()
      if (!fromAccount) {
        fromAccount = ''
      }

      fromAccountNick = msg.getFromAccountNick()
      if (!fromAccountNick) {
        fromAccountNick = fromAccount
      }

      // 解析消息
      // 获取会话类型
      // webim.SESSION_TYPE.GROUP-群聊，
      // webim.SESSION_TYPE.C2C-私聊，
      sessType = msg.getSession().type()
      // 获取消息子类型
      // 会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
      // 会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
      subType = msg.getSubType()
      seq = msg.getSeq()
      random = msg.getRandom()
      isSelfSend = msg.getIsSend() // 消息是否是自己发送

      switch (sessType) {
        case webim.SESSION_TYPE.C2C:// 私聊消息
          switch (subType) {
            case webim.C2C_MSG_SUB_TYPE.COMMON:// c2c普通消息
              // 业务可以根据发送者帐号fromAccount是否为app管理员帐号，来判断c2c消息是否为全员推送消息，还是普通好友消息
              // 或者业务在发送全员推送消息时，发送自定义类型(webim.MSG_ELEMENT_TYPE.CUSTOM,即TIMCustomElem)的消息，在里面增加一个字段来标识消息是否为推送消息
              content = await this.parseMsg(msg)
              // // c2c消息一定要调用已读上报接口
              // let opts = {
              //   'To_Account': fromAccount, // 好友帐号
              //   'LastedMsgTime': msg.getTime()// 消息时间戳
              // }
              // webim.c2CMsgReaded(opts)
              let customer = await this.getCustomerMsg(fromAccount)
              let data = Object.assign({}, { fromAccount, fromAccountNick, avatar: customer.avatar, isSelfSend, time: msg.getTime() }, content, seq, random)
              resolve(data)
              console.error('收到一条c2c消息(好友消息或者全员推送消息): 发送人=' + fromAccountNick + ', 内容=' + content)
              break
          }
          break
      }
    })
  }

  // 解析消息
  static parseMsg (msg) {
    return new Promise(async (resolve, reject) => {
      let data
      let elems = msg.getElems() // 获取消息包含的元素数组
      let elem = elems[0]
      let type = elem.getType() // 获取元素类型
      let content = elem.getContent() // 获取元素对象
      console.log(type, content)
      switch (type) {
        case webim.MSG_ELEMENT_TYPE.TEXT: // 聊天
          data = {
            type: 'chat', // 聊天
            text: content.getText() // 内容
          }
          resolve(data)
          break
        case webim.MSG_ELEMENT_TYPE.CUSTOM: // 自定义消息
          data = {
            type: 'custom', // 自定义
            data: content.getData(), // 内容
            desc: content.getDesc(), // 描述
            ext: content.getExt() // 扩展
          }
          resolve(data)
          break
      }
    })
  }

  // 读取用户资料 昵称 头像
  static getCustomerMsg (fromAccount) {
    let ops = {
      'To_Account': [fromAccount],
      'TagList': ['Tag_Profile_IM_Nick', 'Tag_Profile_IM_Image']
    }
    return new Promise((resolve, reject) => {
      webim.getProfilePortrait(ops, (res) => {
        let arr = res.UserProfileItem[0].ProfileItem
        let nickName = arr.filter((item) => {
          return item.Tag === 'Tag_Profile_IM_Nick'
        })[0]
        let nickAvatar = arr.filter((item) => {
          return item.Tag === 'Tag_Profile_IM_Image'
        })[0]
        resolve({ name: nickName.Value, avatar: nickAvatar.Value })
      }, (err) => {
        reject(err)
      })
    })
  }

  // 发送消息
  static sendMsg (msg) {
    return new Promise((resolve, reject) => {
      webim.sendMsg(msg, resp => {
        if (this.selType === webim.SESSION_TYPE.C2C) {
          resolve(resp)
        }
        webim.Log.info('发消息成功')
      }, err => {
        webim.Log.error('发消息失败:' + err.ErrorInfo)
        reject(err)
      })
    })
  }

  // 发送消息(聊天消息)
  static onSendMsg (msg, msgToId) {
    let msgtosend = msg
    let msgLen = webim.Tool.getStrBytes(msg)
    return new Promise(async (resolve, reject) => {
      // 获取消息内容
      let maxLen, errInfo
      maxLen = webim.MSG_MAX_LENGTH.C2C
      errInfo = '消息长度超出限制(最多' + Math.round(maxLen / 3) + '汉字)'
      if (msgLen > maxLen) {
        reject(errInfo)
        return
      }
      if (!this.selSess || this.selSess.id !== msgToId) {
        this.selSess = new webim.Session(this.selType, msgToId)
      }
      let isSend = true // 是否为自己发送
      let seq = -1 // 消息序列，-1表示sdk自动生成，用于去重
      let random = Math.round(Math.random() * 4294967296) // 消息随机数，用于去重
      let msgTime = Math.round(new Date().getTime() / 1000) // 消息时间戳
      let subType = webim.C2C_MSG_SUB_TYPE.COMMON
      let msg = new webim.Msg(this.selSess, isSend, seq, random, msgTime, this.loginInfo.identifier, subType, this.loginInfo.identifierNick)
      // 解析文本和表情
      let expr = /\[[^[\]]{1,3}\]/mg
      let emotions = msgtosend.match(expr)
      let textObj, faceObj, tmsg, emotionIndex, emotion, restMsgIndex
      if (!emotions || emotions.length < 1) {
        textObj = new webim.Msg.Elem.Text(msgtosend)
        msg.addText(textObj)
      } else { // 有表情
        for (let i = 0; i < emotions.length; i++) {
          tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]))
          if (tmsg) {
            textObj = new webim.Msg.Elem.Text(tmsg)
            msg.addText(textObj)
          }
          emotionIndex = webim.EmotionDataIndexs[emotions[i]]
          emotion = webim.Emotions[emotionIndex]
          if (emotion) {
            faceObj = new webim.Msg.Elem.Face(emotionIndex, emotions[i])
            msg.addFace(faceObj)
          } else {
            textObj = new webim.Msg.Elem.Text(emotions[i])
            msg.addText(textObj)
          }
          restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length
          msgtosend = msgtosend.substring(restMsgIndex)
        }
        if (msgtosend) {
          textObj = new webim.Msg.Elem.Text(msgtosend)
          msg.addText(textObj)
        }
      }
      this.sendMsg(msg).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  }

  // 发送自定义消息
  static onSendCustomMsg (ops, msgToId) {
    return new Promise((resolve, reject) => {
      if (!this.selSess || this.selSess.id !== msgToId) {
        this.selSess = new webim.Session(this.selType, msgToId)
      }
      let isSend = true // 是否为自己发送
      let seq = -1 // 消息序列，-1表示sdk自动生成，用于去重
      let random = Math.round(Math.random() * 4294967296) // 消息随机数，用于去重
      let msgTime = Math.round(new Date().getTime() / 1000) // 消息时间戳
      let subType = webim.C2C_MSG_SUB_TYPE.COMMON
      let msg = new webim.Msg(this.selSess, isSend, seq, random, msgTime, this.loginInfo.identifier, subType, this.loginInfo.identifierNick)
      let customObj = new webim.Msg.Elem.Custom(ops.data, ops.desc, ops.ext)
      msg.addCustom(customObj)
      this.sendMsg(msg).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  }

  // 获取C2C历史消息并设成已读状态
  // id 要拉取的好友id
  static getC2CMsgList (id) {
    let options = {
      'Peer_Account': id, // 好友帐号
      'MaxCnt': 1, // 拉取消息条数
      LastMsgTime: 0, // 最近的消息时间，即从这个时间点向前拉取历史消息
      MsgKey: ''
    }
    return new Promise((resolve, reject) => {
      webim.getC2CHistoryMsgs(
        options,
        resp => {
          if (resp.MsgList.length === 0) {
            webim.Log.error('没有历史消息了:data=' + JSON.stringify(options))
          } else {
            let selSess = resp.MsgList[0].sess
            webim.setAutoRead(selSess, true, true)
          }
          resolve('success')
        },
        err => {
          reject(err)
        }
      )
    })
  }

  // 监听连接状态回调变化事件
  static onConnNotify (resp) {
    switch (resp.ErrorCode) {
      case webim.CONNECTION_STATUS.ON:
        webim.Log.warn('连接状态正常...')
        break
      case webim.CONNECTION_STATUS.OFF:
        webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常')
        break
      default:
        webim.Log.error('未知连接状态,status=' + resp.ErrorCode)
        break
    }
  }
}
