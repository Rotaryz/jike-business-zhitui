module.exports = [
  {
    path: '/pages/card-list/card-list', // 名片夹
    name: 'CardList',
    config: {
      navigationBarTitleText: '名片'
    }
  }, {
    path: '/pages/card/card', // 名片
    name: 'Card'
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
    name: 'Dynamic'
  },
  {
    path: '/pages/official/official', // 官网
    name: 'Official'
  },
  {
    path: '/pages/goods-detail/goods-detail', // 产品详情
    name: 'GoodsDetail',
    config: {
      navigationBarTitleText: '产品'
    }
  },
  {
    path: '/pages/dynamic-list/dynamic-list', // 动态列表
    name: 'DynamicList',
    config: {
      navigationBarTitleText: '动态'
    }
  }
]
