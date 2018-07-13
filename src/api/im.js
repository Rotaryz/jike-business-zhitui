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
  // 员工和客户建立连接
  getConect(data, loading = true) {
    const url = `/api/customer/build-relationship`
    return request.post(url, data, loading)
  },
  // 名片详情
  getCardDetail(data, loading = true) {
    const url = `/api/customer/card-holder-detail`
    return request.get(url, data, loading)
  },
  // 主推产品列表
  getGoodsList(page = 1, limit = 10, loading = true) {
    const url = `/api/customer/goods-lists`
    const data = {
      page,
      limit
    }
    return request.get(url, data, loading)
  },
  // 点赞
  lickZan(id, loading = true) {
    const url = `/api/customer/card-holder-do-like`
    const data = {
      card_holder_id: id
    }
    return request.post(url, data, loading)
  },
  // 点赞
  clearZan(id, loading = true) {
    const url = `/api/customer/card-holder-cancel-like`
    const data = {
      card_holder_id: id
    }
    return request.post(url, data, loading)
  },
  // 获取二维码
  getQrCodeImg(id, loading = true) {
    const url = `/api/customer/card-holder-qrcode`
    const data = {
      card_holder_id: id
    }
    return request.get(url, data, loading)
  },
  // 聊天记录
  getMsgList(data, loading = true) {
    const url = `/api/customer/message-logs`
    return request.post(url, data, loading)
  }
}
