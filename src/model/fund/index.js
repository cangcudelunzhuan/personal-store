//资金相关接口
import { $get, $post } from '@jxkang/wechat-utils';

export default {
  // 资金账户展示
  show: (reqModel) => $get('/settleservice/fund-account/show', reqModel),
  // 收益明细
  incomeList: (reqModel) => $get('/settleservice/fund-account/income-list', reqModel),
  // 提现记录
  withdrawList: (reqModel) => $get('/settleservice/withdraw/list', reqModel),
  // 提现
  withdrawAmount: reqModel => $post('/settleservice/trade/withdraw', reqModel),
  //提现接口板
  withdrawApi: reqModel => $post('/settleservice/trade/withdraw-api', reqModel)
}