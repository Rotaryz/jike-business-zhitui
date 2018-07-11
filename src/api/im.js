import request from 'common/js/request'

export default {
  // 授权
  getToken(data, loading = true) {
    const url = `/api/jwt/cusstomer-login`
    return request.post(url, data, loading)
  },
  // im获取签名，应用信息
  getImInfo(imAccount, loading = true) {
    const url = `/api/customer/customer-im-signature`
    const data = {
      im_account: imAccount
    }
    return request.post(url, data, loading)
  },
  // 名片详情
  getCardDetail(data, loading = true) {
    const url = `/api/customer/card-holder-detail`
    return request.get(url, data, loading)
  },
  // 名片详情
  getGoodsList(loading = true) {
    const url = `/api/customer/goods-lists`
    return request.get(url, {}, loading)
  }
}
