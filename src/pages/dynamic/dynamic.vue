<template>
  <div class="dynamic-list">
    <div class="dynamic-item" v-for="(item, index) in dynamicList" :key="index" v-if="item.live_log_detail.length">
      <div class="find-item img-one" v-if="item.live_log_detail[0].type === 1 && item.live_log_detail.length === 1">
        <div class="find-box">
          <div class="cainter">
            <div class="user">
              <!-- 头像-->
              <img class="header" :src="item.employee_image_url">
              <p class="nickname">{{item.employee_name}}</p>
            </div>
            <!--{{comment?'':'special'}}-->
            <pre class="words">{{item.content}}</pre>
            <div class="one-box">
              <img class="img-one-item" mode="aspectFit" v-for="(items, idx) in item.live_log_detail" :key="idx" :src="items.file_url" @click="_seeImage(idx, item.live_log_detail)">
            </div>
          </div>
          <!--<div class="address">-->
          <!--<img class="add-icon">-->
          <!--地址-->
          <!--</div>-->
          <div class="information">
            <div class="time">
              {{item.created_at}}
            </div>
            <div class="manager">
              <img src="./icon-option@2x.png" class="manager-img" mode="widthFix" @click="_showLong(index, item.show)">
              <div class="share" :class="{'share-active': item.show}">
                <div class="share-item comment">
                  <img class="find-icon" src="./icon-review@2x.png" mode="widthFix">
                  <div class="find-num">
                    评论
                  </div>
                </div>
                <!--{{find.is_like ? 'thumbs-up' : ''}}-->
                <div class="share-item" @click="_goodLike(index)">
                  <img class="find-icon" src="./icon-spot2@2x.png" mode="widthFix">
                  <div class="find-num">
                    赞
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="likes-peo" v-if="item.live_log_like.length">
            <img src="./pic-trends_zan1@2x.png" class="likes-peo-bg" mode="widthFix">
            <div class="peo-big-box">
              <img src="./icon-spot@2x.png" class="like-icon" mode="widthFix">
              <div class="like-name">
                <span v-for="(items,idx) in item.live_log_like" :key="idx">{{items.employee_name}}</span>
              </div>
            </div>
            <img src="./pic-trends_zan3@2x.png" class="likes-peo-bg" mode="widthFix">
          </div>
        </div>
      </div>
      <div class="find-item img-two" v-if="item.live_log_detail[0].type === 1 && item.live_log_detail.length === 2">
        <div class="find-box">
          <div class="cainter">
            <div class="user">
              <img class="header" :src="item.employee_image_url">
              <p class="nickname">{{item.employee_name}}</p>
            </div>
            <pre class="words">{{item.content}}</pre>
            <div class="img-item-two">
              <img class="two-item" mode="aspectFit" v-for="(items, idx) in item.live_log_detail" :key="idx" :src="items.file_url" @click="_seeImage(idx, item.live_log_detail)">
            </div>
          </div>
          <!--<div class="address">-->
          <!--<img class="add-icon">-->
          <!--地址-->
          <!--</div>-->
          <div class="information">
            <div class="time">
              {{item.created_at}}
            </div>
            <div class="manager">
              <img src="./icon-option@2x.png" class="manager-img" mode="widthFix" @click="_showLong(index, item.show)">
              <div class="share" :class="{'share-active': item.show}">
                <div class="share-item comment">
                  <img class="find-icon" src="./icon-review@2x.png" mode="widthFix">
                  <div class="find-num">
                    评论
                  </div>
                </div>
                <!--{{find.is_like ? 'thumbs-up' : ''}}-->
                <div class="share-item" @click="_goodLike(index)">
                  <img class="find-icon" src="./icon-spot2@2x.png" mode="widthFix">
                  <div class="find-num">
                    赞
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="likes-peo" v-if="item.live_log_like.length">
            <img src="./pic-trends_zan1@2x.png" class="likes-peo-bg" mode="widthFix">
            <div class="peo-big-box">
              <img src="./icon-spot@2x.png" class="like-icon" mode="widthFix">
              <div class="like-name">
                <span v-for="(items,idx) in item.live_log_like" :key="idx">{{items.employee_name}}</span>
              </div>
            </div>
            <img src="./pic-trends_zan3@2x.png" class="likes-peo-bg" mode="widthFix">
          </div>
        </div>
      </div>
      <div class="find-item img-more" v-if="item.live_log_detail[0].type === 1 && item.live_log_detail.length > 2">
        <div class="find-box">
          <div class="cainter">
            <div class="user">
              <img class="header" :src="item.employee_image_url">
              <p class="nickname">{{item.employee_name}}</p>
            </div>
            <!--{{comment?'':'special'}}"-->
            <pre class="words">{{item.content}}</pre>
            <div class="img-item-two">
              <img class="two-item" mode="aspectFit" v-for="(items, idx) in item.live_log_detail" :key="idx" :src="items.file_url" @click="_seeImage(idx, item.live_log_detail)">
            </div>
          </div>
          <!--<div class="address" >-->
          <!--<img class="add-icon">-->
          <!--地址-->
          <!--</div>-->
          <div class="information">
            <div class="time">
              {{item.created_at}}
            </div>
            <div class="manager">
              <img src="./icon-option@2x.png" class="manager-img" mode="widthFix" @click="_showLong(index, item.show)">
              <div class="share" :class="{'share-active': item.show}">
                <div class="share-item comment">
                  <img class="find-icon" src="./icon-review@2x.png" mode="widthFix">
                  <div class="find-num">
                    评论
                  </div>
                </div>
                <!--{{find.is_like ? 'thumbs-up' : ''}}-->
                <div class="share-item" @click="_goodLike(index)">
                  <img class="find-icon" src="./icon-spot2@2x.png" mode="widthFix">
                  <div class="find-num">
                    赞
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="likes-peo" v-if="item.live_log_like.length">
            <img src="./pic-trends_zan1@2x.png" class="likes-peo-bg" mode="widthFix">
            <div class="peo-big-box">
              <img src="./icon-spot@2x.png" class="like-icon" mode="widthFix">
              <div class="like-name">
                <span v-for="(items,idx) in item.live_log_like" :key="idx">{{items.employee_name}}</span>
              </div>
            </div>
            <img src="./pic-trends_zan3@2x.png" class="likes-peo-bg" mode="widthFix">
          </div>
        </div>
      </div>
    </div>
    <toast ref="toast"></toast>

  </div>
</template>

<script>
  import { Dynamic } from 'api'
  import { ERR_OK } from 'api//config'
  import * as wechat from 'common/js/wechat'
  import Toast from 'components/toast/toast'

  export default {
    name: 'dynamic-list',
    data () {
      return {
        dynamicList: [],
        page: 1,
        loadMoreDy: true
      }
    },
    onLoad () {
      this._getList()
    },
    onReachBottom () {
      this.page++
      this._getList()
    },
    methods: {
      _showLong (index, status) {
        this.dynamicList[index].show = !status
      },
      _seeImage (index, image) {
        console.log(index, image)
        let imageArr = image.map(item => item.file_url)
        wx.previewImage({
          current: imageArr[index], // 当前显示图片的http链接
          urls: imageArr // 需要预览的图片http链接列表
        })
      },
      _getList () {
        if (!this.loadMoreDy) {
          return
        }
        Dynamic.liveLogs({ page: this.page }).then((res) => {
          if (res.error === ERR_OK) {
            wechat.hideLoading()
            if (res.data.length) {
              res = res.data.map((item) => {
                item.show = false
                return item
              })
            } else {
              this.loadMoreDy = false
              return
            }
            if (this.page === 1) {
              this.dynamicList = res
              return
            }
            this.dynamicList = this.dynamicList.concat(res)
          }
          wechat.hideLoading()
        })
      },
      _goodLike (index) {
        let data = { live_log_id: this.dynamicList[index].id, like: this.dynamicList[index].is_like ? 0 : 1 }
        Dynamic.likeLog(data).then((res) => {
          if (res.error === ERR_OK) {
            wechat.hideLoading()
            this.dynamicList[index].is_like = !this.dynamicList[index].is_like
            this.dynamicList[index].show = !this.dynamicList[index].show
            this.dynamicList[index].live_log_like = res.data
            // 点赞之后加入
            return
          }
          wechat.hideLoading()
          this.$refs.toast.show(res.message)
        })
      }
    },
    components: {
      Toast
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin'
  .find-item
    line-height: 1
    padding-top: 14px
    background: $color-white
    .find-box
      padding-bottom: 15px
      border-bottom-1px($color-col-line)
      margin-left: 60px
      padding-right: 21px
      .user
        display: flex
        transform: translateX(-45px)
        .header
          height: 36px
          width: 36px
        .nickname
          font-family: $font-family-medium
          color: $color-text
          font-size: $font-size-16
          margin-left: 10px
          margin-top: 3.5px
      .words
        margin-top: -10px
        display: block
        width: 78.67vw
        font-family: $font-family-regular
        font-size: $font-size-14
        color: #333
        line-height: 21px
        margin-bottom: 3.5px
        overflow: hidden
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 6
        -webkit-box-orient: vertical
        .p-more
          color: $color-del
          margin-left: 12px
      .words.special
        height: 21px
      .address
        font-size: $font-size-small
        color: $color-del
        margin-top: 8px
        .add-icon
          height: 13px
          width: @height
          margin-left: 3px
          transform: translateY(1.5px)
      .information
        height: 20px
        display: flex
        margin: 12px 0 0
        font-size: $font-size-small
        justify-content: space-between
        align-items: center
        .del
          color: #839FC0
          margin-left: 12px
        .find-num, .time
          white-space: nowrap
          font-size: $font-size-12
          font-family: $font-family-regular
          color: $color-text-88
          display: flex
        .manager
          line-height: 1
          position: relative
          .manager-img
            width: 17.5px
            height: 11.5px
          .share
            overflow: hidden
            position: absolute
            display: flex
            width: 0
            height: 30px
            background: $color-text
            align-items: center
            border-radius: 2px
            line-height: 30px
            right: 20px
            opacity: 0
            transition: all 0.3s
            col-center()
            .share-item
              flex: 1
              height: 15px
              justify-content: center
              display: flex
              align-items: center
              &:first-child
                border-right: 0.5px solid rgba(255, 255, 255, 0.10)
              .find-icon
                width: 14px
              .find-num
                margin-left: 2.5px
                font-size: $font-size-12
                color: $color-white

          .share-active
            opacity: 1
            width: 148px
            z-index: 10
            transition: all 0.3s
      .likes-peo
        margin-top: 5px
        position: relative
        width: 79.73vw
        height: 10.67vw
        box-sizing: border-box
        .likes-peo-bg
          display :block
          width: 100%
        .peo-big-box
          width: 100%
          display :flex
          box-sizing :border-box
          border-right-1px(rgba(0,0,0,0.10))
          border-left-1px(rgba(0,0,0,0.10))
          background: #F9F9F9
          padding:10px 0
        .like-icon
          margin-left: 10px
          position: relative
          z-index: 10
          width: 14px
        .like-name
          font-size: $font-size-12
          color: #7C7C8F
          margin-left: 5px
          z-index: 10
          position: relative

  .video
    .find-video
      width: 54vw
      height: 30.134vw
      position: relative
      .play-icon
        height: 41px
        width: 41px
        all-center()

  .img-one
    .img-one-item
      box-sizing: border-box
      border: 0.5px solid $color-background
      width: 34.134vw
      height: 46.4vw
    .one-box
      display: inline-block

  .img-two
    .img-item-two
      display: flex
      justify-content: space-between
      .two-item
        box-sizing: border-box
        height: 31.2vw
        width: 49%

  .img-more
    .img-item-two
      display: flex
      flex-wrap: wrap
      transform: translateX(-5PX)
      .two-item
        box-sizing: border-box
        height: 23.5vw
        width: @height
        margin-left: 1vw
        margin-top: 1vw

  .new-dynamic
    border-radius: 50%
    position: absolute
    bottom: 66px
    right: 15px
    z-index: 100
    box-shadow: 0 8px 7px 0 rgba(211, 211, 215, 0.29)
    width: 50px
    height: @width
    .new-dynamic-img
      width: 100%
</style>