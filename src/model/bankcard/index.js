import { $get, $post } from '@jxkang/wechat-utils';

export default {
  // 根据银行卡号识别银行信息
  getBankInfo: (reqModel) => $get('/settleservice/hf/pay-c/query-bank', reqModel),
  // 个人开户
  getBindCard: (reqModel) => $post('/settleservice/hf/pay-c/user-bind-card', reqModel),
  // 银行卡列表
  userbanklist: (reqModel) => $get('/settleservice/hf/pay-c/user-bank-list', reqModel),
  //根据手机号获取账户信息
  accountInfo: (reqModel) => $get('/settleservice/hf/pay-c/account-info-byPhone', reqModel),
  //本地开户
  localBindCard: (reqModel) => $post('/settleservice/hf/pay-c/local-bind-card', reqModel),
  //汇付个人开户（不绑卡）
  openAccount: (reqModel) => $post('/settleservice/company/hf/open-account-user', reqModel),
  //添加绑定银行卡
  addCard: (reqModel) => $post('/settleservice/account/hf/bind-cash-card', reqModel),
  //可沿用账户
  canUseInfo: (reqModel) => $get('/settleservice/company/hf/account-use/list', reqModel),
  //沿用本地
  userLocal: (reqModel) => $get('/settleservice/company/hf/local-open-account-msb', reqModel),
}