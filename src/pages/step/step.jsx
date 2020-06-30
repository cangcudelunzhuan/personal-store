/**
 * @Author: chunxiao.zhang
 * @Email: chunxiao.zhang@jdxiaokang.com
 * @Update: 2020-02-27 17:25:34
 * @Description: 店铺信息
 */
import Taro from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import styles from './step.module.styl';
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
      info: {},
      step: 1
    };
  }

  //展示二维码弹窗
  showCode = () => {
    this.setState({
      mask: true
    })
  }

  componentWillReact() { }

  componentDidMount() {
    this.getInfo()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  getInfo = () => {
    Model.login.shopInfo().then(res => {
      if(res){
      this.setState({
        info: res,
        step: res.accountOpenProcess
        // step: 4
      })
      }
    })
  }
  goNex = (clickStep) => {
    const { step } = this.state
    if (clickStep === step) {
      let url = ''
      if (clickStep === 1) {
        url = '/pages/bankcard/bankcard'
      }
      if (clickStep === 2) {
        url = '/pages/storegrade/storegrade'
      }
      // if (clickStep === 3) {
      //   url = '/pages/cometo-admin/cometo-admin'
      // }
      Taro.navigateTo({
        url
      })
    }
  }

  goAdmin = () => {
    Model.login.inWork().then(res => {
      if (res === true) {
        message.success('开启成功')
      } else {
        message.error('开启失败')
      }

    })
  }
  render() {
    const { info, step } = this.state;

    return (
      <View>
        {
          info &&
          <View className={styles.before}>
            <View className={`${styles.mtb} ${styles.head_img}`}>
              <View className="iconfont">&#xe691;</View>
            </View>
            <View className={styles.name}>{info.shopName}</View>
            <View className={styles.type}>个人店</View>
            <View className={styles.desc}>*您需要完善相关信息来开启店铺全部功能</View>
            <View className={styles.schedule_box}>
              <View className={`${step >= 1 && styles.red_btn} ${styles.btn}`} onClick={() => this.goNex(1)}>1.绑定银行卡</View>
              <View className={`iconfont ${styles.down} ${step >= 1 && styles.red_down}`}>&#xe6aa;</View>
              <View className={`${step >= 2 && styles.red_btn}  ${styles.btn}`} onClick={() => this.goNex(2)}>2.店铺会员等级</View>
              <View className={`iconfont ${styles.down}  ${step >= 2 && styles.red_down}`}>&#xe6aa;</View>
              <View className={`${step >= 3 && styles.red_btn} ${styles.btn}`}>3.开启完成</View>
              {/* {step >= 3 && < View className={`iconfont ${styles.down}  ${styles.red_down}`}>&#xe6aa;</View>} */}
              {step >= 3 && <View className={`${styles.goAdmin}`} onClick={this.goAdmin}>开启工作台</View>}
            </View>

          </View>
        }
      </View >
    );
  }

}

export default Storeinfo;
