import request from 'common/js/request'
import {baseURL} from './config'

export default {
  /**
   * 官网
   * @returns {*}
   */
  website () {
    let url = `${baseURL.api}/api/customer/website`
    return request.get(url)
  },
  /**
   * 官网
   * @returns {*}
   */
  goodsLists () {
    let url = `${baseURL.api}/api/customer/goods-lists`
    return request.get(url)
  }

}