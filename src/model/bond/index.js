//资金相关接口
import { $get, $post } from '@jxkang/wechat-utils';

export default {
  /**
   * 缴纳个人保证金 创建订单
   */
  createOrder: reqModel => $post('/orderservice/shopOrder/createSelfSale', reqModel),
  /**
   * 是否交纳保证金
   */
  hasSelfSale: reqModel=> $get('/orderservice/shopOrder/isSelfSale', reqModel)
}