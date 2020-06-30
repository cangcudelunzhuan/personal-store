import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { $ajax } from '@jxkang/wechat-utils';
import Model, { getFetchHeader } from '@/model';
import Utils, { navigateToLogin } from '@/utils';
import imgsrc from '@/components/assets';
import styles from './index.module.styl';


class Collect extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '',
    }

    this.state = {
      // 界面/组件 初始数据
      info: {
      }
    };
  }



  componentDidMount() {
    this.getInfo()
  }
  getInfo = () => {
    Model.login.shopInfo().then(res => {
      // res.accountOpenProcess = 2
      if (res) {
        this.setState({
          info: res,
        })
      }

    })
  }
  loginOut = () => {
    const { globalStore } = this.props;
    Model.login.logout().then(res => {
      if (res) {
        Taro.removeStorageSync('userInfo')
        $ajax.uninjectHeaders();
        $ajax.injectHeaders(getFetchHeader(true));
        globalStore.setData('userInfo', {});
        Utils.bridge.callhandler('exit', {});
        navigateToLogin({
          desc: '[system] file:cmpt/open-process-title.jsx line:50'
        });
      }
    })
  }

  render() {
    const { info } = this.state
    return (
      <View className={styles.out}>
        <View className={styles.img_box}>
          <View className={`iconfont ${styles.icon}`}>&#xe691;</View>
          <View className={styles.right}>
            <View className={styles.name}>{info.shopName}</View>
            <View className={styles.lv_box}>
              <Image src={imgsrc.shop.lv} className={`${styles.img} no-loading`}></Image>
              <View className={styles.font}>个人店</View>
            </View>
          </View>
          <View className={styles.login_out} onClick={this.loginOut}>退出</View>
        </View>
        <View className={styles.step_box}>
          <View className={`${styles.item} ${info.accountOpenProcess >= 1 ? styles.active : null}`}>1.绑定银行卡</View>
          <View className={`${styles.item} ${info.accountOpenProcess >= 2 ? styles.active : null}`}>2.店铺会员等级</View>
          <View className={`${styles.item} ${info.accountOpenProcess >= 3 ? styles.active : null}`}>3.开启完成</View>
        </View>
        <View className={styles.gray}>*您需要完善相关信息来开启店铺全部功能</View>
      </View>
    );
  }

}

export default Collect;
