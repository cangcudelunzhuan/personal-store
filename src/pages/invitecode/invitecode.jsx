/**
 * @Author: chunxiao.zhang
 * @Email: chunxiao.zhang@jdxiaokang.com
 * @Update: 2020-03-05 18:54:32
 * @Description: 邀请码
 */
import Taro from '@tarojs/taro';
import { View, Image, Input, Text } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model, { getFetchHeader } from '@/model';
import Assets from '@/components/assets';
import utils, { navigateToLogin } from '@/utils'
import { $ajax, message } from '@jxkang/wechat-utils';
import styles from './invitecode.module.styl';



@withPage
class Invitecode extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '康小铺邀请码',
    }

    this.state = {
      // 界面/组件 初始数据
      mark: '',
      canBind: true,
      shopinfo: {}
    };
  }

  bind = ({ type = 2 }) => {
    const { mark } = this.state
    // const codeR = decodeURIComponent(this.$router.params.mark) || ''
    const phone = this.$router.params.phone || ''
    const m = mark
    if (!m || m === 'undefined') {
      message.error('请填写邀请码')
      return false
    }
    Model.login.bindCompanyShop({
      invitationCode: type === 2 ? m : ''
    }).then((data) => {
      if (data) {
        const { isFree = 3 } = this.$router.params
        Taro.navigateTo({
          url: `/pages/enter/enter?phone=${phone}&isFree=${isFree}`
        })
      }
    })
  }

  goindex = () => {
    Taro.navigateTo({
      url: `/pages/stockmarket/stockmarket`
    })
  }

  getCode = (value) => {
    this.setState({
      mark: value.detail.value,
      canBind: false,
      shopinfo: {}
    })
    if (value.detail.value) {
      this.getInviterInfo(value.detail.value)
    } else {
      this.setState({
        canBind: true
      })
    }

  }

  getInviterInfo = (invitationCode) => {
    Model.login.getInviterInfo({
      invitationCode,
    }).then(data => {
      if (data) {
        this.setState({
          shopinfo: data,
          canBind: true
        })
      } else {
        this.setState({
          shopinfo: {},
          canBind: false
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
        utils.bridge.callhandler('exit', {});
        navigateToLogin({
          desc: '[system] file:enter.jsx line:175'
        });
      }
    })
  }

  componentWillReact() { }

  componentDidMount() {
    const mark = decodeURIComponent(this.$router.params.mark) || ''
    if (mark && mark !== 'undefined') {
      this.setState({
        mark
      }, () => this.getInviterInfo(mark))
    } else {
      this.setState({
        canBind: true
      })
    }
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { shopinfo, canBind, mark, isFree } = this.state;

    return (
      <View>
        <View className={styles.invite_box}>
          <View className={styles.info_box}>
            <Text className={styles.invite_code}>填写邀请码（必填）</Text>
            <Input className={styles.info_insert} onBlur={this.getCode} value={mark}></Input>
          </View>
          <View className={styles.mes}>无邀请码时可联系平台获取，联系电话：0571-88670307</View>
          {
            canBind && mark &&
            (<View className={styles.invite}>
              {shopinfo.icon && <View className={styles.invite_img}>
                <Image src={utils.getFileUrl(shopinfo.icon)} className={styles.shopimg}></Image>
              </View>}
              {!shopinfo.icon && <View className={`iconfont ${styles.photo_icon}`}>&#xe691;</View>}
              <View className={styles.invite_info}>
                <View>{shopinfo.inviterName}</View>
                <View className={styles.invite_show_code}>邀请码：{shopinfo.invitationCode}</View>
              </View>
            </View>)
          }
          {canBind && <View className={styles.btn_bind} onClick={() => this.bind({})}>立即绑定</View>}
          {!canBind && <View className={`${styles.btn_bind} ${styles.btn_gray}`} >立即绑定</View>}
          {/* {!this.$router.params.mark && <View className={styles.go} onClick={() => this.bind({ type: 1 })}>跳过</View>} */}
          <View className={styles.go} onClick={this.loginOut}>退出</View>
        </View>
      </View >
    );
  }

}

export default Invitecode;
