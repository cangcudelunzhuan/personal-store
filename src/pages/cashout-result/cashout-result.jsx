/**
 * @Author: zhanglimin
 * @Email: czhanglimin@126.com
 * @Update: 2020-04-20 15:27:17
 * @Description: 提现结果页
 */
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import withPage from '@/components/with-page';
import { Ellipsis } from '@jxkang/wechat-cmpt';
// import Model from '@/model';
import Assets from '@/components/assets';
import styles from './cashout-result.module.styl';



@withPage
class CashoutResult extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '提现',
    }

    this.state = {
      // 界面/组件 初始数据
      type: 'success', // success || failed
    };
  }

  componentDidMount() {
    const { type = 'success' } = this.$router.params
    this.setState({
      type
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  btnClick = () => {
    const { type } = this.state;
    if (type === 'success') {
      Taro.redirectTo({
        url: '/pages/accountinfo/accountinfo?current=1'
      })
    } else {
      Taro.redirectTo({
        url: '/pages/cashout/cashout'
      })
    }

  }

  render() {
    const { type } = this.state;
    if (!type) {
      return;
    }

    return (
      <View className={styles.container}>
        <View className={styles.content}>
          <Image src={type == 'success' ? Assets.other.success : Assets.other.failed} className={styles.img}></Image>
          <View className={styles.title}>{type === 'success' ? '提现成功' : '提现失败'}</View>
          <Ellipsis count={2} className={styles.label}>预计会在1-2个工作日内到账,以银行的实际处理结果为准。</Ellipsis>
        </View>
        <View className={styles.btn} onClick={this.btnClick}>{type == 'success' ? '我知道了' : '重新提现'}</View>
      </View >
    );
  }

}

export default CashoutResult;
