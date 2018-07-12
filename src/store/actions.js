import * as types from './mutation-types'
import { Card } from 'api'
import { ERR_OK } from 'api/config'
import * as wechat from 'common/js/wechat'

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
export const setScene = ({ commit, state }, scene) => {
  commit(types.SET_SCENE, scene)
}
export const setDescMsg = ({ commit, state }, scene) => {
  commit(types.DESC_MSG, scene)
}
export const setProductSendMsg = ({ commit, state }, productSendMsg) => {
  commit(types.PRODUCT_SEND_MSG, productSendMsg)
}
export const setCardList = ({ commit, state }, cardList) => {
  commit(types.CARD_LIST, cardList)
}
// 获取名片夹列表
export const getCardList = ({ commit, state }, page) => {
  Card.cardHolderList({ page: page }).then((res) => {
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
  let arr = JSON.parse(JSON.stringify(state.cardList))
  console.log(status)
  switch (status) {
    case 0:
      Card.cardHolderDoClose({ card_holder_id: id }).then((res) => {
        if (res.error === ERR_OK) {
          let index = arr.findIndex(item => item.id === id)
          arr[index].status = 1
          arr[index].show = false
          commit(types.CARD_LIST, arr)
        }
        wechat.hideLoading()
      })
      break
    case 1:
      Card.cardHolderCancelClose({ card_holder_id: id }).then((res) => {
        if (res.error === ERR_OK) {
          let index = arr.findIndex(item => item.id === id)
          arr[index].status = 0
          arr[index].show = false
          commit(types.CARD_LIST, arr)
        }
        wechat.hideLoading()
      })
      break
  }
}
