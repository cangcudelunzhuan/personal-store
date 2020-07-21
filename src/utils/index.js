import Taro from '@tarojs/taro';
import { Common, Orderly } from '@jxkang/wechat-utils';
import Store from '@/store';
import Config from '@/config';
import drawQrcode, { saveCanvas } from './qrcode';
import WX from './wx';
import orderPay from './order-pay';
import bridge from './bridge';
import imgshare from './imgshare';

// 轻量级收集表单数据的方法
const formHandlerChange = (cmpt, formName = 'formData') => (value, key) => {
  const formData = cmpt.state[formName];
  value = value.target ? value.target.value : value;
  if (value && typeof value === 'string') { value = value.trim() };
  formData[key] = value;
  cmpt.setState({ [formName]: formData });
};

/**
   * @method formatDateTime 时间戳转年月日时分秒格式
   * @param dates 时间戳
   * @return xxxx-xx-xx xx:xx:xx
   */
/**
 * @method formatDateTime 时间戳转年月日时分秒格式
 * @param dates 时间戳
 * @return xxxx-xx-xx xx:xx:xx
 */
const formatDateTime = (dates) => {
  const date = new Date(dates);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? (`0${m}`) : m;
  let d = date.getDate();
  d = d < 10 ? (`0${d}`) : d;
  let h = date.getHours();
  h = h < 10 ? (`0${h}`) : h;
  let minute = date.getMinutes();
  minute = minute < 10 ? (`0${minute}`) : minute;
  // let s = date.getSeconds();
  // s = s < 10 ? (`0${s}`) : s;
  return `${y}-${m}-${d} ${h}:${minute}`;
};


/**
 * 获取完整的文件URL路径
 * @param {String} v 文件路径
 */

const getFileUrl = function (v, opt) {
  let p = `/${v}`.replace(/^\/+/, '/');
  if (Common.isType(opt, 'object') && /(?:\.jpg)|(?:\.jpeg)|(?:\.png)|(?:\.gif)/i.test(p)) {
    opt.w = opt.w || '';
    opt.h = opt.h || '';
    opt.query = opt.query || '';

    p = p.indexOf('?') > 0 ? opt.query ? `${p}&${opt.query}` : p + `&x-oss-process=image/resize,m_fill,w_${opt.w},h_${opt.h}` : opt.query ? `${p}?${opt.query}` : p + `?x-oss-process=image/resize,m_fill,w_${opt.w},h_${opt.h}`;
    p = p.replace(/(?:w_\b),?|(?:h_\b),?/g, '').replace(/,$/, '');
  }
  return v && (`${v}`.indexOf('//') > -1 ? v : `${Config.imgHost}${p}`);
};



// 是否微信环境
const isWeChat = Taro.getEnv() === Taro.ENV_TYPE.WEB && /microMessenger/i.test(navigator.userAgent);

//精度计算
const formatPoint = (f, digit) => {
  if (f === 'NaN') return '--';
  const d = digit || 2;
  // eslint-disable-next-line no-restricted-properties
  const m = Math.pow(10, d);
  const res = Math.round(f * m, 10) / m;
  // return res.toFixed(d);
  return res;
}


/**
 * 获取图片文件信息
 */
const getImageInfo = function ({ src }) {
  // 小程序使用 Taro.getImageInfo
  return globalThis.loadImage(src);
}
// 延迟 主要防止狂点击触发某事件、事务
const delay = (cmptThis, funcs, options) => {
  if (Common.isType(cmptThis, 'array')) {
    funcs = cmptThis;
    cmptThis = this;
  }
  funcs.forEach(fn => {
    if (Common.isType(cmptThis[fn], 'function')) {
      cmptThis[fn] = Orderly.call(cmptThis, cmptThis[fn], options);
    }
  });
}

/**
 * 跳转至登录界面
 * 为了统一方便管理与调试问题
 */
const navigateToLogin = function ({
  params, // 附带在登录界面的参数
  desc, // 描述 方便定位问题
  backUrl = document.URL,
}) {
  params = typeof params === 'string' ? params : Common.queryString(params || {});
  const gotoLoginUrl = `/pages/login/login${params ? '?' + params : ''}`;
  console.log('[system]', desc);

  Taro.setStorageSync('fromUrl', backUrl);

  Taro.navigateTo({
    url: gotoLoginUrl
  });

}
//获取订单状态
const getOrderStatus = ({ afterSale, afterSaleStatus, orderStatus, afterSaleType }) => {
  let status = ''
  if (afterSale === 0) {
    switch (orderStatus) {
      case 0:
        status = '待支付'
        break
      case 1:
        status = '待发货'
        break
      case 2:
        status = '待收货'
        break
      case 3:
        status = '已完成'
        break
      case 4:
        status = '已关闭'
        break
      case 7:
        status = '已取消'
        break
      default:
        break
    }

  } else if (afterSale === 1) {
    status = getAfterStatus({ afterSaleStatus, afterSaleType })
  }
  return status
}
//获取售后状态
const getAfterStatus = ({ afterSaleStatus, afterSaleType }) => {
  let status = ''
  if (afterSaleStatus === 53 || afterSaleStatus === 99) {
    status = '售后完结'
  }
  else if (afterSaleStatus !== 53 && afterSaleStatus !== 99 && afterSaleStatus !== 98 && afterSaleStatus !== 97) {
    switch (afterSaleType) {
      case 1:
        status = "退款中"
        break
      case 2:
        status = "退货中"
        break
      case 3:
        status = "赔付中"
        break
      default:
        status = '售后中'
        break
    }
  }
  else if (afterSaleStatus === 98) {
    switch (afterSaleType) {
      case 1:
        status = "退款驳回"
        break
      case 2:
        status = "退货驳回"
        break
      case 3:
        status = "赔付驳回"
        break
      default:
        status = '售后驳回'
        break
    }
  }
  else if (afterSaleStatus === 97) {
    status = '售后取消'
  }
  return status
}

// 日志
const logger = function (logs = {}) {
  /* 日志 统计字段 列表
  'user_name'       // 用户名称
  'fingerprint'     // 指纹
  'platforminfo'    // 平台数据
  'systeminfo',     // 系统数据<web端,可选>
  'language',       // 语言
  'logs',           // 开发者log日志
  'page_err',       // 界面js报错详情
  'api_url',        // 后端接口url
  'api_req',        // 后端接口入参
  'api_res',        // 后端接口出参
  'platform_type',  // 日志平台类型
  'hostname',       // 域名
  'protocol',       // 协议
  'url',            // url
  'pathname',       // pathname
  'create_time'     // 日志创建时间<可选>
  */
  const { globalStore: { data: { userInfo, envUserInfo, systemInfo } } } = Store;

  logs.platform_type = Config.runEnv === 'ios' || Config.runEnv === 'android' ? 'personal-store-app' : 'personal-store-h5';
  logs.fingerprint = globalThis.fingerprintCode || '';
  logs.user_name = logs.user_name || (userInfo.phone || userInfo.userName) + '-' + userInfo.nickName;
  logs.hostname = logs.hostname || globalThis.location.hostname;
  logs.protocol = logs.protocol || globalThis.location.protocol;
  logs.url = logs.url || document.URL;
  logs.language = globalThis.navigator.language;
  logs.pathname = logs.pathname || globalThis.location.hash;
  logs.platforminfo = logs.platforminfo || JSON.stringify(userInfo);
  logs.systeminfo = JSON.stringify(Object.assign({ ua: navigator.appVersion }, envUserInfo, systemInfo));

  if (logs.user_name.indexOf('undefined') === 0) { logs.user_name = '' }
  if (process.env.NODE_ENV === 'production' || logs.force === true) {
    Taro.request({ url: 'https://web-service.jingxiaokang.com/common/logs', method: 'post', header: { 'content-type': 'application/json; charset=UTF-8' }, dataType: 'text', responseType: 'text', data: logs });
  } else {
    console.log(logs);
  }
}

globalThis.logger = logger;

export default {
  formHandlerChange,
  getFileUrl,
  isWeChat,
  getImageInfo,
  saveCanvas,
  drawQrcode,
  isWeb: Taro.getEnv() === Taro.ENV_TYPE.WEB,
  WX,
  formatPoint,
  navigateToLogin,
  orderPay,
  bridge,
  delay,
  logger,
  getAfterStatus,
  getOrderStatus,
  imgshare,
  formatDateTime,
}

export { formHandlerChange }
export { getFileUrl }
export { isWeChat }
export { getImageInfo }
export { drawQrcode }
export { saveCanvas }
export { WX }
export { formatPoint }
export { navigateToLogin }
export { orderPay }
export { bridge }
export { delay }
export { logger }
export { getAfterStatus }
export { getOrderStatus }
export { imgshare }
export { formatDateTime }

