/**
 * @Author: cai.ping
 * @Email: cai.ping@jdxiaokang.com
 * @Update: 2020-03-07 10:21:09
 * @Description: true
 */
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import { navigateToLogin } from '@/utils';
import Config from '@/config';
import Assets from '@/components/assets';
import styles from './guide.module.styl';
import OB from '@/utils/jump'


@withPage
class Guide extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '康小铺',
    }

    this.state = {
      // 界面/组件 初始数据
      phone: '',
    };
  }

  componentWillReact() { }

  componentDidMount() {

    /*
    Model.common.getPayAmount({bizType: 1}).then(resModel => {
      if(typeof resModel === 'number'){
        Config.costAmount = resModel < 100 ? resModel : `${resModel}/年`;
        this.setState({});
      }
    });
    */

    if (Taro.getStorageSync('userInfo')) {
      const { phone } = Taro.getStorageSync('userInfo')
      this.setState({
        phone,
      })
    }
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  isLogin = (type) => {
    const mark = this.$router.params.mark || ''
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo && userInfo.token) {
      this.openProcess(type)
    } else {
      navigateToLogin({
        params: {
          mark,
          isFree: type
        },
        desc: '[system] file:guide.jsx line:54'
      });
    }
  }

  openProcess = (type) => {
    // const mark = this.$router.params.mark || ''
    OB.jump({ telphone: Taro.getStorageSync('userInfo').phone, isFree: type })
  }

  render() {
    return (
      <View className={styles.content}>
        {/* <Image src={Assets.guide.one}></Image> */}
        <View className={styles.one}
          style={{
            background: `url(${Assets.guide.one}) top center no-repeat`,
            backgroundSize: '100%'
          }}></View>
        <View className={styles.two}
          style={{
            background: `url(${Assets.guide.two}) top center no-repeat`,
            backgroundSize: '100%'
          }}></View>
        <View className={styles.three}
          style={{
            background: `url(${Assets.guide.three}) top center no-repeat`,
            backgroundSize: '100%'
          }}></View>
        {/* <View className={styles.buttom_box} onClick={this.isLogin}>
          <View className={styles.left}>
            <View className={styles.big}>限时开通</View>
          </View>
          <View className={styles.right}>
            <View className={styles.red}>￥{Config.costAmount}</View>
            <View className={styles.gray}>¥4999</View>
            <View className={styles.button}>立即开通<View className={'iconfont'}>&#xe694;</View></View>
          </View>
        </View> */}
        <View className={styles.button_box}>
          {/* <View className={styles.button_item} onClick={() => this.isLogin(1)}>
            <View className={styles.left}>
              <View className={styles.amount}>¥{Config.costAmount}</View>
              <View className={styles.origin}>¥1999</View>
            </View>
            <View className={`${styles.icon} iconfont`}>&#xe6b2;</View>
          </View> */}
          <View className={`${styles.button_item} ${styles.free_button}`} onClick={() => this.isLogin(2)}>
            <View className={styles.left}>
              云地摊神器，免费试用
            </View>
            <View className={`${styles.icon} iconfont`}>&#xe6b2;</View>
          </View>
        </View>
      </View >
    );
  }

}

export default Guide;
