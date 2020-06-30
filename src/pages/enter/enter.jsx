import Taro from '@tarojs/taro';
import { View, Input, Text } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent } from "taro-ui"
import withPage from '@/components/with-page';
import Model, { getFetchHeader } from '@/model';
import Config from '@/config';
import { $ajax, message } from '@jxkang/wechat-utils';
import styles from './enter.module.styl';
import Store from '@/store';
import Utils, { WX, navigateToLogin, orderPay, delay } from '@/utils';
import Pre from './pre';

@withPage
class Enter extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '申请入驻',
    }

    this.state = {
      // 界面/组件 初始数据
      shopName: '',
      phone: '',
      contacts: '',
      canNext: false,
      agree: false,
      moVisible: false
    };

    delay(
      this,
      ['applyShop']
    );
  }

  onChange = (e, name) => {
    // 去掉转义字符
    let s = e.target.value//.replace(/[&\|\\\*^%$#@.?~!(),\-]/g, "")
    if (name === 'phone') {
      const tp = /(^([0-9]{3,4}-)?[0-9]{7,8}$)|(^((\(\d{3}\))|(\d{3}\-))?(1\d{10})$)/
      this.setState({
        canNext: tp.test(e.target.value)
      })
    } else if (name === 'shopName') {
      s = s.replace(/[^\a-zA-Z\u4E00-\u9FA5\d]/g, '')
    }
    else {
      s = s.replace(/[^\a-zA-Z\u4E00-\u9FA5]/g, '')
    }
    this.setState({
      [name]: s,
      moVisible: false
    })
  }

  applyShop = (type) => {
    const { shopName, phone, contacts, agree } = this.state;
    if (agree === false) {
      message.error('请勾选同意服务协议')
      return
    }
    const p = type === 1 ?
      Model.login.applyShop({
        shopName, phone, contacts,
      }) :
      Model.login.freeApplyShop({
        shopName, phone, contacts,
      })
    p.then(res => {
      if (res) {
        if (type === 1) {
          const { globalStore } = Store
          const { userInfo } = globalStore.data
          userInfo.companyId = res.companyId
          userInfo.companyName = res.shopName
          userInfo.shopName = res.shopName
          userInfo.shopId = res.id
          globalStore.setData('userInfo', userInfo);
          Utils.bridge.callhandler('setUserinfo', userInfo);
          this.setorder({
            invitationCompanyId: res.invitationCompanyId,
            invitationUserId: res.invitationUserId,
            companyId: res.companyId,
            invitationCompanyRole: res.invitationPlatformRole,
          })
        } else {
          Taro.navigateTo({
            url: '/pages/pay-result/pay-result'
          });
        }
      }
    })
  }

  setorder = ({ invitationCompanyId, companyId, invitationCompanyRole }) => {
    // const { userId } = this.$router.params

    const { shopName, phone, contacts } = this.state;

    const { openId } = Store.globalStore.data.envUserInfo
    // 没有openId时，需要再次重新授权
    if (process.env.NODE_ENV === 'production' && !openId && Config.runEnv !== 'android' && Config.runEnv !== 'ios') {
      Taro.setStorageSync('authoBackUrl', document.URL);
      this.logger({
        logs: '个人店H5开店支付下单,没有openId重新授权',
      });
      WX.authorize();
      return false
    }
    const params = {
      settledCompanyId: companyId,
      connectionName: contacts,
      phoneNumber: phone,
      invitationCompanyId,
      shopName,
      invitationCompanyRole,
      bizType: 1
    }
    // 创建订单
    Model.login.createOrder(params).then(res => {
      if (res) {
        this.logger({
          logs: '个人店H5开店,创建订单成功',
          api_url: Model.login.createOrder.toString(),
          api_req: JSON.stringify(params),
          api_res: JSON.stringify(res)
        });
        if (Config.runEnv === 'android' || Config.runEnv === 'ios') { //ios、安卓交互
          Utils.bridge.callhandler('getOrderId', { orderId: res });
        } else {
          orderPay.Opay(this, res);
        }

      }
    })
  }

  getAgree = () => {
    const { agree } = this.state
    this.setState({
      agree: !agree,
      moVisible: false
    })
  }

  openXy = (e) => {
    e.stopPropagation()
    this.setState({
      moVisible: true
    })
  }

  getInfo = () => {
    const { phone } = this.$router.params
    Model.login.shopInfo().then(res => {
      // res.accountOpenProcess = 2
      if (res) {
        this.setState({
          ...res,
        })
      }
      else {
        this.setState({
          phone
        })
      }
    })
  }

  loginOut = () => {
    const { globalStore } = this.props
    Model.login.logout().then(res => {
      if (res) {
        Taro.removeStorageSync('userInfo')
        $ajax.uninjectHeaders();
        $ajax.injectHeaders(getFetchHeader(true));
        globalStore.setData('userInfo', {});
        Utils.bridge.callhandler('exit', {});
        navigateToLogin({
          desc: '[system] file:enter.jsx line:175'
        });
      }
    })
  }

  componentWillReact() { }

  componentDidMount() {

    /*
    Model.common.getPayAmount({bizType: 1}).then(resModel => {
      if(typeof resModel === 'number'){
        Config.costAmount = resModel < 100 ? resModel : `${resModel}/年`;
        this.setState({});
      }
    });
    */
    const { isFree = 3 } = this.$router.params //是否续费 1否 2是 3全部显示
    this.setState({
      isFree: Number(isFree)
    })
    this.getInfo();

    Utils.bridge.registerhandler('paysuccess', (data) => {
      Taro.navigateTo({
        url: '/pages/pay-result/pay-result'
      })
    });

  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { shopName, phone, contacts, canNext, agree, moVisible, isFree } = this.state;
    const isPhone = /^1\d{10}$/

    return (
      <View className={styles.container}>
        {/**
         * 支付信息
         */}
        <View className={styles.store_info}>
          <View className={styles.title}>填写店铺信息</View>
          <View className={`${styles.list} `}>
            <Text className={styles.symbol}>*</Text>
            <Text className={styles.store_title}>店铺名称</Text>
            <View>
              <Input type='text'
                placeholder='店铺名称' value={shopName}
                className={styles.store_insert}
                maxLength={30}
                onInput={(e) => this.onChange(e, 'shopName')}></Input>
            </View>
          </View>
          <View className={`${styles.list} `}>
            <Text className={styles.symbol}>*</Text>
            <Text className={styles.store_title}>联系人</Text>
            <View>
              <Input type='text'
                value={contacts}
                placeholder='联系人'
                maxLength={10}
                onInput={(e) => this.onChange(e, 'contacts')}
                className={styles.store_insert}
              ></Input>
            </View>
          </View>
          <View className={`${styles.list} `}>
            <Text className={styles.symbol}>*</Text>
            <Text className={styles.store_title}>联系电话</Text>
            <View>
              <Input type='number' placeholder='联系电话'
                className={styles.store_insert}
                onInput={(e) => this.onChange(e, 'phone')}
                maxLength={11}
                value={phone}>
              </Input>
            </View>
          </View>
        </View>
        <View className={styles.store_info}>
          <View className={styles.title}>支付入驻费</View>
          <View className={`${styles.list}  ${styles.aign}`}>
            <Text className={styles.store_title}>缴纳入驻费</Text>
            <View>￥{Config.costAmount}</View>
          </View>
          <View className={`${styles.list}  ${styles.aign}`}>
            <Text className={styles.store_title}>微信</Text>
            <View className={`iconfont  ${styles.icon}`}>&#xe6af;</View>
          </View>
        </View>
        {/**
         * 底部支付信息
         */}
        <View className={styles.bug_info} >
          <View className={styles.checkline} onClick={this.getAgree}>
            {agree === true && <Text className={`iconfont ${styles.unagree} ${styles.active}`}>&#xe628;</Text>}
            {agree === false && <Text className={styles.nocheck}></Text>}
            <Text>我已同意</Text>
            <Text className={styles.red_text} onClick={(e) => this.openXy(e)} >《康小铺开店服务协议》</Text>
          </View>
          <View className={styles.tel}>遇到问题？请联系客服电话：0571-88670307</View>
          {(isFree === 2 || isFree === 3) && (
            <View className={styles.item_btn}>
              {isPhone.test(phone) && shopName && contacts && <View className={`${styles.buy_btn} ${styles._white_btn}`} onClick={() => this.applyShop(2)}>免费试用</View>}
              {(!isPhone.test(phone) || !shopName || !contacts) && <View className={`${styles.buy_btn} ${styles.buy_btn_gray}`} >免费试用</View>}
            </View>
          )
          }
          {/* {(isFree === 1 || isFree === 3) && (
            <View className={styles.item_btn}>
              {isPhone.test(phone) && shopName && contacts && <View className={styles.buy_btn} onClick={() => this.applyShop(1)}>入驻缴费</View>}
              {(!isPhone.test(phone) || !shopName || !contacts) && <View className={`${styles.buy_btn} ${styles.buy_btn_gray}`} >入驻缴费</View>}
            </View>
          )} */}
          <View className={styles.login_out} onClick={this.loginOut}>退出</View>
        </View>
        <AtModal isOpened={moVisible}>
          <AtModalHeader>店铺入驻协议</AtModalHeader>
          <AtModalContent>
            <Pre></Pre>
          </AtModalContent>
        </AtModal>
      </View >
    );
  }

}

export default Enter;
