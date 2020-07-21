import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text, Image } from '@tarojs/components';
import withPage from '@/components/with-page';
import Utils from '@/utils';
import Model from '@/model';
import Empty from '@/components/empty';
import styles from './liblist.module.styl';
import Assets from '@/components/assets';
import ListView from 'taro-listview';

const { formatDateTime } = Utils;

@withPage
class LibList extends Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '云仓店铺',
    }

    this.state = {
      teamData: '',
      pageIndex: 1,
      hasMore: true,
      isEmpty: false,
      isLoaded: false,
      shopList: [],
      selectStyle: 1,
    }

  }

  goNextPage = (item) => {
    console.log('item', item)
    Taro.navigateTo({
      url: `/pages/liblistDetail/liblistDetail?companyId=${item.companyId}&memberRole=${item.role}`
    })
  }


  componentDidShow() {

  }

  componentDidMount() {
    this.cloudTeamInfo();
    this.cloudTeamMember({});
  }


  componentDidHide() {

  }

  cloudTeamInfo = () => {
    Model.yuncang.cloudTeamInfo().then(res => {
      if (!res) return false;
      this.setState({
        teamData: res
      })
    })
  }

  insRef = (node) => {
    this.refList = node;
  };


  onScrollToLower = (fn) => {
    console.log(11111);
    this.state.pageIndex += 1;
    this.cloudTeamMember({ pageNum: this.state.pageIndex, callBack: fn });
  };

  cloudTeamMember = ({ pageNum = 1, pageSize = 10, direct = '', callBack }) => {
    const { shopList } = this.state;
    const currentData = {
      direct: direct,
      pageNum,
      pageSize,
    }
    Model.yuncang.cloudTeamMember(currentData).then(res => {
      if (!res) return false;
      console.log('resMes', res);
      this.setState({
        pageIndex: pageNum,
        hasMore: res.records.length >= pageSize,
        shopList: shopList.concat(res.records),
        isLoaded: true,
      }, () => {
        const { shopList } = this.state;
        if (shopList.length !== 0) {

          this.setState({
            isEmpty: false,
          })
        } else {

          this.setState({
            isEmpty: true,
          })
        }
        if (callBack) {
          callBack()
        }
      })

    })
  }

  clickItem = (selectStyle) => {
    this.setState({
      selectStyle: selectStyle,
      shopList: [],
    }, () => {
      this.cloudTeamMember({ direct: selectStyle == 1 ? '' : true })
    })

  }

  render() {
    const { globalStore: { data: { systemInfo } } } = this.props;
    const { teamData, isLoaded, hasMore, isEmpty, shopList, selectStyle } = this.state;
    const screenHeight = systemInfo.windowHeight - 106;
    return (
      <View className={styles.pay_page} style={{ background: '#F7F8FA' }}>
        <View className={styles.libTop}>
          <View className={styles.libPosition}>
            <View className={styles.libinner}>
              <View className={styles.lib_eve_mes}>
                <View className={styles.moneyNum}>{teamData.shopNum || 0}</View>
                <View className={styles.moneyText}>总店铺数(个)</View>
              </View>
              <View className={styles.lib_eve_mes}>
                <View className={styles.moneyNum}>{teamData.consumerNum || 0}</View>
                <View className={styles.moneyText}>总会员数(个)</View>
              </View>
              <View className={styles.lib_eve_mes}>
                <View className={styles.allMoney_num}>{teamData.tradeSum || 0}</View>
                <View className={styles.moneyText}>总交易额(元)</View>
              </View>
            </View>
          </View>
        </View>

        <View className={`${styles.libBot} ${styles.flexItem}`}>
          <View className={styles.mystyle}>成员列表</View>
          <View className={`${styles.mybotstyle} ${styles.flexItem}`}>
            <View className={`${styles.myAll} ${styles.flexItem} ${selectStyle == 1 ? styles.btnBackground : ''}`} onClick={() => { this.clickItem(1) }}>全部</View>
            <View className={`${styles.myJoin} ${styles.flexItem} ${selectStyle == 2 ? styles.btnBackground : ''}`} onClick={() => { this.clickItem(2) }}>我邀请的</View>
          </View>
        </View>
        {console.log('========', hasMore)}
        <ListView
          ref={node => this.scrollV = node}
          // ref={node => this.insRef(node)}
          isLoaded={isLoaded}
          hasMore={hasMore}
          style={{ height: screenHeight }}
          // style={{ height: '300px' }}
          isEmpty={isEmpty}
          onPullDownRefresh={this.pullDownRefresh}
          onScrollToLower={this.onScrollToLower}
          launch={{
            launchEmpty: true
          }}
          renderEmpty={
            <View className={styles.empty_box}><Empty /></View>
          }
        >
          {(shopList || []).map((v, index) => {
            return (
              <View className={styles.eve_style} onClick={() => this.goNextPage(v)}>
                <View className={styles.eve_inner}>
                  <View className={styles.eve_inner_top}>
                    <View className={styles.eve_left}>
                      <Image className={`${styles.eve_Image} no-loading`} src={v.icon ? Utils.getFileUrl(v.icon) : Assets.register.logo}></Image>
                    </View>
                    <View className={styles.eve_right}>
                      <View>
                        <View className={styles.top_img}>
                          <Text className={styles.fontStyle}>{v.inviteeName}</Text>
                          {v.direct ? <Text className={styles.myShop}>我的云仓店</Text> : ''}
                        </View>
                        <View className={styles.bot_img}>
                          <Text className={styles.phoneStyle}>{v.phone}</Text>
                          <Text style={{ margin: '0 10px' }}>|</Text>
                          <Text className={styles.timeStyle}>{formatDateTime(v.invitationTime)}</Text>
                        </View>
                      </View>
                      <View className={styles.navigateMes}>
                        <Image className='no-loading' style={{ width: '32px', height: '32px' }} src={`${Assets.yuncang.navigate}`}></Image>
                      </View>
                    </View>
                  </View>
                  <View className={styles.eve_inner_bot}>
                    <View className={styles.eve_inner_mes}>
                      <Image style={{ width: '32px', height: '32px' }} src={Assets.yuncang.allMoney}></Image>
                      <Text className={styles.font_top_Style}>累计盈利(元)：</Text>
                      <Text className={styles.font_bot_Style}>{v.income}</Text>
                    </View>
                    {v.inviterName ? <Text className={styles.regMes}>{v.inviterName}邀请</Text> : ''}
                  </View>
                </View>
              </View>
            )
          })}

        </ListView>
      </View >
    )
  }
}

export default LibList;