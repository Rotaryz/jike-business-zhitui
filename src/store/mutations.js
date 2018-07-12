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
  [types.DESC_MSG] (state, descMsg) {
    state.descMsg = descMsg
  }
}

export default mutations
