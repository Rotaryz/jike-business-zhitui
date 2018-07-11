import request from 'common/js/request'
import { baseURL } from './config'

export default {
  /**
   * 官网
   * @returns {*}
   */
  cardHolderList (data) {
    let url = `${baseURL.api}/api/customer/card-holder-list`
    return request.get(url, data)
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