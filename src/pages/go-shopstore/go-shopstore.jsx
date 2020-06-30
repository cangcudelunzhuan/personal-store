/**
 * @Author: 福虎
 * @Email: tanshenghu@163.com
 * @Update: 2020-04-14 15:13:03
 * @Description: 进入我的让铺中间页面
 */
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { Common, $ajax, message } from '@jxkang/wechat-utils'
import withPage from '@/components/with-page';
import Model from '@/model';
import Utils from '@/utils';
import Assets from '@/components/assets';
import styles from './go-shopstore.module.styl';


@withPage
class GoShopStore extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '进入我的店铺',
    }

    this.state = {
      detail: {},
    };
  }

  componentDidMount(){
    this.getDetail();
  }

  /**
   * 取店铺详情信息
   */
  getDetail = () => {
    Model.login.shopInfo().then(resModel => {
      if (resModel) {
        this.setState({
          detail: resModel,
        })
      }
    })
  }

  /**
   * 跳个人店h5界面
   */
  onGotoCh5 = () => {
    const { detail } = this.state;
    const host = process.env.NODE_ENV === 'production' ? 'https://shop.kangxiaopu.com' : 'https://daily-shop.kangxiaopu.com'
    window.location.href = `${host}/#/pages/index/index?companyId=${detail.companyId}`;
  }

  render() {
    const { detail } = this.state;
    const { globalStore } = this.props;
    const { userInfo } = globalStore.data;
    const codeUrl = `${Model.shopInfo.getWechatQrCode()}?companyId=${userInfo.companyId}`;

    return (
      <View className={styles.container}>
        <View className={styles.main_box}>
          <View>
            <Image
              className={`${styles.top_img} no-loading`}
              src={Assets.home.shopHeaderImg}
              mode="widthFix"
            />
          </View>
          <View className={styles.user_box}>
            <Image className={styles.store_img} src={Utils.getFileUrl(detail.logo || Assets.register.logo)} />
            <View className={styles.shop_name}>
              <Text>{detail.shopName}</Text>
              <Image className={`${styles.shop_name_icon} no-loading`} src={Assets.home.shopNameIcon} />
            </View>
          </View>
          <View className={styles.wx_code_box}>
            <Image className={styles.wechat_Qrcode} src={codeUrl} mode="widthFix" />
            <View className={styles.touch_tip}>微信长按识别打开查看</View>
          </View>
        </View>
        <View className={styles.fbox}>
          <View className={styles.goto_ch5} onClick={this.onGotoCh5}>
            <Text className={`iconfont iconweixindenglu ${styles.wx_icon}`} />
            通过微信浏览器打开
          </View>
        </View>
      </View >
    );
  }

}

export default GoShopStore;
