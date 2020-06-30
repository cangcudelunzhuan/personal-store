/**
 * @Author: cai.ping
 * @Email: cai.ping@jdxiaokang.com
 * @Update: 2020-02-26 16:09:41
 * @Description: true
 */
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import withPage from '@/components/with-page';
import { message } from '@jxkang/wechat-utils';
import Model from '@/model';
import Assets from '@/components/assets';
import styles from './logistics-detail.module.styl';



@withPage
class LogisticsDetail extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '物流信息',
    }

    this.state = {
      // 界面/组件 初始数据
      list: [],
      info: {}
    };
  }
  getDeliveryTrail = () => {
    const { orderNo } = this.$router.params
    Model.order.getDeliveryTrail({ orderNo }).then(res => {
      if (res) {
        this.setState({
          list: res.list || [],
          info: res
        })
      }
    })
  }
  copyAction = (data) => {
    Taro.setClipboardData({
      data,
      success() {
        message.success('复制成功');
      }
    })
  }

  componentWillReact() { }

  componentDidMount() {
    this.getDeliveryTrail()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { list, info } = this.state;

    return (
      <View className={styles.out}>
        <View className={styles.red_bar}></View>
        <View className={styles.back}></View>
        <View className={`${styles.addres_box} ${styles.trans_box}`}>
          <View className={styles.name_box}>
            <Text className={styles.name}>{info.expName}</Text>
            <Text className={styles.tel}>{info.number}</Text>
            <View className={styles.copy_box} onClick={() => this.copyAction(info.number)}>复制</View>
          </View>
          {list.map((item, i) =>
            <View className={`${styles.item} ${i === 0 && styles.active} `}>
              <View className={styles.date_box}>
                <View>{item.time}</View>
              </View>
              <View className={styles.status}>{item.status}</View>
            </View>
          )}
        </View>
      </View >
    );
  }

}

export default LogisticsDetail;
