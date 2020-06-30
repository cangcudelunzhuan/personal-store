import { $get, $post } from '@jxkang/wechat-utils'

export default {
  //获取企业开户状态及开户类型
  accountStatus: (reqModel) => $get('/settleservice/company/hf/get-account-status', reqModel),
  // 汇付商户交易密码设置相关
  setPassword: (reqModel) => $post('/settleservice/account/hf/password-set', reqModel)
}