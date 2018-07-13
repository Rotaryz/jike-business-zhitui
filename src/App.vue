<script>
  import wx from 'common/js/wx'
  import {mapActions, mapGetters} from 'vuex'
  import {getParams} from 'common/js/util'
  import base from 'common/mixins/base'
  export default {
    mixins: [base],
    mpType: 'app',
    created() {
    },
    async onShow(options) {
      console.log(this)
      this.setTargetPage('/' + options.path)// 设置目标页面
      let token = wx.getStorageSync('token')
      if (!token) {
        wx.reLaunch({url: `/pages/loading/loading`})
      } else {
        this.loginIm().then((res) => {
        })
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
      // 判断如果有员工id则跑建立连接接口
      wx.setStorageSync('employeeId', employeeId)
    },
    onLaunch(option) {
    },
    methods: {
      ...mapActions([
        'setCurrentMsg',
        'setDescMsg'
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
