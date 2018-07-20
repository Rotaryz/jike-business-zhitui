import request from 'common/js/request'
import { baseURL } from './config'

export default {
  /**
   * 名片夹
   * @returns {*}
   */
  cardHolderList (data, load) {
    let url = `${baseURL.api}/api/customer/card-holder-list`
    return request.get(url, data, load)
  },
  /**
   * 名片屏蔽
   * @returns {*}
   */
  cardHolderDoClose (data) {
    let url = `${baseURL.api}/api/customer/card-holder-do-close`
    return request.post(url, data)
  },
  /**
   * 名片取消屏蔽
   * @returns {*}
   */
  cardHolderCancelClose (data) {
    let url = `${baseURL.api}/api/customer/card-holder-cancel-close`
    return request.post(url, data)
  }
}