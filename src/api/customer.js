import request from 'common/js/request'
import { baseURL } from './config'

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
   * 商品列表
   * @returns {*}
   */
  goodsLists (data) {
    let url = `${baseURL.api}/api/customer/goods-lists`
    return request.get(url, data)
  },
  /**
   * 商品列表
   * @returns {*}
   */
  goodsDetail (id) {
    let url = `${baseURL.api}/api/customer/goods/${id}`
    return request.get(url)
  }

}