import { $post, $get } from '@jxkang/wechat-utils'

export default {
  // 发送短信
  sendCode: (reqModel) => $post('/userservice/sms/sendCode', reqModel),
  // (小b进个人店)短信验证码-登陆注册 
  smsLogin: (reqModel) => $post('/userservice/login/doSmsLoginForApplyShop', reqModel),
  // 绑定-店铺-会员-邀请人-关系
  bindShopMemberInvUser: (reqModel) => $post('/userservice/shopMember/bindShopMemberInvUser', reqModel),
  // 用户邀请人信息
  getInviterInfo: (reqModel) => $get('/commission-service/invite/company-inviter-info', reqModel),
  //是否绑定服务商
  isExistCompanyShop: (reqModel) => $post('/userservice/companyShop/isExistCompanyShop', reqModel),
  //绑定服务商
  bindCompanyShop: (reqModel) => $post('/userservice/companyShop/bindCompanyShop', reqModel),
  //申请入驻
  applyShop: (reqModel) => $post('/userservice/shop/applyShop', reqModel),
  //免费开店
  freeApplyShop: (reqModel) => $post('/userservice/shop/freeApplyShop', reqModel),
  //小店入驻下单
  createOrder: (reqModel) => $post('/orderservice/shopOrder/create', reqModel),
  //开店进程
  openProcess: (reqModel) => $post('/userservice/shop/openProcess', reqModel),
  //店铺详情 别人查看
  shopDetail: (reqModel) => $post('/userservice/shop/detail', reqModel),
  //店铺详情 自己查看
  shopInfo: (reqModel) => $post('/userservice/shop/info', reqModel),
  //会员等级配置
  addConfig: (reqModel) => $post('/userservice/shopMemberConfig/addConfig', reqModel),
  //开启工作台
  inWork: (reqModel) => $post('/userservice/shop/inWork', reqModel),
  //等级配置详情
  shopMemberConfigDetail: (reqModel) => $post('/userservice/shopMemberConfig/detail', reqModel),
  //支付
  orderPay: (reqModel) => $post('/settleservice/trade/union-pay-temp', reqModel), ///kxp-order-pay
  //登出
  logout: (reqModel) => $post('/userservice/login/logout', reqModel),
  // 店铺会员等级配置信息详情
  shopMemberDispose: (reqModel) => $get('/userservice/shopMemberDispose/detail', reqModel),
}