import request from 'common/js/request'

export default {
  dynamicList () {
    let url = 'https://business-api.jerryf.cn/api/employee/live-logs'
    return request.get(url)
  }
}