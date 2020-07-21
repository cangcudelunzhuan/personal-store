/* eslint-disable no-undef */
import Taro from '@tarojs/taro';
import Config from '@/config';
import Model from '@/model';
import Assets from '@/components/assets';

const wxUtils = {
  wxIsRead: false,
  // 微信授权
  authorize(params = {}) {
    // 不需要授权的情况
    if (Config.runEnv !== 'weixin') {
      return false;
    }

    let toUrl = document.URL;
    Object.keys(params).forEach(item => {
      if (toUrl.indexOf(`${item}=`) > 0) {
        const reg = new RegExp(`${item}=[^&$]+`);
        toUrl = toUrl.replace(reg, `${item}=${params[item]}`);
      } else {
        toUrl = toUrl + (toUrl.indexOf('?') > 0 ? '&' : '?') + item + '=' + params[item];
      }
    });

    const queryParams = this.getURLSearchParams({ to3: 'wxAuthorize', appId: Config.appId });

    Taro.setStorageSync('authoBackUrl', toUrl);
    globalThis.location.href = `/station.html?${queryParams}`;
  },
  // 获取openId
  getOpenId(code) {
    return Model.common.getOpenId({ code })
  },
  // 发起微信公众号支付
  launchPay({ payInfo, callback }) {
    function onBridgeReady() {
      globalThis.WeixinJSBridge.invoke(
        'getBrandWCPayRequest', payInfo,
        function (res) {
          // res.err_msg === "get_brand_wcpay_request:ok"   //支付成功
          if (typeof callback === 'function') {
            callback(res);
          }
        }
      );
    }
    if (typeof WeixinJSBridge === "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    } else {
      onBridgeReady();
    }
  },
  getURLSearchParams(obj) {
    obj = obj && typeof obj === 'object' ? obj : {};
    let queryStr = '';
    Object.keys(obj).forEach(item => {
      queryStr += '&' + item + '=' + obj[item];
    });
    return queryStr.slice(1);
  },
  // 微信公众号授权配置
  setWxConfig(ticket) {
    const selfThis = this;
    let tid = null;
    const loopNow = Date.now() + 10000;

    if (typeof wx === 'undefined') {
      tid = setInterval(function () {
        if (typeof wx === 'object') {
          clearInterval(tid);
          setConf();
        }
        if (Date.now() > loopNow) {
          clearInterval(tid);
          console.info('[system]', 'wx对象等待超时');
        }
      }, 500);
    } else {
      setConf();
    }

    // 设置配置信息
    function setConf() {
      const nowTime = `${Date.now()}`.slice(0, 10);
      const nonceStr = getRandChart();

      const signShareUrl = globalThis.document.URL.split('#')[0];
      const string1 = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${nowTime}&url=${signShareUrl}`;
      const osha = new jsSHA(string1, "TEXT");
      const signature = osha.getHash("SHA-1", "HEX");
      wx.config({
        debug: false,
        appId: Config.appId,
        timestamp: nowTime,
        nonceStr: nonceStr,
        signature: signature,
        jsApiList: [
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'hideMenuItems'
        ],
        openTagList: ['wx-open-launch-app'],
      });
    }

    // 取随机字符
    function getRandChart() {
      // 65 - 90   97 - 122   48-57
      const rndstrs = [
        {
          start: 65,
          end: 90
        }, {
          start: 97,
          end: 122
        }, {
          start: 48,
          end: 57
        }
      ];
      let result = '';
      function rnd(s, e) {
        return Math.floor(Math.random() * (s - e)) + e
      }
      for (let i = 0; i < 4; i++) {
        const index = Math.min(rnd(0, 3), 2);
        const cur = rndstrs[index]
        for (let j = 0; j <= 7; j++) {
          result += String.fromCharCode(rnd(cur.start, cur.end))
        }
      }
      return result;
    }

    wx.ready(function () {
      selfThis.wxIsRead = true;
    })

    wx.error(function (res) {
      console.info('授权失败了', res);
    });

  },

  updateApp({
    type = 'updateAppMessageShareData',
    params = {}
  }) {
    const selfThis = this;
    const loopNow = Date.now() + 10000;

    const shareBaseOptions = {
      title: '康小铺|京东健康战略合作伙伴',
      desc: '加入康小铺，开启创业之旅',
      link: globalThis.document.URL,
      imgUrl: Assets.common.share_logo,
      success: function () {
        console.log(`${type} - 成功`)
      },
      fail: function (err) {
        console.error(type, err)
      }
    };

    const defaultParams = {
      updateAppMessageShareData: shareBaseOptions,
      updateTimelineShareData: shareBaseOptions
    }
    let tid = null;
    params = Object.assign({}, defaultParams[type], params);
    if (selfThis.wxIsRead) {
      fn();
    } else {
      tid = setInterval(function () {
        if (selfThis.wxIsRead) {
          clearInterval(tid);
          fn();
        }
        if (Date.now() > loopNow) {
          clearInterval(tid);
          console.info('[system]', '等待read方法超时');
        }
      }, 500);
    }
    function fn() {
      wx[type](params);
      // 关闭复制链接功能
      // wx.hideMenuItems({
      //   menuList: ['menuItem:copyUrl']
      // });
    }
  }


}

export default wxUtils;