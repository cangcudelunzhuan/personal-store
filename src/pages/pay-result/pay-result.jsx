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
import Config from '@/config';
import Assets from '@/components/assets';
import styles from './pay-result.module.styl';
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
    
  }

  onViewOrder = () => {
    // const { orderNo } = this.$router.params;
    Taro.navigateTo({
      url: `/pages/bankcard/bankcard`
    });
  }

  hrefTopay = () => {
    window.location.href = 'https://jxkcdn.jingxiaokang.com/assets/html/app_setup.html'
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

  /**
   * 发布自营商品
   */
  onPublish = () => {
    Utils.bridge.callhandler('releasegood');
    Utils.bridge.callhandler('finish');
  }

  /**
   * 返回工作台
   */
  onGoback = () => {
    Taro.navigateTo({
      url: '/pages/shopworker/shopworker'
    });
    Utils.bridge.callhandler('goWorkTab');
  }

  render() {
    const { goodsList } = this.state;
    const { ret = '1', from } = this.$router.params;

    return (
      <View className={styles.content}>
        {/* 成功 */}
        {
          ret != '2' ?
            <View className={styles.pay_success}>
              <View className={styles.icont_box}>
                <View>
                  <Image className={styles.ret_icon} src={Assets.other.success} />
                </View>
              </View>
              <View className={styles.status}>恭喜您，支付成功！</View>
              <View className={styles.button_box}>
                {
                  from === 'bond' ? <View>
                    <View className={styles.button2} onClick={this.onPublish}>发布商品</View>
                    <View className={`${styles.button} ml20`} onClick={this.onGoback}>返回个人中心</View>
                  </View> : <View className={styles.button} onClick={this.onViewOrder}>开启店铺</View>
                }
              </View>
              {Config.runEnv !== 'android' && Config.runEnv !== 'ios' && <View>
                <View className={styles.notice_mes}>
                  提示：下载康小铺店主端APP?使用体验更佳哦
              </View>

                <View className={styles.bot_shoper}>
                  <Image className={`${styles.bot_img} no-loading`} src={Assets.other.storePer}></Image>
                </View>

                <View className={styles.hrefdowload}>
                  <View className={styles.downoutbutton} onClick={this.hrefTopay}>
                    <View className={styles.downbutton}>
                      <Image className={`${styles.downImg} no-loading`} src={Assets.home.downIcon}></Image>
                      <View className={styles.downText}>前往下载</View>
                    </View>
                  </View>
                </View>
              </View>}
            </View>
            : // 失败情况
            <View className={`${styles.pay_success} ${styles.pay_false}`}>
              <View className={styles.icont_box}>
                <Image className={styles.ret_icon} src={Assets.other.failed} />
              </View>
              <View className={styles.status}>支付失败</View>
              <View className={styles.gray}>请重新发起支付</View>
              <View className={styles.button_box}>
                <View className={`${styles.button} ${styles.right_button}`} onClick={this.goPay}>重新支付</View>
              </View>
            </View>
        }
        {/* <View className={styles.tj_out}>
          <AtDivider content='为你推荐' fontColor='#333' lineColor='#F7F7F7' fontSize="28px" />
          <View className={styles.tuijian_box}>
            {goodsList.map((item, idx) =>
              <View className={styles.item} key={idx + 1} onClick={() => this.goDetail(item)}>
                <Image className={styles.img} src={Utils.getFileUrl(item.mainImgUrl)} />
                <View className={styles.bottom}>
                  <View className={styles.title}>{item.itemTitle}</View>
                  <View className={styles.price_box}>
                    <Text>￥</Text>
                    <Text className={styles.num}>{item.minTradePrice || 0}</Text>
                  </View>
                  <View className={styles.tag}>包邮</View>
                </View>
              </View>
            )}
          </View>
        </View> */}
      </View >
    );
  }

}

export default PayResult;
