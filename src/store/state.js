const state = {
  imLogin: false, // im的登录态
  targetPage: null, // 目标页面，用于登录授权后跳转
  currentMsg: null, // 当前消息对象（名片对象）没有则为null， employeeId 员工id、flowId 流id、nickName 员工姓名、avatar 员工头像
  descMsg: null, // im行为消息需要的参数，type根据情况定义使用object.assign，1为普通，2为产品消息，flow_id流id,card_holder_id名片id,merchant_id商家id,employee_id员工id,customer_id顾客id
  productSendMsg: false,
  cardList: [], // 名片夹列表
  nowChat: [], // 当前的聊天消息
  imIng: false, // 是否在聊天页面
  currentUnRead: 0, // 当前对象未读信息
  hasElseUnRead: false // 其他名片的未读消息
}

export default state
