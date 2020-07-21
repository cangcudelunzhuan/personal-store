/**
 * @Author: limin.zhang
 * @Email: limin.zhang@jdxiaokang.com
 * @Update: 2020-07-03 10:00:09
 * @Description: 云仓收益
 */
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTabs } from 'taro-ui';
import withPage from '@/components/with-page';
import ListView from 'taro-listview';
import Empty from '@/components/empty';
import Model from '@/model';
import styles from './yc-profit.module.styl';

@withPage
class YcProfit extends Taro.Component {
  constructor(props) {
    super(props);
    this.config = {
      navigationBarTitleText: '云仓收益',
    }
    this.state = {
      // 界面/组件 初始数据
      hasMore: true,
      isEmpty: true,
      pageNum: 1,
      list: [],
      tabList: [{ 
        title: '已结算',
        id: 0
      }, { 
        title: '待结算',
        id: 1
      }],
      current: 0,
      cloudIncome: 0, // 累计收益
      settleStatus: 5, // 1-待结算 5-已完成
    };
    this.listStatus = false;
  }
  add0 = v => {
    return v < 10 ? `0${v}` : v
  }
  // 根据时间戳拿到时间
  dateFormat = (v, formate) => {
    const time = new Date(parseInt(v, 10));
    const year = time.getFullYear(),
      month = this.add0(time.getMonth() + 1),
      day = this.add0(time.getDate()),
      hours = this.add0(time.getHours()),
      minutes = this.add0(time.getMinutes()),
      second = this.add0(time.getSeconds());
    if (formate == '-') {
      return `${year}-${month}-${day} ${hours}:${minutes}:${second}`;
    } else if (formate == '/') {
      return `${year}/${month}/${day} ${hours}:${minutes}:${second}`;
    }
    return `${year}-${month}-${day} ${hours}:${minutes}:${second}`;
  }

  getData = ({ pageNum = 1, pageSize = 10, callback }) => {
    const { settleStatus } = this.state;
    Model.fund.incomeList({
      pageNum,
      pageSize,
      settleStatus, 
      serviceIncomeType: 3 // 3-云仓主收益
    }).then(res => {
      if (res) {
        const { list } = this.state
        const l = list.concat(res.records || [])
        this.setState({
          list: l,
          hasMore: res.hasNextPage === true,
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
    const {pageNum} = this.state;
    this.getData({ pageNum: pageNum + 1, callback: fn })
  };

  onPullDownRefresh = (fn) => {
    this.setState({
      list: []
    }, () => this.getData({ callback: fn }))
  }

  changeTab = (value) => {
    this.setState({
      current: value,
      list: [],
      hasMore: true,
      isEmpty: true,
      pageNum: 1,
      settleStatus: value ? 1 : 5
    }, () => {
      this.getData({})
    })
  }

  initData = () => {
    this.getData({});
    this.accountShow();
  }

  accountShow = () => {
    Model.fund.show().then(resModel => {
      if (resModel) {
        this.setState({
          cloudIncome: resModel.cloudMasterSettledIncome || 0,
        })
      }
    })
  }

  componentWillReact() { }

  componentDidMount() {
    this.initData();
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { list, hasMore, isEmpty, current, tabList, cloudIncome, settleStatus } = this.state;
    return (
      <View className={styles.container}>
        <View className={styles.fixed}></View>
        <View className={styles.header}>
          <View className={styles.headerNumber}>{ cloudIncome }</View>
          <View className={styles.headerTitle}>云仓累计收益(元)</View>
        </View>
        <View className={styles.tabList}>
          <View className={styles.tabInner}>
            <AtTabs current={current} tabList={tabList} onClick={this.changeTab.bind(this)}>
            </AtTabs>
          </View>
        </View>
        <View className={styles.body}>
          <ListView
            ref={node => this.scrollV = node}
            hasMore={hasMore}
            isEmpty={isEmpty}
            onScrollToLower={this.onScrollToLower}
            onPullDownRefresh={this.onPullDownRefresh}
            className={styles.scroll_content}
            launch={{
              launchEmpty: true
            }}
            renderEmpty={<View className={styles.empty_box}><Empty msg={settleStatus==5 ? '暂无已结算收益' : '暂无待结算收益'} type={8}/></View>}
          >
            <View className={styles.inner}>
              {
                list.map(item => (
                  <View className={styles.cell}>
                    <View className={styles.cellTop}>
                      <View className={styles.topTitle}>{item.costTypeDesc || ''}</View>
                      <View className={`${styles.topPrice} ${current ? styles.black : '' }`}>
                        {current ? null : <View className={styles.cellSign}>+</View>}
                        <View className={styles.cellPrice}>{item.amount || 0}</View>
                      </View>
                    </View>
                    <View className={styles.cellOrder}>{`订单号：${item.relationOrderId}`}</View>
                    <View className={styles.itemFooter}>
                      <View className={styles.cellDate}>{this.dateFormat(item.createTime)}</View>
                      {settleStatus == 5 ? <View className={styles.cellDesc}>{item.settleStatusDesc || ''}</View> : null}
                    </View>
                  </View>
                ))
              }
            </View>
          </ListView>
        </View>
      </View>
    );
  }

}

export default YcProfit;
