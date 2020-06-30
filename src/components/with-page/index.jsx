/**
 * @Author: 福虎
 * @Email: Shenghu.tan@jdxiaokang.com
 * @Update: 2020-01-22 13:52:26
 * @Description: taro项目界面注解
 */
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Common } from '@jxkang/wechat-utils';
import { observer, inject } from '@tarojs/mobx';
import Utils, { WX } from '@/utils';
import styles from './index.module.styl';


function withPage(Cmpt) {
  const iCmpt = new Cmpt({});

  class App extends Taro.Component {
    constructor(props) {
      super(props);
      this.config = Object.assign({}, iCmpt.config);

      this.updateShareConfig();
    }

    componentDidShow() {
      typeof this.withPage.componentDidShow === 'function' && this.withPage.componentDidShow(this);
    }

    onBack = () => {
      Taro.navigateBack();
    }

    /**
     * 注入微信分享码功能
     */
    updateShareConfig = (params={}) => {
      const {globalStore} = this.props;
      const thisUrl = globalThis.document.URL;
      
      // 邀请码
      const invitationCode = (globalStore.data.userInfo || {}).invitationCode || '';
      const shareParams = WX.getURLSearchParams({mark: invitationCode});
      
      params = Object.assign({}, {
        title: '康小铺|京东健康战略合作伙伴' || this.config.navigationBarTitleText,
        desc: '加入康小铺，开启创业之旅',
        link: `${thisUrl.indexOf('?') > 0 ? thisUrl + '&' + shareParams : thisUrl + '?' + shareParams}`
      }, params);
      
      // 朋友分享
      WX.updateApp({
        params
      });
      // 朋友圈分享
      WX.updateApp({
        type: 'updateTimelineShareData',
        params
      });

      return params;
    }

    scope = () => ({
      updateShareConfig: this.updateShareConfig
    })

    render() {
      return (
        <View className={styles.page_container} style={{ paddingTop: 0 }}>
          <View className={styles.navigationBar} hidden>
            <View
              className={styles.navigation_back}
              onClick={this.onBack}
            >
              返回
            </View>
            <View className={styles.navigationBar_text}>
              {
                iCmpt.config.navigationBarTitleText
              }
            </View>
            <View hidden={!Common.isType(iCmpt.renderNavigationRight, 'function')} className={styles.navigation_right}>{Common.isType(iCmpt.renderNavigationRight, 'function') && iCmpt.renderNavigationRight()}</View>
          </View>
          <Cmpt
            ref={el => {
              if(el){
                el.logger = Utils.logger.bind(el);
                this.withPage = el;
              }
            }}
            {...this.props}
            withPageScope={this.scope()}
          />
        </View>
      );
    }
  }
  return inject('globalStore')(observer(App));
}

export default withPage;