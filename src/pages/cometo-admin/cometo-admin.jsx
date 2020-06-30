
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import Utils from '@/utils';
import Config from '@/config';
import styles from './cometo-admin.module.styl';
import Shopinfo from '@/components/open-process-title'
import { message } from '@jxkang/wechat-utils';

@withPage
class Storeinfo extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '店铺工作台',
    }

    this.state = {
      // 界面/组件 初始数据
    };
  }

  goAdmin = () => {
    Model.login.inWork().then(res => {
      if (res === true) {
        message.success('开启成功')
        if (Config.runEnv === 'android' || Config.runEnv === 'ios') {
          Utils.bridge.callhandler('goMain', {});
        } else {
          Taro.navigateTo({
            url: `/pages/shopworker/shopworker`
          })
        }
      }
    })
  }

  componentWillReact() { }

  componentDidMount() {


  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { info, step } = this.state;

    return (
      <View className={styles.content}>
        <Shopinfo></Shopinfo>
        <View className={styles.inner}>
          <Image src={Assets.shop.success1} className={styles.icon_img}></Image>
          <View>恭喜！开启轻松赚钱之旅</View>
          <View className={styles.btn} onClick={this.goAdmin}>进入工作台</View>
        </View>
      </View >
    );
  }

}

export default Storeinfo;
