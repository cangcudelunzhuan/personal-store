/**
 * @Author: chunxiao.zhang
 * @Email: chunxiao.zhang@jdxiaokang.com
 * @Update: 2020-02-27 16:16:03
 * @Description: 开店成功
 */
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import styles from './success.module.styl';



@withPage
class Success extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '开店成功',
    }

    this.state = {
      // 界面/组件 初始数据
    };
  }

  gostep = () => {
    Taro.navigateTo({
      url: '/pages/bankcard/bankcard'
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
        <Image src={Assets.shop.success1} className={styles.icon_img}></Image>
        {/* <View className={`iconfont iconkaidianchenggong ${styles.icon}`}></View> */}
        <View className={styles.success_text}>恭喜您，开店成功了！</View>
        <View className={styles.btn} onClick={this.gostep}>开启店铺</View>
      </View >
    );
  }

}

export default Success;
