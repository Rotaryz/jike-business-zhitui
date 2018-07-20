import * as types from './mutation-types'
import { Card } from 'api'
import { ERR_OK } from 'api/config'
import * as wechat from 'common/js/wechat'
import webimHandler from 'common/js/webim_handler'

// export const saveTest = function ({commit, state}, test) {
//   commit(types.TEST_TYPE, test)
// }
export const setTargetPage = ({ commit, state }, page) => {
  commit(types.SET_TARGET_PAGE, page)
}
// 当前名片信息
export const setCurrentMsg = ({ commit, state }, info) => {
  commit(types.SET_CURRENT_MSG, info)
}
export const setDescMsg = ({ commit, state }, scene) => {
  commit(types.DESC_MSG, scene)
}
export const setImLogin = ({ commit, state }, boolean) => {
  commit(types.SET_IM_LOGIN, boolean)
}
export const setProductSendMsg = ({ commit, state }, productSendMsg) => {
  commit(types.PRODUCT_SEND_MSG, productSendMsg)
}
export const setCardList = ({ commit, state }, cardList) => {
  commit(types.CARD_LIST, cardList)
}
// 获取名片夹列表
export const getCardList = ({ commit, state }, obj) => {
  console.log(obj)
  let page = obj.page
  let load = obj.loading
  Card.cardHolderList({ page: page }, load).then(async (res) => {
    if (res.error === ERR_OK) {
      if (!res.data.length) {
        wechat.hideLoading()
        return
      }
      wechat.hideLoading()
      res = res.data.map((item) => {
        item.show = false
        return item
      })
      res = await webimHandler.initUnread(res)
      if (page === 1) {
        commit(types.CARD_LIST, res)
        return
      }
      let arr = JSON.parse(JSON.stringify(state.cardList))
      arr = arr.concat(res)
      this.setCardList(arr)
    }
    wechat.hideLoading()
  })
}
// 现实隐藏名片功能
export const showCardUse = ({ commit, state }, index) => {
  let arr = JSON.parse(JSON.stringify(state.cardList))
  arr[index].show = !arr[index].show
  commit(types.CARD_LIST, arr)
}
// 屏蔽，取消屏蔽
export const cardHolderDoClose = ({ commit, state }, obj) => {
  let id = obj.id
  let status = obj.status
  let _this = obj.vue
  let arr = JSON.parse(JSON.stringify(state.cardList))
  switch (status) {
    case 0:
      Card.cardHolderDoClose({ card_holder_id: id }).then((res) => {
        wechat.hideLoading()
        if (res.error === ERR_OK) {
          let index = arr.findIndex(item => item.id === id)
          arr[index].status = 1
          arr[index].show = false
          commit(types.CARD_LIST, arr)
          return
        }
        _this.$refs.toast.show(res.message)
      })
      break
    case 1:
      Card.cardHolderCancelClose({ card_holder_id: id }).then((res) => {
        wechat.hideLoading()
        if (res.error === ERR_OK) {
          let index = arr.findIndex(item => item.id === id)
          arr[index].status = 0
          arr[index].show = false
          commit(types.CARD_LIST, arr)
          return
        }
        _this.$refs.toast.show(res.message)
      })
      break
  }
}

export const setNowChat = ({ commit, state }, nowChat) => {
  commit(types.SET_NOW_CHAT, nowChat)
}

export const setImIng = ({ commit, state }, boolean) => {
  commit(types.SET_IMING, boolean)
}

export const setCustomCount = ({ commit, state }, id) => {
  commit(types.SET_CUSTOM_COUNT, id)
}
export const addNowChat = ({ commit, state }, msg) => {
  commit(types.ADD_NOW_CHAT, msg)
}
export const setNowCount = ({ commit, state }, type) => {
  commit(types.SET_NOW_COUNT, type)
}
export const setBehaviorList = ({ commit, state }, opt) => {
  commit(types.SET_BEHAVIOR_LIST, opt)
}
export const clearBehaviorList = ({ commit, state }) => {
  commit(types.CLEAR_BEHAVIOR_LIST)
}
export const setFromMsg = ({ commit, state }, msg) => {
  commit(types.SET_FROM_MSG, msg)
}
export const setNowCountNum = ({ commit, state }, num) => {
  commit(types.SET_NOW_COUNT_NUM, num)
}
export const setListUnreadCount = ({ commit, state }, id) => {
  commit(types.SET_LIST_COUNT_NUM, id)
}
