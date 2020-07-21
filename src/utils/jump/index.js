import Taro from '@tarojs/taro';
import Model from '@/model';
import Utils from '@/utils';
// import { message } from '@jxkang/wechat-utils';

const OB = {
  excludePath() {
    const { path } = Taro._$router;
    const args = Array.from(arguments);
    return !args.some((v) => path.includes(v));
  },
  jump({ telphone = '', isFree = 3, callback }) {
    const { path, params } = Taro._$router;
    const { mark = '' } = params;
    const { phone } = Taro.getStorageSync('userInfo')
    Model.login.openProcess().then(res => {
      const fromUrl = Taro.getStorageSync('fromUrl');
      Taro.removeStorageSync('fromUrl');
      Utils.logger({
        loger: '调用openProcess接口成功,可以分析该用户应该跳往哪个界面',
        api_url: Model.login.openProcess.toString(),
        api_req: JSON.stringify({}),
        api_res: JSON.stringify(res)
      });
      // if (isFree === 2 && res > 0 && res !== 20 && !OB.excludePath('guide')) {
      //   message.error('您已享用免费试用')
      //   return
      // }
      if(typeof callback === 'function'){
        if(callback(res) === false){
          return false;
        }
      }
      if (res === 0) { // 申请入驻
        Taro.navigateTo({
          url: `/pages/enter/enter?phone=${telphone || phone}&isFree=${isFree}`
        })
      }
      if (res === 1) { // 绑定银行卡 remove
        Taro.navigateTo({
          url: `/pages/bankcard/bankcard`
        })
      }
      if (res === 2) { // 店铺会员等级 remove
        Taro.navigateTo({
          url: `/pages/storegrade/storegrade`
        })
      }
      if (res === 3) { // 开启完成 remove
        Taro.navigateTo({
          url: `/pages/cometo-admin/cometo-admin`
        })
      }
      if (res === 4) {
        Taro.navigateTo({
          url: OB.excludePath('/login', '/guide/') ? `${path}${Taro._$router.search}` : fromUrl || `/pages/shopworker/shopworker`
        })
      }
      if (res === 20) { // 全新的用户 绑定服务商
        Taro.navigateTo({
          url: `/pages/invitecode/invitecode?&mark=${mark}&phone=${telphone || phone}&isFree=${isFree}`
        })
      }
    })
  }
}
export default OB
