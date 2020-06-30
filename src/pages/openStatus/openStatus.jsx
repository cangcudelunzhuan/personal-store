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
import styles from './openStatus.module.styl';
import { AtIcon, AtDivider } from 'taro-ui'
import Utils from '@/utils';


@withPage
class PayResult extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '支付结果',
    }

    this.state = {
      // 界面/组件 初始数据
      goodsList: []
    };
  }

  componentDidMount() {
    // this.getGoodsList();
  }

  // getGoodsList = () => {
  //   const { globalStore } = this.props;
  //   const cacheCompanyId = globalStore.data.userInfo.companyId;
  //   const { companyId = cacheCompanyId } = this.$router.params;

  //   Model.goods.getRecomdList({ "agentCompanyId": companyId }).then(resModel => {
  //     if (resModel) {
  //       this.setState({
  //         goodsList: resModel
  //       });
  //     }
  //   });
  // }

  onViewOrder = () => {
    // const { orderNo } = this.$router.params;

  }

  onKeep = () => {
    Taro.navigateTo({
      url: '/pages/shopworker/shopworker'
    });
  }

  goDetail = (v) => {
    const { globalStore } = this.props;
    const cacheCompanyId = globalStore.data.userInfo.companyId;
    const { companyId = cacheCompanyId } = this.$router.params;

    Taro.navigateTo({
      url: `/pages/goodsdetail/goodsdetail?agentItemId=${v.id}&itemId=${v.itemId}&companyId=${companyId}`
    });
  }
  goPay = () => {
    Taro.navigateBack(-1)
  }

  render() {
    const { goodsList } = this.state;
    const { ret = '1' } = this.$router.params;

    return (
      <View className={styles.content}>
        {/* 成功 */}
        <View className={styles.pay_success}>
          <View className={styles.icont_box}>
            <View>
              <Image className={styles.ret_icon} src={Assets.other.success} />
            </View>
          </View>
          <View className={styles.status}>恭喜您，开店成功了！</View>
          <View className={styles.button_box}>
            <View className={`${styles.button} ${styles.left_button}`} onClick={this.onViewOrder}>开启店铺</View>
          </View>
        </View>

        <View className={styles.notice_mes}>
          提示：下载康小铺店主端APP?使用体验更佳哦
        </View>

        <View className={styles.bot_shoper}>
          <Image className={styles.bot_img} src={Assets.other.storePer}></Image>
        </View>

        <View className={styles.hrefdowload}>
          <View className={styles.downoutbutton}>
            <View className={styles.downbutton}>
              <Image className={styles.downImg} src={Assets.home.downIcon}></Image>
              <View className={styles.downText}>前往下载</View>
            </View>
          </View>
        </View>
      </View >
    );
  }

}

export default PayResult;
