import request from 'common/js/request'

export default {
  // 授权
  getToken(data, loading = true) {
    const url = `/api/jwt/cusstomer-login`
    return request.post(url, data, loading)
  },
  // im获取签名，应用信息
  getImInfo(imAccount, loading = true) {
    const url = `/api/employee/employee-im-signature`
    const data = {
      im_account: imAccount
    }
    return request.post(url, data, loading)
  }
}
