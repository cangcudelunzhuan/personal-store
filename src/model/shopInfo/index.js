import { $post, $ajax, $get } from '@jxkang/wechat-utils'

export default {
  //修改店铺信息
  updateBaseInfo: (reqModel) => $post('/userservice/shop/updateBaseInfo', reqModel),
  //企业的推荐码信息
  companyCode: (reqModel) => $get('/commission-service/invite/company-invitation-code', reqModel),
  //店铺邀请记录
  companyRecords: (reqModel) => $get('/commission-service/invite/company-invitation-records', reqModel),
  //添加修改店铺会员等级配置信息(会员推荐人数升级-版本)
  addDispose: (reqModel) => $post('/userservice/shopMemberDispose/addDispose', reqModel),
  //店铺会员等级配置信息详情(会员推荐人数升级-版本)
  shopMemberDetail: (reqModel) => $get('/userservice/shopMemberDispose/detail', reqModel),
  //跳过等级配置
  noSetDispose: (reqModel) => $post('/userservice/shop/noSetDispose', reqModel),
  // 获取个人店小程序二维码
  getWechatQrCode: () => `${$ajax.getBaseUrl()}/userservice/shop/getCustomerLoginShopWxACode`
}