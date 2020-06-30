/**
 * @Author: chunxiao.zhang
 * @Email: chunxiao.zhang@jdxiaokang.com
 * @Update: 2020-03-11 13:58:49
 * @Description: 账户信息详情
 */
import Taro from '@tarojs/taro';
import { View, Text, Navigator } from '@tarojs/components';
import { Common } from '@jxkang/wechat-utils';
import ListView from 'taro-listview';
import withPage from '@/components/with-page';
import Model from '@/model';
import styles from './accountinfo.module.styl';
import { AtTabs, AtTabsPane } from 'taro-ui'
import Empty from './components/empty'


@withPage
class Accountinfo extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '康小铺',
    }

    this.state = {
      // 界面/组件 初始数据
      current: +this.$router.params.current || 0,
      add: 0, //累计收入选中索引
      withdraw: 0, //提现选中索引
      showInfo: [], //资金展示对象
      serviceType: 4, //业务类型 4-订单 6-佣金
      settleStatus: 1, //结算状态：1-待结算 5-已结算
      dataList: [], //列表数据,
      accountStatus: '',
      isLoaded: false,
      error: false,
      hasMore: true,
      isEmpty: false,
      screenHeight: '',
      pageNum: 1,
      rateMes: '',
    };
  }


  // 资金展示
  fundShow = () => {
    Model.fund.show().then(data => {
      if (data) {
        this.setState({
          showInfo: data,
        })
      }
    })
  }

  onScrollToLower = (fn) => {
    let { pageNum } = this.state;
    this.state.pageNum += 1
    this.getIncomeList({ pageNum: this.state.pageNum, callback: fn })
  };

  onPullDownRefresh = (fn) => {
    const { current } = this.state
    this.setState({
      dataList: []
    }, () => {
      if (current === 2) {
        this.getIncomeList({ callback: fn, serviceType: '', settleStatus: 1 })
      } else if (current === 0) {
        this.getIncomeList({ callback: fn, settleStatus: 5 })
      } else if (current === 1) {
        this.getWithdrawList({ callback: fn })
      }
    })
  }

  // 收益明细
  getIncomeList = ({ serviceType = this.state.serviceType, settleStatus = this.state.settleStatus, pageNum = 1, pageSize = 20, callback }) => {
    let params = {};
    if (serviceType) {
      params.serviceType = serviceType
    }
    if (settleStatus) {
      params.settleStatus = settleStatus
    }
    params.pageNum = pageNum
    params.pageSize = pageSize
    const { dataList } = this.state
    Model.fund.incomeList(params).then(data => {

      if (!data) return false
      let l;
      if (pageNum == 1) {
        l = [].concat(data.records)
      } else {
        l = dataList.concat(data.records)
      }
      //  const l = dataList.concat(data.records)
      this.setState({
        isLoaded: true,
        isShow: true,
        dataList: l,
        hasMore: data.hasNextPage === true,
        pageNum: data.pageNum,
        isEmpty: l.length <= 0
      })
      if (callback) {
        callback()
      }

    })
  }
  // 提现记录
  getWithdrawList = ({ pageNum = 1, pageSize = 20, callback }) => {
    Model.fund.withdrawList({
      pageNum,
      pageSize
    }).then(data => {
      if (!data) return;
      const { dataList } = this.state
      if (!data) return false

      const l = dataList.concat(data.records)
      this.setState({
        isLoaded: true,
        isShow: true,
        dataList: l,
        hasMore: data.hasNextPage,
        pageNum: data.pageNum,
        isEmpty: l.length <= 0
      })
      if (callback) {
        callback()
      }
    })
  }
  // tab切换
  handleClick = (value) => {

    this.setState({
      current: value,
      dataList: [],
      isLoaded: false,
      error: false,
      hasMore: true,
      isEmpty: false,
      pageNum: 1,
    })
    if (value == 0) {
      this.getIncomeList({ serviceType: 4, settleStatus: 5 })
      this.setState({
        withdraw: 0,
        serviceType: 4,
        settleStatus: 5
      })
    }
    if (value == 1) {
      this.setState({
        dataList: []
      }, () => this.getWithdrawList({}))
    }
    if (value == 2) {
      this.getIncomeList({ serviceType: '', settleStatus: 1 })
      this.setState({
        add: 0
      })
    }
  }
  changeAdd = (index, item, serviceType, settleStatus) => {

    if (item == 'add') {
      this.setState({
        add: index,

      })
    } else if (item == 'withdraw') {
      this.setState({
        withdraw: index,

      })
    }
    if (serviceType) {
      this.setState({
        serviceType
      })
      this.getIncomeList({ serviceType, settleStatus })
    }
    if (settleStatus) {
      this.setState({
        settleStatus
      })
    }
  }
  // 获取开户状态
  getAccountStatus = () => {
    Model.password.accountStatus().then(data => {
      if (!data) return false
      this.setState({
        accountStatus: data.passwordStatus
      })
    })
  }

  // 操作密码
  editPassword = () => {
    let { accountStatus } = this.state;
    let type;
    if (accountStatus == 0) {
      type = '01'
    } else {
      type = '03'
    }
    const hfPasswordParam = {
      operateType: type,
      requestType: 'M',
      // merPriv: 'm_h5'
      merPriv: `${location.origin}/#/pages/result/result`,
    }

    Model.password.setPassword(hfPasswordParam).then(v => {
      if (v) {
        const { url, merCustId, version, checkValue } = v;

        // location.href = `${url}?mer_cust_id=${merCustId}&version=${version}&check_value=${checkValue}`;


        // Config.runEnv !== 'weixin'
        Common.winOpen({
          url,
          target: '_self',
          type: 'post',
          params: {
            'mer_cust_id': merCustId,
            version,
            'check_value': checkValue
          },
        });

      }
    })
  }

  add0 = v => {
    return v < 10 ? `0${v}` : v
  }
  // 根据时间戳拿到时间
  getTime = (v, formate) => {
    const time = new Date(v)
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

  componentWillReact() { }

  componentDidMount() {
    const that = this
    const { serviceType, current, settleStatus } = this.state

    this.fundShow()

    this.getAccountStatus();
    that.withdrawConfig();
    Taro.getSystemInfo({
      success: function (res) {
        that.setState({
          // screenWidth: res.screenWidth,
          screenHeight: res.screenHeight,
          // type: Number(type)
        })

        if (current == 0) {
          that.getIncomeList({ serviceType, settleStatus: 5 })
        } else if (current == 1) {
          that.getWithdrawList({})
        } else if (current == 2) {
          that.getIncomeList({ settleStatus: 1, serviceType: '' })
        }

      }
    })
  }

  /**
   * 提现服务费、手续费说明
   */
  withdrawConfig = () => {
    Model.goods.withdrawConfig().then(resModel => {
      if (resModel) {
        this.setState({
          rateMes: resModel,
        })
      }
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }


  render() {
    const { add,
      withdraw,
      showInfo,
      current,
      dataList,
      accountStatus,
      isLoaded,
      error,
      hasMore,
      isEmpty,
      screenHeight,
      rateMes,
    } = this.state;
    const tabList = [{ title: '累计收益' }, { title: '可提现金额' }, { title: '待结算金额' }]

    return (
      <View className={styles.container}>
        {/**
        * tab
        */}
        <View className={styles.back}></View>
        <AtTabs current={current} tabList={tabList} onClick={this.handleClick} className={styles.tab_box}>
          <AtTabsPane current={current} index={0}>
            <View className={styles.box}>
              <View className={styles.income}>
                <View className={styles.income_name}>累计收益</View>
                <View>¥ {showInfo.totalIncome}</View>
              </View>
              <View className={styles.type_box}>
                <View className={` ${add == 0 ? styles.active : ''} ${styles.type}`} onClick={() => this.changeAdd(0, 'add', 4, 5)}>
                  <View className={styles.type_name}>订单收入</View>
                  <View className={styles.type_price}>¥ {showInfo.orderIncome}</View>
                  {add == 0 && <View className={`iconfont iconsanjiaoxing ${styles.icon}`}></View>}
                </View>
                <View className={` ${add == 1 ? styles.active : ''} ${styles.type}`} onClick={() => this.changeAdd(1, 'add', 6, 5)}>
                  <View className={styles.type_name}>推荐佣金收入</View>
                  <View className={styles.type_price}>¥ {showInfo.commissionIncome}</View>
                  {add == 1 && <View className={`iconfont iconsanjiaoxing ${styles.icon}`}></View>}
                </View>
              </View>
            </View>

          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            <View className={styles.box} >

              <View className={styles.type_box}>
                <View className={` ${withdraw == 0 ? styles.active : ''} ${styles.type}`} onClick={() => this.changeAdd(0, 'withdraw')}>
                  <View className={`${styles.type_name} ${styles.tx}`}>可提现</View>
                  {withdraw == 0 && <View className={`iconfont iconsanjiaoxing ${styles.icon}`}></View>}
                </View>
                <View className={` ${withdraw == 1 ? styles.active : ''} ${styles.type}`} onClick={() => this.changeAdd(1, 'withdraw')}>
                  <View className={`${styles.type_name} ${styles.tx}`}>不可提现</View>
                  {withdraw == 1 && <View className={`iconfont iconsanjiaoxing ${styles.icon}`}></View>}
                </View>
              </View>
              {withdraw == 0 && <View className={styles.tx_box}>
                <View className={styles.type_tx_price}>¥ {showInfo.balanceAccount}</View>
                <View className={styles.txian_btnbox}>
                  <Navigator url="/pages/cashout/cashout" className={styles.go_btn}>提现</Navigator>
                  {/* <View className={styles.password} onClick={this.editPassword}>{accountStatus == 0 ? '设置支付密码' : '修改支付密码'}</View> */}
                </View>
              </View>}
              {withdraw == 1 && <View className={styles.tx_box}>
                <View className={styles.type_tx_price1}>¥ {showInfo.pendingSettle}</View>
              </View>}
            </View>

          </AtTabsPane>
          <AtTabsPane current={current} index={2}>
            <View className={styles.box}>
              <View className={`${styles.income}`}>
                <View className={styles.income_name}>待结算金额</View>
                <View>¥ {showInfo.pendingSettle}</View>
              </View>
            </View>
          </AtTabsPane>
        </AtTabs>

        <ListView
          // lazy
          ref={node => this.scrollV = node}
          isLoaded={isLoaded}
          hasMore={hasMore}
          isEmpty={isEmpty}
          onScrollToLower={this.onScrollToLower}
          onPullDownRefresh={this.onPullDownRefresh}
          className={`${styles.scroll_content} ${current === 0 && styles.lj_scroll} ${current === 1 && withdraw == 0 && styles.tx_scroll} ${current === 1 && withdraw == 1 && styles.tx_1_scroll} ${current === 2 && styles.js_scroll}`}
          launch={{
            launchEmpty: true
          }}
          renderEmpty={<Empty />}
        >
          {current === 0 &&
            <View>
              {
                dataList.map(v => {
                  return (
                    <View className={styles.list_box}>
                      <View className={`${styles.list} last`}>
                        <View>
                          <View>订单号：{v.relationOrderId}</View>
                          <View className={styles.list_name}>{v.costTypeDesc}</View>
                          <View>时间：{this.getTime(v.createTime)}</View>
                        </View>
                        <View className={styles.list_price}>
                          ¥ {v.amount}
                          {v.settleStatus === 3 && <View className={`${styles.mt18}`}>{v.settleStatusDesc}</View>}
                        </View>
                      </View>
                    </View>
                  )
                })

              }
            </View>
          }
          {current === 1 &&
            <View>
              <View className={`${styles.title} last ${styles.bg_fff}`}>
                <View className={`iconfont icontixianjilu ${styles.records}`}></View>
                <View>提现记录</View>
              </View>
              {
                dataList.map(v => {
                  return (
                    <View className={styles.list_box}>
                      <View className={`${styles.list} last`}>
                        <View>
                          <View>
                            <View className={styles.mes_box}>
                              (含{rateMes.withdrawServiceRate || ''}%平台服务费+{rateMes.withdrawFeeAmount || ''}元提现手续费 )
                                </View>
                            <Text className={styles.desc}>{v.tradeStatusDesc}</Text>
                            {/* <Text className={styles.green}>{v.amount > 0 ? '+' : '-'} {v.amount}</Text> */}
                          </View>
                          <View className={styles.date}>时间：{this.getTime(v.createTime)}</View>
                        </View>
                        <View className={styles.right_inbox}>
                          <View className={styles.green}>{v.amount > 0 ? '+' : '-'} {v.amount}</View>
                          {v.tradeStatus == 1 && <View className={`${styles.list_price} ${styles.wait}`}>提现中</View>}
                          {v.tradeStatus == 2 && <View className={`${styles.list_price}`}>成功</View>}
                          {v.tradeStatus == 3 && <View className={`${styles.list_price} ${styles.failed}`}>失败</View>}
                        </View>
                      </View>
                    </View>
                  )
                })
              }
            </View>
          }
          {current === 2 &&
            <View>
              <View className={`${styles.title} last ${styles.bg_fff}`}>
                <View className={`iconfont icontixianjilu ${styles.records}  `}></View>
                <View>待结算记录</View>
              </View>
              {
                dataList.map(v => {
                  return (
                    <View className={styles.list_box}>

                      <View className={`${styles.list} last`}>
                        <View>
                          <View>订单号：{v.relationOrderId}</View>
                          <View className={styles.list_name}>{v.costTypeDesc}</View>
                          <View>时间：{this.getTime(v.createTime)}</View>
                        </View>
                        <View className={`${styles.list_price} `}>
                          <View>+ ¥ {v.amount}</View>
                          <View className={`${styles.mt18}`}>{v.settleStatusDesc}</View>
                        </View>
                      </View>
                    </View>
                  )
                })
              }
            </View>
          }
        </ListView>
      </View >
    );
  }

}

export default Accountinfo;
