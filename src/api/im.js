import request from 'common/js/request'

export default {
  // im获取签名，应用信息
  getImInfo(imAccount, loading = true) {
    const url = `/api/employee/employee-im-signature`
    const data = {
      im_account: imAccount
    }
    return request.post(url, data, loading)
  }
}
