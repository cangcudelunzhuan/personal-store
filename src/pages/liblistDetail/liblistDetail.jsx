import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text, Image } from '@tarojs/components';
import withPage from '@/components/with-page';
import Utils from '@/utils';
import styles from './liblistDetail.module.styl';
import Assets from '@/components/assets';
import Model from '@/model';

const { formatDateTime } = Utils;

@withPage
class LibListDetail extends Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '云仓店详情',
    }

    this.state = {
      shopDetail: '',
    }

  }

  componentDidMount() {
    this.getLibMes();
  }

  getLibMes = () => {
    console.log(this.$router.params)
    const { companyId, memberRole } = this.$router.params;

    const currentData = {
      memberCompanyId: companyId,
      memberRole,
    }
    Model.yuncang.cloudTeamMemberDetail(currentData).then(res => {
      console.log('detail', res);
      if (!res) return false;
      this.setState({
        shopDetail: res,
      })
    })
  }

  componentDidShow() {

  }

  render() {
    const { shopDetail } = this.state;
    return (
      <View className={styles.pay_page}>

        <View className={styles.eve_style}>
          <View className={styles.eve_inner}>
            <View className={styles.eve_inner_top}>
              <View className={styles.eve_left}>
                <Image className={`${styles.eve_Image} no-loading`} src={shopDetail.icon ? Utils.getFileUrl(shopDetail.icon) : Assets.register.logo}></Image>
              </View>
              <View className={styles.eve_right}>
                <View>
                  <View className={styles.top_img}>
                    <Text className={styles.fontStyle}>{shopDetail.inviteeName}</Text>
                    <Text className={styles.myShop}>我的云仓店</Text>
                  </View>
                  <View className={styles.bot_img}>
                    <Text className={styles.phoneStyle}>{shopDetail.phone}</Text>
                    <Text style={{ margin: '0 10px' }}>|</Text>
                    <Text className={styles.timeStyle}>{formatDateTime(shopDetail.invitationTime)}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View className={styles.eve_inner_bot}>
              <View className={styles.eve_inner_mes}>
                <Image style={{ width: '32px', height: '32px' }} src={Assets.yuncang.allMoney}></Image>
                <Text className={styles.font_top_Style}>累计盈利(元)：</Text>
                <Text className={styles.font_bot_Style}>{shopDetail.income}</Text>
              </View>
              {shopDetail.inviterName ? <Text className={styles.regMes}>{shopDetail.inviterName}</Text> : ''}
            </View>
          </View>
        </View>

        <View className={styles.navStyle}>
          <View className={`${styles.eve_nav_style} ${styles.border_bottom}`}>
            <View className={styles.eve_text}>会员数</View>
            <View className={styles.eve_text_num}>{shopDetail.consumerNum}</View>
          </View>

          <View className={`${styles.eve_nav_style}`}>
            <View className={styles.eve_text}>推店数</View>
            <View className={styles.eve_text}>{shopDetail.inviteeNum}</View>
          </View>

        </View>

        <View className={styles.navStyle}>
          <View className={`${styles.eve_nav_style} ${styles.border_bottom}`}>
            <View className={styles.eve_text}>累计营业额(元)</View>
            <View className={styles.eve_text_num}>{shopDetail.tradeSum}</View>
          </View>

          <View className={`${styles.eve_nav_style} ${styles.border_bottom}`}>
            <View className={styles.eve_text}>近30天营业额(元)</View>
            <View className={styles.eve_text_num}>{shopDetail.recentTradeSum}</View>
          </View>

          {/* <View className={`${styles.eve_nav_style}`}>
            <View className={styles.eve_text}>近30天利润(元)</View>
            <View className={styles.eve_text}>{shopDetail.recentProfitSum}</View>
          </View> */}

        </View>
      </View>
    )
  }
}

export default LibListDetail;