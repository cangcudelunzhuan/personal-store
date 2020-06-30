
import Taro from '@tarojs/taro';
import { View, Input, Image } from '@tarojs/components';
import withPage from '@/components/with-page';
import { AtModal, AtModalHeader, AtModalContent } from "taro-ui";
import { message } from '@jxkang/wechat-utils';
import Model from '@/model';
import Config from '@/config';
import Assets from '@/components/assets';
import styles from './storegrade.module.styl';
import Shopinfo from '@/components/open-process-title'
import Utils from '@/utils';
import Store from '@/store';
import Pre from './pre';

@withPage
class Storegrade extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '店铺会员信息设置',
    }

    this.state = {
      // 界面/组件 初始数据
      directCommission: 0.56,
      indirectCommission: 0.5,
      indirectNum: 2,
      upgradeAmount: 100,
      shopId: '',
      rate1: '',
      rate2: '',
      num1: '',
      num2: '',
      moVisible: false,
      surplusModifyNum: 4,
    };
  }
  getInput = (e, name, type = 'rate') => {
    const { value } = e.detail
    const v = this.getNum(value, type)
    this.setState({
      [name]: v,
      moVisible: false
    })
  }
  // getRate = (value, type) => {
  //   if (type !== 'rate') {
  //     let s = value.replace(/[^\d]/g, '') //去除数字以外
  //     s = s > 9999 ? 9999 : s
  //     return s ? `${s}人` : ''
  //   } else {
  //     let s = value.replace(/[^\d.]/g, '') //去除小数点和数字以外
  //     s = s.replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".") //只留一个小数点
  //     s = s.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') //最多两位小数
  //     s = s > 50 ? 50 : s
  //     return s ? `${s}%` : ''
  //   }
  // }
  getNum = (value, type) => {
    let s = value.replace(/[^\d]/g, '') //去除数字以外
    // s = Number(s)
    if (type !== 'rate') {
      s = s > 9999 ? 9999 : s
      return s ? `${Number(s)}人` : ''
    } else {
      s = s > 100 ? 100 : s
      return s ? `${Number(s)}%` : ''
    }
  }


  goNext = () => {
    let { shopId, num1, num2, rate1, rate2 } = this.state
    num1 = Number(num1.replace(/[^\d.]/g, ''))
    num2 = Number(num2.replace(/[^\d.]/g, ''))
    rate1 = Number(rate1.replace(/[^\d.]/g, ''))
    rate2 = Number(rate2.replace(/[^\d.]/g, ''))
    if (num1 >= num2) {
      message.error('钻石会员人数必须大于黄金')
      return
    } else if (rate1 >= rate2) {
      message.error('钻石会员返佣必须大于黄金')
      return
    }
    let shopMemberDisposeParamList = [
      {
        commissionRate: 0,
        invitationNum: 0,
        levelName: '白银',
        levelNum: 1,
        shopId
      },
      {
        commissionRate: rate1,
        invitationNum: num1,
        levelName: '黄金',
        levelNum: 2,
        shopId
      },
      {
        commissionRate: rate2,
        invitationNum: num2,
        levelName: '钻石',
        levelNum: 3,
        shopId
      }
    ]
    Model.shopInfo.addDispose(shopMemberDisposeParamList).then(res => {
      if (res) {
        const { type } = this.$router.params
        if (type === 'edit') {
          if (Config.runEnv === 'android' || Config.runEnv === 'ios') {
            Utils.bridge.callhandler('goMain', {});
          } else {
            Taro.navigateTo({
              url: `/pages/shopworker/shopworker`
            })
          }
        } else {
          Taro.navigateTo({
            url: `/pages/cometo-admin/cometo-admin`
          })
        }
      }
    })
  }
  noSetDispose = () => {
    Model.shopInfo.noSetDispose().then(res => {
      if (res) {
        Taro.navigateTo({
          url: `/pages/cometo-admin/cometo-admin`
        })
      }
    })
  }
  getInfo = () => {
    const { globalStore } = Store
    const { shopId } = globalStore.data.userInfo
    if (shopId) {
      this.setState({
        shopId
      }, () => this.shopMemberConfigDetail(shopId))
    } else {
      Model.login.shopInfo().then(res => {
        if (res) {
          this.setState({
            shopId: res.id
          }, () => this.shopMemberConfigDetail(res.id))
        }
      })
    }
  }
  shopMemberConfigDetail = (shopId) => {
    Model.shopInfo.shopMemberDetail({ shopId }).then(res => {
      if (res) {
        (res.list || []).map(item => {
          if (item.levelNum === 2) {
            res.rate1 = `${item.commissionRate}%`
            res.num1 = `${item.invitationNum}人`
          }
          if (item.levelNum === 3) {
            res.rate2 = `${item.commissionRate}%`
            res.num2 = `${item.invitationNum}人`
          }
        })
        this.setState({
          ...res
        })
      }
    })
  }
  scroll = () => {
    window.scroll(0, 0)
  }



  componentWillReact() { }

  componentDidMount() {
    this.getInfo()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { rate1, rate2, num1, num2, moVisible, surplusModifyNum } = this.state;
    const { type } = this.$router.params
    return (
      <View className={styles.out}>
        <View className={styles.back}></View>
        {type !== 'edit' && <Shopinfo></Shopinfo>}
        <View className={styles.item_box}>
          <View className={styles.i_title}>会员等级</View>
          <View className={styles.item_content}>
            <View className={styles.item_line}>
              <View className={styles.left}>
                <Image src={Assets.common.baiyin} className={`${styles.img} no-loading`}></Image>
                <View>白银会员</View>
              </View>
              <View className={styles.right}>
                <View>注册后即为白银会员</View>
              </View>
            </View>
            <View className={styles.item_line}>
              <View className={styles.left}>
                <Image src={Assets.common.huangjin} className={`${styles.img} no-loading`}></Image>
                <View>黄金会员</View>
              </View>
              <View className={`${styles.right} ${styles.person}`}>
                {/* <View>需邀请满</View> */}
                <Input type='text' placeholder='请输入需邀请满/人'
                  value={num1}
                  onBlur={this.scroll}
                  className={styles.input_wrap} onInput={(e) => this.getInput(e, 'num1', 'num')}></Input>
              </View>
            </View>
            <View className={styles.item_line}>
              <View className={styles.left}>
                <Image src={Assets.common.zuanshi} className={`${styles.img} no-loading`}></Image>
                <View>钻石会员</View>
              </View>
              <View className={`${styles.right} ${styles.person}`}>
                {/* <View>需邀请满</View> */}
                <Input type='text' placeholder='请输入需邀请满/人'
                  value={num2}
                  onBlur={this.scroll}
                  className={styles.input_wrap} onInput={(e) => this.getInput(e, 'num2', 'num')}></Input>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.item_box}>
          <View className={styles.i_title}>分享返佣比例</View>
          <View className={styles.item_content}>

            <View className={styles.item_line}>
              <View className={styles.left}>
                <View>白银会员</View>
              </View>
              <View className={styles.right}>
                <View>可邀请用户，无返佣</View>
              </View>
            </View>

            <View className={styles.item_line}>
              <View className={styles.left}>
                <View>黄金会员分享成单获得</View>
              </View>
              <View className={`${styles.right} ${styles.rate}`}>
                <Input type='text' placeholder='请输入%加价利润'
                  value={rate1}
                  onBlur={this.scroll}
                  className={styles.input_wrap} onInput={(e) => this.getInput(e, 'rate1')}></Input>
              </View>
            </View>

            <View className={styles.item_line}>
              <View className={styles.left}>
                <View>钻石会员分享成单获得</View>
              </View>
              <View className={`${styles.right} ${styles.rate}`}>
                <Input type='text' placeholder='请输入%加价利润'
                  value={rate2}
                  onBlur={this.scroll}
                  className={styles.input_wrap} onInput={(e) => this.getInput(e, 'rate2')}></Input>
              </View>
            </View>
            <View className={styles.guiz} onClick={() => { this.setState({ moVisible: true }) }}>查看详细佣规则</View>
          </View>
        </View>

        <View className={styles.edit_count}>本月还可修改{surplusModifyNum}次</View>

        <View className={styles.confirm_style}>
          {type !== 'edit' && <View className={`${styles.white_button} ${styles.confirm_btn}`} onClick={this.noSetDispose}>暂不设置</View>}
          {num1 && num2 && rate1 && rate2 && surplusModifyNum > 0 && < View className={styles.confirm_btn} onClick={this.goNext}>确定</View>}
          {(!num1 || !num2 || !rate1 || !rate2 || surplusModifyNum <= 0) && <View className={`${styles.confirm_btn} ${styles.confirm_btn_gray}`}>确定</View>}
        </View>

        <AtModal isOpened={moVisible}>
          <AtModalHeader>会员分佣规则</AtModalHeader>
          <AtModalContent>
            <Pre></Pre>
          </AtModalContent>
        </AtModal>
      </View >

    );
  }

}

export default Storegrade;
