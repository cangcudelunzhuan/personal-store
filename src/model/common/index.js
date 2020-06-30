import {convertObjectUrlToBlob} from '@tarojs/taro-h5/src/api/fileTransfer/utils';
import { $post, $get, $ajax } from '@jxkang/wechat-utils';

export default {
  // 获取微信 openid
  getOpenId: reqModel => $get('/settleservice/hf/pay-c/get-openid', reqModel),
  // 获取微信 jsapi授权
  getTicket: reqModel => $get('/settleservice/hf/pay-c/get-ticket', reqModel),
  // 开店费用金额查询 参数bizType，1是获取小店入驻金额, 2是服务商入驻金额, 3自营保证金
  getPayAmount: reqModel => $get('/orderservice/shopOrder/getShopOrderAmount', reqModel),
  // 订单支付
  orderPay: reqModel => $post('/settleservice/trade/kxp-order-pay', reqModel),
  // 行政区域查询
  getAreaList: (reqModel) => $post('/productservice/sys/getAreaList', reqModel),
  // 支付测试接口 仅汇付功能测试
  testWxPay: reqModel => $post('/settleservice/hf/pay-c/wx-pay', reqModel),
  // 文件上传接口
  upload: () => `${$ajax.getBaseUrl()}/productservice/img/h5-upload`,
  // 人脸核身
  getDetectAuch: reqModel => $get('/kanglive/live/member/v1/detectAuch', reqModel),
  // 获取本地图片blob
  getLocalImg: src => convertObjectUrlToBlob(src)
}
