import Taro from '@tarojs/taro';
import Model from '@/model';
import Store from '@/store';
import WX from '../wx';

// const noop = () => { }
//支付
export default {
  Opay(selfThis, relationId) {
    const { openId } = Store.globalStore.data.envUserInfo
    if (process.env.NODE_ENV === 'production' && !openId) {
      Taro.setStorageSync('authoBackUrl', document.URL);
      selfThis.logger({
        logs: '发起支付,缺少openId重新授权',
      });
      WX.authorize();
      return false
    }
    const host = process.env.NODE_ENV === 'production' ? 'https://shop-m.kangxiaopu.com' : 'https://daily-shop-m.kangxiaopu.com'
    const params = {
      relationId,
      openId,
      callBackUrl: `${host}/#/pages/pay-result/pay-result`
    }

    if (process.env.NODE_ENV === 'production') { //正式
      Model.order.formalOrderPay(params).then(res => {
        
        selfThis.logger({
          logs: '个人店调用支付接口生成payInfo,准备跳往launchPay界面发起微信支付功能',
          api_url: Model.order.formalOrderPay.toString(),
          api_req: JSON.stringify(params),
          api_res: JSON.stringify(res)
        });

        if (res) {
          // 存支付参数payInfo
          Store.globalStore.setData('launchPay', { payInfo: res.payInfo, backUrl: `/pages/pay-result/pay-result?orderNo=${relationId}` });

          Taro.navigateTo({
            url: '/pages/launchPay/index' //支付界面
          });
        }
        // complete(res);
      })
    } else {
      Model.order.orderPay(params).then(res => {
        if (res) {
          // 测试环境
          globalThis.location.href = res
        }
        // complete(res);
      })
    }


  }
}

