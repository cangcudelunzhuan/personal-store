import Taro from '@tarojs/taro';
import { observable } from 'mobx';

const counterStore = observable({
  data: {
    // 登录的用户帐号信息
    userInfo: Taro.getStorageSync('userInfo') || {},
    // 环境用户信息 < 非康小铺用户信息 >
    envUserInfo: Taro.getStorageSync('envUserInfo') || {},
    // 下单 支付参数
    launchPay: Taro.getStorageSync('launchPay') || {
      backUrl: '', // 返回跳转
      payInfo: {}
    },
    // 系统信息
    systemInfo: Taro.getSystemInfoSync(),
    //订单搜索历史记录
    orderSearchHistory: Taro.getStorageSync('orderSearchHistory') || [],
    //云仓搜索记录
    yunCangSearchHistory: Taro.getStorageSync('yunCangSearchHistory') || [],
    shareImgInfo: Taro.getStorageSync('shareImgInfo') || {},
  },
  setData(keyName, model) {
    if (this.data.hasOwnProperty(keyName)) {
      this.data[keyName] = model;
      // 有一些记入存储的数据
      if (['userInfo', 'envUserInfo', 'launchPay', 'orderSearchHistory', 'yunCangSearchHistory', 'shareImgInfo'].includes(keyName)) {
        Taro.setStorageSync(keyName, model);
      }
    }
  }
})
export default counterStore;