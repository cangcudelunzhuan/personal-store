import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Common } from '@jxkang/wechat-utils';
import withPage from '@/components/with-page';
import Model from '@/model';
import Utils from '@/utils';
import Assets from '@/components/assets';
import styles from './result.module.styl';




@withPage
class OrderDetail extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '密码设置',
    }
    
    /**
     * tranType 1 设置密码 2 提现 3 余额支付
     * status 1 处理中，2 成功，3 失败
     */
    const { status, tranType, msg } = this.$router.params;
    this.state = {
      // 界面/组件 初始数据
      passwordStatus: status != 3,
      btnText: status != 3 ? '返回工作台' : '重新设置', //按钮文案
      status,
      tranType,
      message: decodeURIComponent(msg)
    };
  }

  goUrl = (status) => {
    Utils.bridge.callhandler('finish');
    if (status == 1) {
      Taro.navigateTo({
        url: '/pages/shopworker/shopworker'
      })
    } else {
      Taro.navigateTo({
        url: '/pages/accountinfo/accountinfo?current=1'
      })
    }
  }

  render() {
    const { status, btnText, tranType, message } = this.state;

    return (
      <View className={styles.container}>
        {
          Common.seek()
          .equal(
            tranType == '1',
            status != '3' ? (
            <View>
              <View className={styles.icon} style={{ backgroundImage: `url(${Assets.password.success})` }}></View >
              <View className={styles.status}>密码设置成功</View>
              <View className={styles.desc}>{message || '可用于下次支付时输入'}</View>
            </View> ) : ( <View>
              <View className={styles.icon} style={{ backgroundImage: `url(${Assets.password.failed})` }}></View>
              <View className={styles.status}>{message || '密码设置失败'}</View>
            </View> )
          )
          .equal(
            tranType == '2',
            status != '3' ? (
              <View>
                <View className={styles.icon} style={{ backgroundImage: `url(${Assets.password.success})` }}></View >
                <View className={styles.status}>{message || '操作成功'}</View>
              </View> ) : ( <View>
                <View className={styles.icon} style={{ backgroundImage: `url(${Assets.password.failed})` }}></View>
                <View className={styles.status}>{message || '提现失败'}</View>
              </View> )
          )
          .equal(
            tranType == '3',
            status != '3' ? (
              <View>
                <View className={styles.icon} style={{ backgroundImage: `url(${Assets.password.success})` }}></View >
                <View className={styles.status}>{message || '操作成功'}</View>
              </View> ) : ( <View>
                <View className={styles.icon} style={{ backgroundImage: `url(${Assets.password.failed})` }}></View>
                <View className={styles.status}>{message || '支付失败'}</View>
              </View> )
          )
          .else(
            <View>暂无匹配到返回类型</View>
          )
          .get()
        }
        <View className={styles.btn} onClick={() => this.goUrl(this.$router.params.status)}>{btnText}</View>
      </View >
    );
  }

}

export default OrderDetail;
