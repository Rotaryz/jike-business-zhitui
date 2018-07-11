<script>
  import wx from 'common/js/wx'
  import {mapActions, mapGetters} from 'vuex'
  import {getParams} from 'common/js/util'
  import {Im} from 'api'
  export default {
    mpType: 'app',
    created() {
    },
    async onShow(options) {
      this.setTargetPage('/' + options.path)// 设置目标页面
      let token = wx.getStorageSync('token')
      if (!token) {
        wx.reLaunch({url: `/pages/loading/loading`})
      } else {
        this.loginIm()
      }
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
      this.setCurrentMsg({fromType, fromId, employeeId})
      this.setScene(options.scene)
    },
    onLaunch(option) {
    },
    methods: {
      ...mapActions([
        'setTargetPage',
        'setCurrentMsg',
        'setScene'
      ]),
      loginIm() {
        let imAccount = wx.getStorageSync('userInfo').im_account
        Im.getImInfo(imAccount, false).then((res) => {
          console.log(res)
        })
      }
    },
    computed: {
      ...mapGetters([
        'currentMsg'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/index.styl"
</style>
