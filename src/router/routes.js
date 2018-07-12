module.exports = [
  {
    path: '/pages/card-list/card-list', // 名片夹
    name: 'CardList',
    config: {
      navigationBarTitleText: '名片'
    }
  },
  {
    path: '/pages/card/card', // 名片
    name: 'Card',
    config: {
      navigationBarBackgroundColor: '#20202E',
      navigationBarTextStyle: 'light',
      backgroundTextStyle: 'light',
      navigationBarTitleText: '名片',
      backgroundColor: '#F0F2F5'
    }
  },
  {
    path: '/pages/product/product', // 产品
    name: 'Product',
    config: {
      onReachBottomDistance: 50,
      navigationBarTitleText: '产品'
    }
  },
  {
    path: '/pages/dynamic/dynamic', // 动态
    name: 'Dynamic',
    config: {
      navigationBarTextStyle: '动态'
    }
  },
  {
    path: '/pages/official/official', // 官网
    name: 'Official',
    config: {
      navigationBarTextStyle: '官网'
    }
  },
  {
    path: '/pages/goods-detail/goods-detail', // 产品详情
    name: 'GoodsDetail',
    config: {
      navigationBarTitleText: '产品'
    }
  },
  {
    path: '/pages/chat-msg/chat-msg', // 聊天
    name: 'Chat',
    config: {
      navigationBarBackgroundColor: '#20202E',
      navigationBarTextStyle: 'light',
      backgroundTextStyle: 'light',
      navigationBarTitleText: '聊天',
      backgroundColor: '#F0F2F5'
    }
  },
  {
    path: '/pages/loading/loading', // 登录
    name: 'Loading',
    config: {
      navigationBarBackgroundColor: '#20202E',
      navigationBarTextStyle: 'light',
      backgroundTextStyle: 'light',
      navigationBarTitleText: '授权',
      backgroundColor: '#F0F2F5'
    }
  }
]
