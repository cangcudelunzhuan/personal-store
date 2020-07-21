import Taro, { Component } from '@tarojs/taro';
import { Provider } from '@tarojs/mobx';
import 'taro-ui/dist/style/index.scss';
import { WX, navigateToLogin, bridge } from '@/utils';
import Config from '@/config';
import Model from '@/model';
import OB from '@/utils/jump'
import './app.styl';
import Store from './store';
import Index from './pages/index';


class App extends Component {
  constructor(props) {
    super(props);
    this.config = {
      pages: [
        'pages/login/login', // 个人店登陆
        'pages/enter/enter', // 申请入驻
        'pages/goodsmange/goodsmange', // 商品管理
        'pages/stockmarket/stockmarket', // 进货市场
        'pages/shopworker/shopworker', // 店铺工作台
        'pages/my-order/my-order', // 我的订单
        'pages/order-detail/order-detail', // 订单详情
        'pages/logistics-detail/logistics-detail', // 物流详情
        'pages/success/success', // 开店成功
        'pages/failed/failed', // 开店失败
        'pages/storeinfo/storeinfo', // 店铺信息 / 店铺设置
        'pages/step/step', // 开店进程
        'pages/bankcard/bankcard', // 绑定银行卡
        'pages/addBank/addBank', // 添加银行卡
        'pages/storegrade/storegrade', // 店铺会员等级
        'pages/dailygrad/dailygrad', // 今日业绩
        'pages/cashout/cashout', // 提现
        'pages/launchPay/index', // 发起 微信支付界面
        'pages/action-result/action-result', // 结果页
        'pages/goodsdetail/goodsdetail', // 商品详情
        'pages/goods-price/goods-price', // 商品价格
        'pages/store-member/store-member', // 店铺会员
        'pages/member-manage/member-manage', // 会员管理
        'pages/upgrade-store/upgrade-store', // 升级云仓
        'pages/invitecode/invitecode', //绑定服务商
        'pages/guide/guide', // 引导页
        'pages/cometo-admin/cometo-admin',//开启完成
        'pages/accountinfo/accountinfo', // 账户信息详情
        'pages/result/result', // 密码设置结果页
        'pages/yq-list/yq-list', // 邀请列表
        'pages/facecheck/facecheck', // 人脸核身
        'pages/pay-result/pay-result', // 支付结果
        'pages/hot-search/hot-search', // 爆品搜索界面
        'pages/go-shopstore/go-shopstore', // 进入我的店铺界面
        'pages/openStatus/openStatus', // 开店页面
        'pages/aftersales-detail/aftersales-detail', // 售后进度,
        'pages/cashout-result/cashout-result',//提现结果
        'pages/bond/bond', // 自营店保证金
        'pages/order-search/order-search', // 订单搜索界面
        'pages/address/address', // 地址管理
        'pages/edit-address/edit-address', // 编辑地址
        'pages/share-detail/share-detail', // 商品详情分享页面
        'pages/liblist/liblist', // 云仓界面
        'pages/liblistDetail/liblistDetail', // 云仓界面
        'pages/yun-goods-price/yun-goods-price', // 云仓界面
        'pages/yc-profit/yc-profit', // 云仓收益
        'pages/guide-private/guide-private', // 云仓店 引导页
      ],
      window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#F84140',
        navigationBarTitleText: '个人店 - 康小铺',
        navigationBarTextStyle: 'white',
      },
    }

    this.intercept();

  }

  intercept = () => {
    const { path = '', params = {} } = this.$router;
    const { envUserInfo, userInfo } = Store.globalStore.data;
    const nowTime = +new Date;
    const { mark = '' } = params;
    const excludePath = function () {
      const args = Array.from(arguments);
      return !args.some((v) => path.includes(v));
    }

    // 授权回来
    const authoBackFn = (wxParams) => {
      const cacheEnvUserInfo = { ctmTime: nowTime };
      Model.common.getOpenId({ code: wxParams.code }).then(resModel => {
        if (resModel) {
          Object.assign(cacheEnvUserInfo, wxParams, resModel);
          Store.globalStore.setData('envUserInfo', cacheEnvUserInfo);
        }
      });
      Model.common.getTicket({ code: wxParams.code }).then(resModel => {
        if (resModel) {
          resModel.jsapiToken = resModel.accessToken;
          delete resModel.accessToken;
          Object.assign(cacheEnvUserInfo, resModel);
          Store.globalStore.setData('envUserInfo', cacheEnvUserInfo);
          // 微信jsSDK初始化
          WX.setWxConfig(resModel.ticket);
        }
      });
    }

    // 用户是否已经微信授权
    envUserInfo.ctmTime = envUserInfo.ctmTime || (nowTime - 5600000);

    if (!params.autho && nowTime - envUserInfo.ctmTime > 5400000 && excludePath('/launchPay') && (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production')) {
      WX.authorize({ mark });
    } else {
      // 注册微信分享
      if (Store.globalStore.data.envUserInfo.ticket) {
        WX.setWxConfig(Store.globalStore.data.envUserInfo.ticket);
      }
    }

    // 带有授权标识码回来
    if (params.autho) {
      const wxParams = Taro.getStorageSync('to3station');
      wxParams.code && authoBackFn(wxParams);
      Taro.removeStorageSync('to3station');
    }

    // 从其它界面直接进入系统情况 用户是否登录
    if ((!userInfo || !userInfo.token) && excludePath('/login', '/guide', '/goodsdetail', '/facecheck', '/share-detail')) {
      navigateToLogin({
        params,
        desc: '[system] file:app.jsx line:112'
      });
      bridge.callhandler('exit');
    };

    // 调接口查询不同用户状态，去往不同界面
    if (userInfo && userInfo.token && excludePath('/login', '/launchPay', '/guide', '/facecheck', '/goodsdetail', '/share-detail')) {
      OB.jump({});
    }

  }

  render() {
    return <Provider store={Store}><Index /></Provider>
  }
}

globalThis.appVersion = Config.version;
globalThis.onCopyText = function (content) { Taro.setClipboardData({ data: content }) }
Taro.render(<App />, document.getElementById('app'))
