import { $post, $get } from "@jxkang/wechat-utils";

export default {
  //默认地址
  defAddress: (reqModel) => $post('/userservice/userAddress/defAddress', reqModel),
  //商品下单
  doOrder: (reqModel) => $post('/orderservice/order/create', reqModel),
  //订单列表
  queryList: (reqModel) => $get('/orderservice/order/shop/list', reqModel),
  //订单详情
  queryDetail: (reqModel) => $get(`/orderservice/order/shop/detail/${reqModel.orderNo}`, reqModel),
  //支付
  orderPay: (reqModel) => $post('/settleservice/trade/union-pay-temp', reqModel),//kxp-order-pay
  // 支付 < 正式 走微信支付 >
  formalOrderPay: (reqModel) => $post('/settleservice/trade/kxp-order-pay', reqModel),
  //会员等级
  getShopMemberLevel: (reqModel) => $get('/userservice/shopMember/getShopMemberLevel', reqModel),
  //删除订单
  deleteOrder: (reqModel) => $get('/orderservice/order/shop/delete', reqModel),
  //订单个数
  orderCount: (reqModel) => $get('/orderservice/order/shop/count', reqModel),
  //小店订单数据
  queryShopOrderData: (reqModel) => $get('/orderservice/order/shop/queryShopOrderData', reqModel),
  //售后列表
  afterList: (reqModel) => $get('/orderservice/afterSale/shop/list', reqModel),
  //售后个数 
  afterCount: (reqModel) => $get('/orderservice/afterSale/shop/count', reqModel),
  //售后详情
  afterDetail: (afterSaleNo, reqModel) => $get(`/orderservice/afterSale/shop/detail/${afterSaleNo}`, reqModel),
  //订单搜索
  queryListByParam: (reqModel) => $get(`/orderservice/common/queryOrderByParam`, reqModel),
  //物流信息
  getDeliveryTrail: (reqModel) => $get(`/orderservice/common/getDeliveryTrail`, reqModel),
  //发货
  sendTrans: (reqModel) => $post('/orderservice/order/shop/send', reqModel),
  //审核售后
  agreeAction: (reqModel) => $post(`/orderservice/afterSale/shop/audit`, reqModel),
  //收货
  receive: (reqModel) => $get(`/orderservice/afterSale/shop/receive/${reqModel.afterSaleNo}`, reqModel),
  //根据物流号返回快递公司
  matchLogisticsCompany: (reqModel) => $get(`/orderservice/common/matchLogisticsCompany`, reqModel),
}