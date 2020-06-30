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
  jump({ telphone = '', isFree = 3 }) {
    const { path, params } = Taro._$router;
    const { mark = '' } = params;
    const { phone } = Taro.getStorageSync('userInfo')
    Model.login.openProcess().then(res => {
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
      if (res === 0) {
        Taro.navigateTo({
          url: `/pages/enter/enter?phone=${telphone || phone}&isFree=${isFree}`
        })
      }
      if (res === 1) {
        Taro.navigateTo({
          url: `/pages/bankcard/bankcard`
        })
      }
      if (res === 2) {
        Taro.navigateTo({
          url: `/pages/storegrade/storegrade`
        })
      }
      if (res === 3) {
        Taro.navigateTo({
          url: `/pages/cometo-admin/cometo-admin`
        })
      }
      if (res === 4) {
        Taro.navigateTo({
          url: OB.excludePath('/login', 'guide') ? `${path}${Taro._$router.search}` : `/pages/shopworker/shopworker`
        })
      }
      if (res === 20) {
        Taro.navigateTo({
          url: `/pages/invitecode/invitecode?&mark=${mark}&phone=${telphone || phone}&isFree=${isFree}`
        })
      }
    })
  }
}
export default OB
