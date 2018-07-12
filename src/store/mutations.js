import * as types from './mutation-types'

const mutations = {
  // [types.TEST_TYPE](state, test) {
  //   state.test = test
  // },
  [types.SET_TARGET_PAGE] (state, page) {
    state.targetPage = page
  },
  [types.SET_CURRENT_MSG] (state, info) {
    state.currentMsg = Object.assign({}, state.currentMsg, info)
  },
  [types.SET_SCENE] (state, scene) {
    state.scene = scene
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
        if (item.employee.im_account !== state.currentMsg.employee.im_account) {
          item.unreadMsgCount++
        }
        return item
      }
    })
  }
}

export default mutations
