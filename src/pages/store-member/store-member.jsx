/**
 * @Author: limin.zhang
 * @Email: limin.zhang@jdxiaokang.com
 * @Update: 2020-03-05 15:15:23
 * @Description: 店铺会员
 */
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import ListView, { LazyBlock } from 'taro-listview';
import withPage from '@/components/with-page';
import { Common } from '@jxkang/wechat-utils';
import { getFileUrl, delay } from '@/utils';
import Model from '@/model';
import Assets from '@/components/assets';
import Empty from '@/components/empty';
import styles from './store-member.module.styl';


@withPage
class StoreMember extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '店铺会员',
    }

    this.state = {
      // 界面/组件 初始数据
      statisticsInfo: {},//店铺会员统计信息
      list: [],
      mumberList: [],
      info: {},
      screenHeight: '',
      isLoaded: true,
      error: false,
      hasMore: true,
      isEmpty: true,
      pageNum: 1
    };

    this.listStatus = false;

  }
  // 会员店铺统计
  getStatistics = () => {
    Model.store.getMemberStatistics().then(res => {
      if (res) {
        this.setState({
          info: res
        })
      }
    })
  }

  // 店铺列表
  getData = ({ pageNum = 1, pageSize = 9, callback }) => {
    Model.store.getMemberList({
      pageNum,
      pageSize
    }).then(res => {
      if (res) {
        const { list } = this.state
        const l = list.concat(res.records || [])
        this.setState({
          isLoaded: true,
          list: l,
          hasMore: res.isHasNext === true,
          isEmpty: l.length <= 0,
          pageNum
        }, () => {
          if (callback) {
            callback();
            this.listStatus = false;
          }
        })
      }
    })
  }

  onScrollToLower = (fn) => {
    if (this.listStatus) {
      return false;
    }
    this.listStatus = true;
    this.state.pageNum += 1;
    this.getData({ pageNum: this.state.pageNum, callback: fn })
  };

  onPullDownRefresh = (fn) => {
    this.setState({
      list: []
    }, () => this.getData({ callback: fn }))
  }

  componentWillReact() { }

  componentDidMount() {
    const that = this
    Taro.getSystemInfo({
      success: function (res) {
        that.setState({
          screenHeight: res.screenHeight - 200,
        })
        that.getData({})
        that.getStatistics()
      }
    })

  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const {
      info,
      isLoaded, hasMore, isEmpty, list,
      screenHeight,
    } = this.state;

    return (
      <View>
        <View className={styles.header}>
          <View className={styles.header_inner}>
            <View className={styles.circle}></View>
            <View className={`${styles.upper_part} last`}>
              <View className={styles.total_num}>
                <Text className={styles.num}>{info.totalMemberNum}</Text>
                <Image src={Assets.common.huangguan} className={`${styles.img} no-loading`}></Image>
                {/* <View className={`iconfont iconhuiyuanguanli ${styles.iconm}`}></View> */}
              </View>
              <View className={styles.mumber_text}>会员总数(个)</View>
            </View>
            <View className={styles.lower_part}>
              <View className={styles.lower_item}>
                <View className={styles.new_add}>
                  <Text className={styles.item_num}>{info.todayMemberNum}</Text>
                  <View className={`iconfont iconxinzeng-xinzengbuzhanshi ${styles.upicon}`}></View>
                </View>
                <Text className={styles.item_text}>今日新增</Text>
              </View>
              <View className={styles.lower_item}>
                <Text className={styles.item_num}>{info.primaryMemberNum}</Text>
                <Text className={styles.item_text}>白银会员</Text>
              </View>
              <View className={styles.lower_item}>
                <Text className={styles.item_num}>{info.seniorMemberNum}</Text>
                <Text className={styles.item_text}>黄金会员</Text>
              </View>
              <View className={styles.lower_item}>
                <Text className={styles.item_num}>{info.diamondsMemberNum}</Text>
                <Text className={styles.item_text}>钻石会员</Text>
              </View>
            </View>
          </View>
        </View>
        <View className={styles.body}>
          <ListView
            // lazy
            ref={node => this.scrollV = node}
            isLoaded={isLoaded}
            hasMore={hasMore}
            isEmpty={isEmpty}
            onScrollToLower={this.onScrollToLower}
            onPullDownRefresh={this.onPullDownRefresh}
            className={styles.scroll_content}
            launch={{
              launchEmpty: true
            }}
            renderEmpty={<View className={styles.empty_box}><Empty /></View>}
          >

            {
              list.map(mumber => {
                return (
                  <View className={styles.mumber_item}>
                    <Image className={styles.avatar} src={getFileUrl(mumber.headImg) || Assets.register.logo}></Image>
                    <View className={styles.user_info}>
                      <View className={styles.name}>

                        {mumber.memberLevel === 1 && <Image src={Assets.common.baiyin} className={`${styles.img} no-loading`}></Image>}
                        {mumber.memberLevel === 2 && <Image src={Assets.common.huangjin} className={`${styles.img} no-loading`}></Image>}
                        {mumber.memberLevel === 3 && <Image src={Assets.common.zuanshi} className={`${styles.img} no-loading`}></Image>}
                        {mumber.nickName}
                        <View className={styles.nick_name}>{mumber.userName}</View>
                      </View>
                      <View className={styles.number_time}>
                        {/* <View className={styles.nick_name}>{mumber.userName}</View> */}
                        <View className={styles.time}>{Common.dateFormat(mumber.gmtCreated, 'yyyy-mm-dd hh:ii:ss')}</View>
                        <View>累计收益:
                          <Text className={styles.red}>￥{mumber.totalIncome || 0}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })
            }

          </ListView>

        </View>
      </View >
    );
  }

}

export default StoreMember;
