import * as types from './mutation-types'

const mutations = {
  // [types.TEST_TYPE](state, test) {
  //   state.test = test
  // },
  [types.SET_TARGET_PAGE] (state, page) {
    state.targetPage = page
  },
  [types.SET_CURRENT_MSG] (state, info) {
    state.currentMsg = info
    let arr = state.cardList.filter((item) => {
      return item.employee.im_account === state.currentMsg.account
    })
    if (arr.length) {
      state.currentUnRead = arr[0].unReadMsgCount
    }
  },
  [types.SET_NOW_CHAT](state, nowChat) {
    state.nowChat = nowChat
  },
  [types.DESC_MSG] (state, descMsg) {
    state.descMsg = descMsg
  },
  [types.PRODUCT_SEND_MSG] (state, productSendMsg) {
    state.productSendMsg = productSendMsg
  },
  [types.CARD_LIST] (state, cardList) {
    state.cardList = cardList
  },
  [types.SET_IMING] (state, boolean) {
    state.imIng = boolean
  },
  [types.SET_CUSTOM_COUNT] (state, id) {
    state.cardList = state.cardList.map((item) => {
      if (item.employee.im_account === id) {
        if (!state.imIng) {
          item.unReadMsgCount++
        }
      }
      return item
    })
    let arr = state.cardList.filter((item) => {
      if (state.currentMsg.employeeId) {
        return (item.employee.im_account !== state.currentMsg.account) && item.unReadMsgCount
      }
      return item.unReadMsgCount
    })
    if (arr.length) {
      state.hasElseUnRead = true
    } else {
      state.hasElseUnRead = false
    }
  },
  [types.ADD_NOW_CHAT](state, msg) {
    let newMsg = {
      from_account_id: msg.fromAccount,
      avatar: state.currentMsg.avatar,
      content: msg.text,
      time: msg.time,
      msgTimeStamp: msg.time,
      nickName: state.currentMsg.nickName,
      sessionId: msg.fromAccount,
      unreadMsgCount: 0,
      type: 1
    }
    state.nowChat = [...state.nowChat, newMsg]
  },
  [types.SET_NOW_COUNT](state, type) {
    if (type === 'add') {
      state.currentUnRead++
    } else if (type === 'clear') {
      state.currentUnRead = 0
    }
  },
  [types.SET_BEHAVIOR_LIST](state, opt) {
    state.behaviorList.push(opt)
  },
  [types.SET_IM_LOGIN](state, boolean) {
    state.imLogin = boolean
  },
  [types.CLEAR_BEHAVIOR_LIST](state) {
    state.behaviorList = []
  }
}

export default mutations
