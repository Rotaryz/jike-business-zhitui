import webim from './webim.js'
console.log(webim)

export default class webimHandler {
  static selToID = ''
  static loginInfo = ''
  static accountMode = ''
  static accountType = ''
  static sdkAppID = ''
  static selType = '' // 会话类型
  static selSess = '' // 当前聊天会话
  static selSessHeadUrl = ''
  static avatar = ''
  static getMsgListInfo = {}
  // sdk登录
  static sdkLogin(userInfo, listeners, options) {
    // web sdk 登录
    return new Promise((resolve, reject) => {
      webim.login(userInfo, listeners, options, async identifierNick => {
        // identifierNick为登录用户昵称(没有设置时，为帐号)，无登录态时为空
        console.debug(identifierNick)
        this.loginInfo = userInfo
        await this.setProfilePortrait({
          'ProfileItem': [
            {'Tag': 'Tag_Profile_IM_Nick', 'Value': userInfo.identifierNick},
            {'Tag': 'Tag_Profile_IM_Image', 'Value': this.avatar}
          ]
        })
        resolve()
        webim.Log.info('webim登录成功')
      },
      function (err) {
        console.error(err.ErrorInfo)
        reject(err)
      })
    })
  }

  // 修改帐号名称和头像
  static setProfilePortrait(options) {
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
  static getRecentContact(num = 10) {
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
                msgTimeStamp: webim.Tool.formatTimeStamp(item.MsgTimeStamp),
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
  static async initUnread(data) {
    let sessMap = await this.getUnread()
    console.log(data, sessMap)
    data.forEach((item) => {
      let name = 'C2C' + item.sessionId
      if (sessMap[name]) {
        let sess = sessMap[name]
        let arr = sess.msgs()
        console.log(sess.msgs())
        let textArr = arr.filter((item) => {
          let type = item.getElems()[0].type
          return type === webim.MSG_ELEMENT_TYPE.TEXT
        })
        let customArr = arr.filter((item) => {
          let elems = item.getElems() // 获取消息包含的元素数组
          let elem = elems[0]
          let type = elem.type
          let ext
          if (type === webim.MSG_ELEMENT_TYPE.CUSTOM) {
            let content = elem.getContent() // 获取元素对象
            ext = content.getExt()
          }
          return type === webim.MSG_ELEMENT_TYPE.CUSTOM && ext !== 20005
        })
        item.unreadMsgCount = textArr.length
        item.unreadCustomCount = customArr.length
      }
    })
    // for (let i in sessMap) {
    //   let sess = sessMap[i]
    //   data.forEach((item) => {
    //     if (item.sessionId === sess.id()) {
    //       let arr = sess.msgs()
    //       console.log(sess.msgs())
    //       let textArr = arr.filter((item) => {
    //         let type = item.getElems()[0].type
    //         return type === webim.MSG_ELEMENT_TYPE.TEXT
    //       })
    //       let customArr = arr.filter((item) => {
    //         let elems = item.getElems() // 获取消息包含的元素数组
    //         let elem = elems[0]
    //         let type = elem.type
    //         let ext
    //         if (type === webim.MSG_ELEMENT_TYPE.CUSTOM) {
    //           let content = elem.getContent() // 获取元素对象
    //           ext = content.getExt()
    //         }
    //         return type === webim.MSG_ELEMENT_TYPE.CUSTOM && ext !== 20005
    //       })
    //       item.unreadMsgCount = textArr.length
    //       item.unreadCustomCount = customArr.length
    //     }
    //   })
    // }
    return new Promise((resolve, reject) => {
      resolve(data)
    })
    // return new Promise((resolve, reject) => {
    //   webim.syncMsgs(() => {
    //     let sessMap = webim.MsgStore.sessMap()
    //     for (let i in sessMap) {
    //       let sess = sessMap[i]
    //       data.forEach((item) => {
    //         if (item.sessionId === sess.id()) {
    //           item.unreadMsgCount = sess.unread()
    //         }
    //       })
    //     }
    //   })
    //   resolve(data)
    // })
  }

  // 获取未读会话数据
  static getUnread() {
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
    console.log('收到1')
    return new Promise(async (resolve, reject) => {
      let newMsg = newMsgList[0]
      let res = await this.handlderMsg(newMsg)
      resolve(res)
    })
  }

  // 处理消息（私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息）
  static handlderMsg(msg) {
    console.log('收到2')
    let fromAccount, fromAccountNick, sessType, subType, content, isSelfSend
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
      isSelfSend = msg.getIsSend() // 消息是否是自己发送

      switch (sessType) {
        case webim.SESSION_TYPE.C2C:// 私聊消息
          switch (subType) {
            case webim.C2C_MSG_SUB_TYPE.COMMON:// c2c普通消息
              console.log('收到3')
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
              let time = webim.Tool.formatTimeStamp(msg.getTime())
              let data = Object.assign({}, {fromAccountNick, avatar: customer.avatar, isSelfSend, time}, content)
              resolve(data)
              console.error('收到一条c2c消息(好友消息或者全员推送消息): 发送人=' + fromAccountNick + ', 内容=' + content)
              break
          }
          break
      }
    })
  }

  // 解析消息
  static parseMsg(msg) {
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
  static getCustomerMsg(fromAccount) {
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
        resolve({name: nickName.Value, avatar: nickAvatar.Value})
      }, (err) => {
        reject(err)
      })
    })
  }

  // 发送消息
  static sendMsg(msg) {
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
  static onSendMsg(msg) {
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
      if (!this.selSess) {
        this.selSess = new webim.Session(this.selType, this.selToID, this.selToID, this.selSessHeadUrl, Math.round(new Date().getTime() / 1000))
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
  static onSendCustomMsg(data = '', desc = '', ext = '') {
    return new Promise((resolve, reject) => {
      if (!this.selSess) {
        this.selSess = new webim.Session(this.selType, this.selToID, this.selToID, this.selSessHeadUrl, Math.round(new Date().getTime() / 1000))
      }
      let isSend = true // 是否为自己发送
      let seq = -1 // 消息序列，-1表示sdk自动生成，用于去重
      let random = Math.round(Math.random() * 4294967296) // 消息随机数，用于去重
      let msgTime = Math.round(new Date().getTime() / 1000) // 消息时间戳
      let subType = webim.C2C_MSG_SUB_TYPE.COMMON
      let msg = new webim.Msg(this.selSess, isSend, seq, random, msgTime, this.loginInfo.identifier, subType, this.loginInfo.identifierNick)
      let customObj = new webim.Msg.Elem.Custom(data, desc, ext)
      msg.addCustom(customObj)
      this.sendMsg(msg).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  }

  static onMsgReadedNotify(res) {
    console.log(res, 'read')
  }

  // 监听连接状态回调变化事件
  static onConnNotify(resp) {
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

  // 获取C2C历史消息
  // id 要拉取的好友id 、count 拉取的条数
  static getC2CMsgList(id, count) {
    let LastMsgTime = this.getMsgListInfo[id] ? this.getMsgListInfo[id].LastMsgTime : 0
    let MsgKey = this.getMsgListInfo[id] ? this.getMsgListInfo[id].MsgKey : ''
    let options = {
      'Peer_Account': id, // 好友帐号
      'MaxCnt': count, // 拉取消息条数
      LastMsgTime, // 最近的消息时间，即从这个时间点向前拉取历史消息
      MsgKey
    }
    return new Promise((resolve, reject) => {
      webim.getC2CHistoryMsgs(
        options,
        resp => {
          console.log(resp)
          let complete = resp.Complete // 是否还有历史消息可以拉取，1-表示没有，0-表示有
          let retMsgCount = resp.MsgCount // 返回的消息条数，小于或等于请求的消息条数，小于的时候，说明没有历史消息可拉取了
          if (resp.MsgList.length === 0) {
            webim.Log.error('没有历史消息了:data=' + JSON.stringify(options))
          } else {
            let selSess = resp.MsgList[0].sess
            webim.setAutoRead(selSess, true, true)
          }
          this.getMsgListInfo[id] = {// 保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
            'LastMsgTime': resp.LastMsgTime,
            'MsgKey': resp.MsgKey
          }
          let resList = resp.MsgList.filter((item) => {
            let type = item.elems[0].getType()
            return type === webim.MSG_ELEMENT_TYPE.TEXT
          })
          if (resList.length < 15 && !complete) {
            let res = this.getC2CMsgList(id, count)
            resolve(res)
            return
          }
          let data = {
            msgList: resList,
            complete,
            retMsgCount
          }
          resolve(data)
        },
        err => {
          reject(err)
        }
      )
    })
  }

  // 初始化
  static init(opts) {
    this.accountMode = opts.accountMode
    this.accountType = opts.accountType
    this.sdkAppID = opts.sdkAppID
    this.selType = opts.selType
    this.selToID = opts.selToID
    this.avatar = opts.avatar
  }
}
