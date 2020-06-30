/**
 * @Author: chunxiao.zhang
 * @Email: chunxiao.zhang@jdxiaokang.com
 * @Update: 2020-02-27 16:23:41
 * @Description: 开店失败
 */
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import styles from './failed.module.styl';



@withPage
class Failed extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '开店失败',
    }

    this.state = {
      // 界面/组件 初始数据
    };
  }
  goentry = () => {
    Taro.navigateTo({
      url: `/pages/enter/enter`
    })
  }

  componentWillReact() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { } = this.state;

    return (
      <View className={styles.container}>
        <Image src={Assets.shop.failed1} className={styles.icon_img}></Image>
        {/* <View className={`iconfont iconzhifushibai ${styles.icon}`}></View> */}
        <View className={styles.failed_text}>支付失败</View>
        <View className={styles.btn}>请重新发起支付</View>
        <View className={styles.pay_btn} onClick={this.goentry}>重新支付</View>
      </View>
    );
  }

}

export default Failed;
