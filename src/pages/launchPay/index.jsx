/**
 * @Author: 福虎
 * @Email: Shenghu.tan@jdxiaokang.com
 * @Update: 2020-02-25 11:32:02
 * @Description: 唤起微信支付界面
 */
import Taro, {Component} from '@tarojs/taro';
import {View, Button, Text} from '@tarojs/components';
import withPage from '@/components/with-page';
import Utils from '@/utils';
import styles from './launchPay.module.styl';


let pageLoadTid = null;
@withPage
class LaunchPay extends Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '发起支付',
    }

    this.state = {
      notFoundPayInfo: false
    }
    
  }

  getPayInfo = () => {
    const { launchPay } = (this.props.globalStore||{}).data || {launchPay:{payInfo:{}}};
    if(typeof launchPay.payInfo === 'string'){
      launchPay.payInfo = JSON.parse(launchPay.payInfo);
    }
    return launchPay;
  }

  onGoBack = () => {
    Taro.navigateBack();
  }

  componentDidShow(){
    clearTimeout(pageLoadTid);
    pageLoadTid = setTimeout(()=>{
      this.checkBeforePay();
    },1000);

    this.logger({
      logs: '个人店H5用户已经进入到launchPay界面了，马上就准备唤起微信支付'
    });
  }

  checkBeforePay = () => {
    const {hasReload} = this.$router.params;
    if(`${hasReload}`==='1'){
      const {payInfo, backUrl} = this.getPayInfo();
      if(payInfo.appId){
        Utils.WX.launchPay({
          payInfo,
          callback: (res) => {
            // get_brand_wcpay_request:fail
            // get_brand_wcpay_request:cancel
            this.logger({
              logs: `已经成功唤起微信支付,微信支付返回结果:${JSON.stringify(res)}`
            });
            // 支付成功
            if(res.err_msg === "get_brand_wcpay_request:ok"){
              backUrl && Taro.navigateTo({url: backUrl});
            } else {
              backUrl && Taro.navigateTo({url: backUrl.indexOf('?')>0 ? `${backUrl}&ret=2` : `${backUrl}?ret=2` });
            }
          }
        });
      }else{
        this.logger({
          logs: `就在将要唤起微信支付时却发现appId没有,具体payInfo数据:${JSON.stringify(payInfo)}`
        });
        this.setState({notFoundPayInfo: true});
      }
    }else{
      globalThis.location.hash += '?hasReload=1';
      globalThis.location.reload();
    }
  }

  render() {
    const {notFoundPayInfo} = this.state;
    return (
      <View className={styles.pay_page}>
        {
          notFoundPayInfo ? <Button onClick={this.onGoBack}>返回重新支付</Button> : <Text />
        }
      </View>
    )
  }
}

export default LaunchPay;