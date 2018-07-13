<script>
  import wx from 'common/js/wx'
  import {mapActions, mapGetters} from 'vuex'
  import {getParams} from 'common/js/util'
  import base from 'common/mixins/base'
  const shareArr = [1007, 1008, 1036, 1044, 1073, 1074]
  const qrCordArr = [1047, 1048, 1049, 1011, 1012, 1013]
  export default {
    mixins: [base],
    mpType: 'app',
    created() {
    },
    async onShow(options) {
      this.setTargetPage('/' + options.path)// 设置目标页面
      let fromType, fromId, employeeId
      if (options.query.scene) { // 小程序码进来
        let sceneMsg = decodeURIComponent(options.query.scene)
        const params = getParams(sceneMsg)
        fromType = params.ft
        fromId = params.fi
        employeeId = params.e
      } else {
        fromType = options.query.fromType ? options.query.fromType : ''
        fromId = options.query.fromId ? options.query.fromId : ''
        employeeId = options.query.employeeId ? options.query.employeeId : ''
      }
      let scene = options.scene
      let isShare = shareArr.indexOf(scene * 1)
      let isQrcord = qrCordArr.indexOf(scene * 1)
      let source = isShare !== -1 ? 1 : isQrcord !== -1 ? 2 : 0
      this.setFromMsg({fromType, fromId, source})
      // 判断如果有员工id则跑建立连接接口
      wx.setStorageSync('employeeId', employeeId)
      let token = wx.getStorageSync('token')
      if (!token) {
        wx.reLaunch({url: `/pages/loading/loading`})
      } else {
        this.loginIm().then((res) => {
        })
      }
    },
    onLaunch(option) {
    },
    methods: {
      ...mapActions([
        'setCurrentMsg',
        'setDescMsg',
        'setFromMsg'
      ])
    },
    computed: {
      ...mapGetters([
        'currentMsg',
        'imIng',
        'cardList'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/index.styl"
</style>
