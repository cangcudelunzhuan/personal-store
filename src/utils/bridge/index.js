/**
 * 原生安卓、ios交互
 */
import Config from '@/config';

const androidLitenEvents = [];

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  let WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe);
  });
}


const Bridge = {
  // 所有原生交互类型
  types: {
    toast: 'toast',
    // 完成关闭h5界面
    finish: 'finish',
    // 关闭webview
    exit: 'exit',
    // 开店完成 进入工作台
    goMain: 'goMain',
    // 保证金交纳 成功 返回工作台
    goWorkTab: 'goWorkTab',
    // ...
    setUserinfo: 'setUserinfo',
    // 订单号
    getOrderId: 'getOrderId',
    // 进入自营发布商品界面
    releasegood: 'releasegood',
  },
  // 所有原生监听名称
  listenTypes: {
    // 支付成功
    paysuccess: 'paysuccess'
  },
  /**
   * 前端主动调用原生
   * @param {String} name 跟原生约定的交互类型
   * @param {String | Object} data 传递给原生的入参参数
   * @param {Function} callback 回调函数可选
   * @example
   * Utils.bridge.callhandler('toast', {"data":"这里是参数"}, function(){
   *  return {msg:'hello app demo'}
   * });
   */
  callhandler(name, data = {}, callback) {
    const selfThis = this;
    name = selfThis.types[name] || name;

    if (Config.runEnv === 'ios') {
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler(name, data, callback);
      })
    } else if (Config.runEnv === 'android') {
      globalThis.kangxiaopu.call(name, JSON.stringify(data), 0);
    }
  },
  /**
   * 前端注册事件，原生调用前端
   * @param {*} name 跟原生约定的交互类型
   * @param {*} callback 回调函数
   * @example
   * Utils.bridge.registerhandler('toast', function(data){...});
   */
  registerhandler(name, callback) {
    const selfThis = this;
    name = selfThis.listenTypes[name] || name;

    androidLitenEvents.push({fname:name, callback});

    if (Config.runEnv === 'ios') {
      setupWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler(name, function (data, responseCallback) {
          callback(data, responseCallback);
        })
      })
    } else if (Config.runEnv === 'android') {
      globalThis.callback = function(fname, callbackId, result){
        const currIndex = androidLitenEvents.findIndex(v => v.fname===fname);
        const currFunc = androidLitenEvents[currIndex];
        if(currIndex>-1 && currFunc){
          androidLitenEvents.splice(currIndex, 1);
          currFunc.callback(result);
        }
      }
    }
  }

}

export default Bridge;