
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './storegrade.module.styl';
class Storeinfo extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '',
    }

    this.state = {
      // 界面/组件 初始数据

    };
  }


  componentWillReact() { }

  componentDidMount() {


  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }



  render() {
    return (
      <View className={styles.xiey}>

        <View>1.黄金、钻石会员自购可获得自购返佣，金额同对应级别分享成单金额；</View>
        <View>2.总返佣金额最大不可超过钻石会员的分享返佣；</View>
        <View>3.存在黄金/钻石会员的邀请人是黄金/钻石的情形时，先计算购买者的自购返佣，剩余部分给到分享者；分享者根据自己等级获得对应返佣，若总返佣未分配完，会分配给店主；</View>

      </View>
    );
  }

}

export default Storeinfo;
