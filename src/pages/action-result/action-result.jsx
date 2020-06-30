/**
 * @Author: cai.ping
 * @Email: cai.ping@jdxiaokang.com
 * @Update: 2020-02-25 12:14:58
 * @Description: true
 */
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import styles from './action-result.module.styl';
import { AtIcon, AtDivider } from 'taro-ui'


@withPage
class PayResult extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '结果',
    }

    this.state = {
      // 界面/组件 初始数据
      typeList: [
        {
          name: '提现',
          desc: '预计会在1-2个工作日内到账，以银行 的实际处理结果为准',
          fail: 'XXXXXXXXXXXXX 请重新提现',
          type: 0
        },
        {
          name: '密码设置',
          desc: '可用于下次支付时输入',
          fail: 'XXXXXXXXXXXXX 请重新设置',
          type: 1
        },
        {
          name: '密码重置',
          desc: '可用于下次支付时输入',
          fail: 'XXXXXXXXXXXXX 请重新设置',
          type: 2
        }
      ],
      type: 1,
      status: 1
    };
  }

  componentWillReact() { }

  componentDidMount() {
    const { type, status } = this.$router.params
    this.setState({
      type: Number(type),
      status: Number(status),
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { type, typeList, status } = this.state;
    // type 0提现 1密码设置 2密码重置 status 1成功 2失败
    return (
      <View className={styles.content}>
        {/* 成功 */}
        {status === 1 && <View className={styles.pay_success}>
          <View className={styles.icont_box}>
            <View className="iconfont">&#xe6a2;</View>
          </View>
          <View className={styles.status}>{typeList[type].name}成功</View>
          <View className={styles.gray}>{typeList[type].desc}</View>
          <View className={styles.button_box}>
            {/* <View className={`${styles.button} ${styles.left_button}`}>查看订单</View> */}
            <View className={`${styles.button} ${styles.right_button}`}>返回工作台</View>
          </View>
        </View>}
        {/* 失败 */}
        {status === 2 && <View className={`${styles.pay_success} ${styles.pay_false}`}>
          <View className={styles.icont_box}>
            <View className="iconfont">&#xe697;</View>
          </View>
          <View className={styles.status}>{typeList[type].name}失败</View>
          <View className={styles.gray}>失败原因：{typeList[type].fail}</View>
          <View className={styles.button_box}>
            <View className={`${styles.button} ${styles.right_button}`}>重新{typeList[type].name}</View>
          </View>
        </View>}
        <View className={styles.tj_out}>
          <AtDivider content='为你推荐' fontColor='#333' lineColor='#F7F7F7' fontSize="28px" />
          <View className={styles.tuijian_box}>
            {[1, 2, 3, 4].map(item =>
              <View className={styles.item}>
                <Image className={styles.img} src="http://img5.imgtn.bdimg.com/it/u=3836022977,4193961472&fm=26&gp=0.jpg"></Image>
                <View className={styles.bottom}>
                  <View className={styles.title}>单行或可折行的标题，通常最多显示两行文字</View>
                  <View className={styles.price_box}>
                    <Text>￥</Text>
                    <Text className={styles.num}>187</Text>
                    <Text className={styles.small_num}>¥299</Text>
                  </View>
                  <View className={styles.tag}>包邮</View>
                </View>
              </View>
            )}
          </View>
        </View>
      </View >
    );
  }

}

export default PayResult;
