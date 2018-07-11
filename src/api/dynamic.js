import request from 'common/js/request'
import { baseURL } from './config'

export default {
  /**
   * 店铺/员工 动态列表
   * @returns {*}
   */
  liveLogs (data) {
    let url = `${baseURL.api}/api/customer/live-logs`
    return request.get(url, data)
  },
  /**
   * 点赞动态列表
   * @returns {*}
   */
  likeLog (data) {
    let url = `${baseURL.api}/api/customer/like-log`
    return request.post(url, data)
  }
}