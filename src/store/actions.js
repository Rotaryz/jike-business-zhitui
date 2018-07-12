import * as types from './mutation-types'

// export const saveTest = function ({commit, state}, test) {
//   commit(types.TEST_TYPE, test)
// }

export const setTargetPage = ({commit, state}, page) => {
  commit(types.SET_TARGET_PAGE, page)
}

export const setCurrentMsg = ({commit, state}, info) => {
  commit(types.SET_CURRENT_MSG, info)
}

export const setScene = ({commit, state}, scene) => {
  commit(types.SET_SCENE, scene)
}

export const setNowChat = ({commit, state}, nowChat) => {
  commit(types.SET_NOW_CHAT, nowChat)
}
