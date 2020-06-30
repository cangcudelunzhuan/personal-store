import { $get } from '@jxkang/wechat-utils'

export default {
  //店铺会员统计
  getMemberStatistics: (reqModel) => $get('/userservice/shopMember/memberStatistics', reqModel),
  //店铺会员列表
  getMemberList: (reqModel) => $get('/userservice/shopMember/memberList', reqModel),
}