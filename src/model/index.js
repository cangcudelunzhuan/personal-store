import Taro from '@tarojs/taro';
import { $ajax, message, Common } from '@jxkang/wechat-utils';
import Config from '@/config';
import { navigateToLogin, bridge } from '@/utils'
import commonAPI from './common';
import bankcard from './bankcard';
import login from './login';
import goods from './goods';
import fund from './fund';
import store from './store';
import shopInfo from './shopInfo';
import password from './password';
import order from './order';
import bond from './bond';
import address from './address';
import yuncang from './yuncang';

const clientHeader = Config.runEnv; // 'H5';
const requestCount = [];
let requestTid = null;

// 获取用户token 主要针对app端处理兼容性问题
function getUserToken() {
  const storeToken = Taro.getStorageSync('userInfo').token || '';
  const cookieToken = JSON.parse(Common.getCookie('userInfo') || '{}');
  return cookieToken.token || storeToken;
}

$ajax.setBaseUrl(
  process.env.NODE_ENV === 'production' ?
    'https://api.jingxiaokang.com' :
    process.env.NODE_ENV === 'test' ? 'https://daily-api.jdxiaokang.com' : 'https://dev-api.jdxiaokang.com'
);

// 注入全局的请求头
$ajax.injectHeaders({
  jdxiaokang_client: clientHeader,
  token: getUserToken(),
  shopType: Taro.getStorageSync('userInfo').shopType
  // shopType: 'CLOUD_SHOP'
});

// 注入全局方法
$ajax.injectResponse((resModel) => {
  if (resModel) {
    const responseCode = `${resModel.responseCode}`;
    const { search, path } = Taro._$router;

    /**
     * 各种状态码事务处理
     */
    Common.seek()
      // 登录信息过期,重新登录
      .equal(
        path.indexOf('/login/login') === -1 && (responseCode === '1000010001' || responseCode === '1000010002'),
        function () {
          navigateToLogin({
            params: Common.getRequest(search),
            desc: '[system] file:model/index.js line:32'
          });
          bridge.callhandler('exit');
        }
      )
      // 申请入注
      .equal(
        responseCode === '1000010020' && path.indexOf('/invitecode/invitecode') > 0,
        function () {
          Taro.navigateTo({ // Taro.reLaunch
            url: `/pages/enter/enter${search}`
          });
        }
      )
      // 公司账户未开通银行账户
      .equal(
        responseCode === '1000010010' && path.indexOf('/bankcard/bankcard') < 0,
        function () {
          Taro.navigateTo({
            url: `/pages/bankcard/bankcard${search}`
          });
        }
      )
      .else(() => { })
      .get()()

  }
});

/**
 * 一些code值不需要做弹框提示
 */
$ajax.injectAllowCode([
  '1000010001',
  '1000010002',
  '1000010003'
]);

$ajax.injectRevolution({
  fetchBefore: () => {
    requestCount.push('');
  },
  fetchComplete: () => {
    requestCount.shift();
    clearTimeout(requestTid);
    requestTid = setTimeout(function () {
      if (requestCount.length > 0) {
        message.loading('正在加载中...');
        setTimeout(function () {
          Taro.hideToast();
        }, 2500);
      }
    }, 1500);
  }
});

export const getFetchHeader = (onlyClient) => Common.extend({
  jdxiaokang_client: clientHeader,
  shopType: Taro.getStorageSync('userInfo').shopType
  // shopType: 'CLOUD_SHOP',
}, onlyClient ? {} : { token: getUserToken() });

export default {
  common: commonAPI,
  bankcard,
  login,
  goods,
  fund,
  store,
  shopInfo,
  password,
  order,
  bond,
  address,
  yuncang,
}
