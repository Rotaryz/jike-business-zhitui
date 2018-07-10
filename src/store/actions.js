import * as types from './mutation-types'

// export const saveTest = function ({commit, state}, test) {
//   commit(types.TEST_TYPE, test)
// }

export const saveRole = ({commit, state}, role) => {
  commit(types.ROLE_TYPE, role)
}
