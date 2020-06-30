/**
 * @Author: qiang.zhang
 * @Email: 1196217890@qq.com
 * @Update: 2020-02-27 11:30:14
 * @Description: hello
 */
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Common } from '@jxkang/wechat-utils';
import withPage from '@/components/with-page';
import Assets from '@/components/assets';
import Model from '@/model';
import { imgshare } from '@/utils';
import PerCenter from './components/percenter'
import SelectShop from './components/selectshop'
import QrCode from './components/my-qrcode';
import styles from './shopworker.module.styl';

@withPage
class Shopworker extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '店铺工作台',
    }

    this.state = {
      tabInner: this.$router.params.tabInner || 1,
    };
  }

  componentWillReact() { }
  componentDidHide() { }
  componentDidMount() {

  }



  clicktabitem = (tabNum) => {
    if (tabNum === 3) {
      Model.shopInfo.companyCode().then(res => {
        if (res) {
          Taro.redirectTo({
            url: `/pages/shopworker/shopworker?tabInner=${tabNum}&mark=${res.invitationCode}`
          })
        }
      })
    } else {
      this.setState({
        tabInner: tabNum
      })
      imgshare.clearShareInfo();
    }

  }

  render() {
    const { tabInner } = this.state;
    const CurrentCmpt = Common.seek()
      .equal(tabInner == 1, <PerCenter />)
      .equal(tabInner == 2, <SelectShop />)
      .equal(tabInner == 3, () => <QrCode {...this.props} />)
      .else(() => null)
      .get()

    return (
      <View>
        <View className={styles.shopworker}>
          <CurrentCmpt />
        </View>
        <View className={styles.footerbar}>
          <View className={styles.tabinner}>
            <View className={styles.eveMes} onClick={() => this.clicktabitem(1)}>
              <Image className={`${styles.tab_icons} no-loading`} src={tabInner == 1 ? Assets.home.workerred : Assets.home.workergrey} alt="" />
              <View className={styles.recomshop}>工作台</View>
            </View>
            <View className={styles.eveMes} onClick={() => this.clicktabitem(2)}>
              <Image className={`${styles.tab_icons} no-loading`} src={tabInner == 2 ? Assets.home.businessred : Assets.home.bussinessgrey} alt="" />
              <View className={styles.recomshop}>选货市场</View>
            </View>
            <View className={styles.eveMes} onClick={() => this.clicktabitem(3)}>
              <Image className={`${styles.tab_icons} no-loading`} src={tabInner == 3 ? Assets.home.recommonred : Assets.home.recommongrey} alt="" />
              <View className={styles.recomshop}>推荐开店</View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Shopworker;
