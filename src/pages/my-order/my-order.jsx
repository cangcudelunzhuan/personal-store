/**
 * @Author: cai.ping
 * @Email: cai.ping@jdxiaokang.com
 * @Update: 2020-02-27 10:09:23
 * @Description: true
 */
import Taro from '@tarojs/taro';
import ListView, { LazyBlock } from 'taro-listview';
import { View, Text, Image } from '@tarojs/components';
import { AtTabs, AtTabsPane, AtModal } from 'taro-ui';
import { message } from '@jxkang/wechat-utils';
import withPage from '@/components/with-page';
import { getFileUrl, formatPoint, orderPay, getOrderStatus, getAfterStatus } from '@/utils'
import { Ellipsis } from '@jxkang/wechat-cmpt';
import Model from '@/model';
import Assets from '@/components/assets';
import Empty from '@/components/empty';
import styles from './my-order.module.styl';

@withPage
class MyOrder extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '我的订单',
    }

    this.state = {
      // 界面/组件 初始数据
      type: 0,
      tabList: [],
      buyList: [
        { title: '自购', type: 0 },
        { title: '分享购', type: 1 },
      ],
      isLoaded: false,
      error: false,
      hasMore: true,
      isEmpty: false,
      list: [],
      screenHeight: '',
      buyType: 0,
      isShow: false,
      pageNum: 1,
      shopLevel: 1,
      info: {},
      isOrder: 1,
      sureModal: false,
      actionOption: {
        type: 1,
        desc: ''
      }
    };
  }

  getData = ({ pageNum = 1, pageSize = 4, callback }) => {
    const { type, list, isOrder, isSelf } = this.state
    const orderStatus = type === -1 ? '' : type
    let query = {}
    let afterQuery = {}
    if (type === 6) {
      query = {
        pageNum,
        pageSize,
        queryAfterSale: type === 6,
      }
    } else {
      query = {
        pageNum,
        pageSize,
        orderStatus,
      }
    }
    if (isSelf === 2 && isOrder === 1) {
      // query.orderSource = 6
      query.itemType = 2
    }
    if (isSelf === 2 && isOrder === 2) {
      // afterQuery.bizSource = 6
      afterQuery.itemType = 2
    }
    const m = isOrder === 2 ? //2售后列表 1订单列表
      Model.order.afterList(
        {
          pageNum,
          pageSize,
          ...afterQuery
        }
      ) :
      Model.order.queryList(
        query
      )

    m.then(res => {
      if (res) {
        const l = list.concat(res.list)
        this.setState({
          isLoaded: true,
          isShow: true,
          list: l,
          hasMore: res.hasNextPage === true,
          pageNum,
          isEmpty: l.length <= 0
        }, () => {
          if (callback) {
            callback()
          }
        })
      }
    })

  };
  getSearchData = ({ pageNum = 1, callback }) => {
    const { orderNo = '', itemName = '', consigneeName = '', phone = '' } = this.$router.params
    const { queryType, list } = this.state
    let params = {
      queryType,
      orderNo: decodeURI(orderNo),
      itemName: decodeURI(itemName),
      consigneeName: decodeURI(consigneeName),
      phone: decodeURI(phone),
    }
    Model.order.queryListByParam(params).then(res => {
      if (res) {
        const l = list.concat(res)
        this.setState({
          isLoaded: true,
          isShow: true,
          list: l,
          hasMore: false,
          pageNum,
          isEmpty: l.length <= 0
        }, () => {
          if (callback) {
            callback()
          }
        })
      }
    })
  }


  onScrollToLower = (fn) => {
    let { pageNum } = this.state;
    this.state.pageNum += 1
    this.getData({ pageNum: this.state.pageNum, callback: fn })
  };
  onPullDownRefresh = (fn) => {
    const { isSearchResult } = this.state
    this.setState({
      list: []
    }, () => {
      if (isSearchResult === 1) {
        this.getData({ callback: fn })
      } else if (isSearchResult === 2) {
        this.getSearchData({ callback: fn })
      }
    })
  }
  getType = () => {
    const { index = 0,//index 0-5 高亮的table选项
      isOrder = 1, //1 订单 2售后单
      isSelf = 1, //1 普通订单 2 自营订单
      isSearchResult = 1, // 1非搜索结果 2搜索结果
      queryType = 1, //1 订单号 2商品名称 3 收货人 4 电话
    } = this.$router.params

    let tabList = [
      { title: '全部', type: -1 },
      { title: '待支付', type: 0 },
      { title: '待发货', type: 1 },
      { title: '待收货', type: 2 },
      { title: '已完成', type: 3 },
      { title: '已关闭', type: 4 },
      // { title: '退换货', type: 6 },
    ]
    if (Number(isSelf) === 2) {
      tabList = [
        { title: '全部', type: -1 },
        { title: '待发货', type: 1 },
        { title: '已发货', type: 2 },
      ]
    }
    this.setState({
      type: tabList[index] ? tabList[index].type : '',
      index: tabList[index] ? Number(index) : 0,
      isOrder: Number(isOrder),
      isSelf: Number(isSelf),
      tabList,
      isSearchResult: Number(isSearchResult),
      queryType: Number(queryType)
    }, () => {
      if (Number(isSearchResult) === 1) { //非搜索情况下请求订单接口
        this.getData({})
      } else {
        this.getSearchData({})
      }
    }
    )
  }
  deleteOrder = (orderNo) => {
    Model.order.deleteOrder({ orderNo }).then(res => {
      if (res) {
        message.success("已删除")
        Taro.navigateTo({
          url: `/pages/my-order/my-order?t=${new Date().getTime()}`
        })
      }
    })
  }
  getInfo = () => {
    Model.login.shopInfo().then(res => {
      // res.accountOpenProcess = 2
      if (res) {
        this.setState({
          info: res,
        })
      }

    })
  }
  getProps = (propsValue = '') => {
    propsValue = `${propsValue}`.replace('[', '').replace(']', '').replace(/\"/g, "").split(',')
    const str = []
    for (let k of propsValue) {
      str.push(k.split(':')[1])
    }
    return str.join('/')
  }
  setaction = () => {
    const { actionOption } = this.state
    if (actionOption.type === 1) {
      this.sendTrans({})
    }
  }
  sendTrans = ({ logisticsType = 1, deliveryCompany = 'xxxxxxx', deliveryNo = '000000' }) => {
    const { checkNo } = this.state
    Model.order.sendTrans({
      // deliveryCompany,
      // deliveryNo,
      orderNo: checkNo,
      logisticsType
    }).then(res => {
      if (res === true) {
        this.setState({
          sureModal: false
        }, () => {
          message.success('提交成功')
          Taro.navigateTo({
            url: `/pages/my-order/my-order?index=1&isSelf=2`
          })
        })
      }
    })
  }

  componentWillReact() { }

  componentDidMount() {
    const userInfo = Taro.getStorageSync('userInfo') || {}
    this.getType()
    this.getInfo()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleClick = (value) => {
    const { tabList } = this.state
    this.setState({
      isShow: false,
      type: tabList[value].type,
      list: [],
      index: value
    }, () => this.getData({}))


  }

  goDetail = (orderNo, afterSaleNo) => {
    const { isSelf } = this.state
    Taro.navigateTo({
      url: `/pages/order-detail/order-detail?orderNo=${orderNo}&afterSaleNo=${afterSaleNo}&isSelf=${isSelf}`
    })
  }
  // goAfter = () => {
  //   Taro.navigateTo({
  //     url: '/pages/after-sales/after-sales'
  //   })
  // }
  geSearch = () => {
    const { isOrder, isSelf } = this.state
    Taro.navigateTo({
      url: `/pages/order-search/order-search?isOrder=${isOrder}&isSelf=${isSelf}`
    })
  }
  goAfter = (afterSaleNo) => {
    const { isSelf } = this.state
    Taro.navigateTo({
      url: `/pages/aftersales-detail/aftersales-detail?afterSaleNo=${afterSaleNo}&isSelf=${isSelf}`
    })
  }
  // setType = (type) => {
  //   this.setState({
  //     buyType: type,
  //     type: 0,
  //     isShow: false,
  //     list: []
  //   }, () => this.getData({}))
  // }




  render() {
    const {
      isLoaded, error, hasMore, isEmpty, list,
      screenHeight, type, tabList, buyType,
      buyList, isShow, shopLevel, info,
      isOrder, isSelf, index, sureModal, actionOption, isSearchResult
    } = this.state;
    return (
      <View className={styles.order_content}>
        <View className={styles.back}></View>
        {/* {shopLevel === 2 && <View className={styles.buy_type_box}>
          {buyList.map(it =>
            <View className={`${styles.item} ${buyType === it.type ? styles.active : null}`} onClick={() => this.setType(it.type)}>{it.title}</View>
          )}
        </View>} */}
        <View className={styles.nav_box}>
          {isOrder === 1 && <View className={`${styles.search_out} ${isSearchResult === 2 ? styles.result_search_out : styles.default_search_out}`}>
            <View className={styles.search_box} onClick={this.geSearch}>
              <View className={`iconfont ${styles.icon}`}>&#xe6f6;</View>
              <View>搜索</View>
            </View>
          </View>}

          {isOrder === 1 && isSearchResult === 1 && <AtTabs
            current={index}
            scroll
            tabList={tabList}
            onClick={this.handleClick}>
          </AtTabs>}
        </View>



        {isShow && <ListView
          // lazy
          ref={node => this.scrollV = node}
          isLoaded={isLoaded}
          hasMore={hasMore}
          isEmpty={isEmpty}
          launch={{
            launchEmpty: true
          }}
          renderEmpty={<View className={styles.grid_empty}><Empty msg="暂无订单数据" type={1} /></View>}
          onScrollToLower={this.onScrollToLower}
          onPullDownRefresh={this.onPullDownRefresh}
          className={`${styles.scroll_content} 
          ${isSearchResult === 2 ? styles.result_content : styles.default_content} 
          ${isOrder === 2 && styles.after_content}`}
        >
          {isOrder === 2 && list.map((item, i) =>
            <View className={styles.product_box} key={i + 1}>
              <View className={styles.title}>
                {/* <View className="iconfont">&#xe691;</View> */}
                <View className={styles.buy_icon}>买</View>
                <Text className={styles.font} onClick={this.goIndex}>{item.buyerUserName || '--'}</Text>
                <View className="iconfont turnright" onClick={this.goIndex}>&#xe68f;</View>
                <Text className={`${styles.status_box} ${styles.red}`}>
                  {getAfterStatus({
                    afterSaleStatus: item.afterSaleStatus,
                    afterSaleType: item.afterSaleType
                  })}
                </Text>
              </View>
              <View className={styles.info_box} onClick={() => this.goAfter(item.afterSaleNo)}>
                <Image className={styles.img} src={getFileUrl(item.skuImg)}></Image>
                <View className={styles.info_right}>
                  <View className={styles.item_line}>
                    <View className={styles.info_title}>
                      <Ellipsis count={1}>
                        {item.orderSource === 5 && <View className={styles.live_type}>转播</View>}
                        {(item.orderSource === 6 || isSelf === 2) && <View className={styles.live_type}>自营</View>}
                        {item.itemTitle}</Ellipsis>
                    </View>
                    <View className={styles.num}>¥ {item.agentUnitPrice}</View>
                  </View>
                  <View className={`${styles.item_line} ${styles.second}`}>
                    <View>
                      {this.getProps(item.propsValue)}
                    </View>
                    <View className={styles.count_box}>x{item.afterSaleCount}</View>
                  </View>
                  <View className={`${styles.item_line}`}>
                    <View className={styles.after_Amount}>退款金额 ￥{item.afterSaleAmount}</View>
                    <View></View>
                  </View>
                  <View className={`${styles.all_price}`}>
                    总计:
                        <View className={`${styles.all_num} ${styles.red}`}>￥{formatPoint(item.agentUnitPrice * item.afterSaleCount, 4)}</View>
                  </View>
                </View>
              </View>
              {/* <View className={styles.after_Amount}>退款金额 ￥{item.afterSaleAmount}</View> */}
              <View className={styles.bottom_box}>
                <View className={styles.button_box}>
                  {/* {item.afterSaleStatus !== 53 && item.afterSaleStatus !== 99 &&
                    <View className={`${styles.button} ${styles.gray_button}`}
                      onClick={() => this.setState({ sureModal: true, checkNo: item.orderNo, actionType: '删除' })}>
                      取消售后
                      </View>
                  } */}
                  {/* 52买家发货 53卖家收货 21同意退货 */}
                  {isSelf === 2 && item.afterSaleStatus < 53 &&
                    < View className={`${styles.button} ${styles.gray_button}`} onClick={() => this.goAfter(item.afterSaleNo)}>处理售后</View>
                  }
                  <View className={`${styles.button} ${styles.shouhuo}`} onClick={() => this.goAfter(item.afterSaleNo)}>查看售后</View>
                </View>
              </View>

            </View>
          )}


          {isOrder === 1 && list.map((item, i) =>
            <View className={styles.product_box}>
              <View className={styles.title}>
                {/* <View className="iconfont">&#xe691;</View> */}
                <View className={styles.buy_icon}>买</View>
                <Text className={styles.font} >{item.buyerUserName || '--'}</Text>
                {/* <View className="iconfont turnright" >&#xe68f;</View> */}
                <Text className={`${styles.status_box} ${styles.red}`}>
                  {getOrderStatus({
                    afterSale: item.afterSale,
                    afterSaleStatus: item.afterSaleStatus,
                    orderStatus: item.orderStatus,
                    afterSaleType: item.afterSaleType
                  })}
                </Text>
              </View>
              <View className={styles.info_box} onClick={() => this.goDetail(item.orderNo, item.afterSaleNo)}>
                <Image className={styles.img} src={getFileUrl(item.skuImg)}></Image>

                <View className={styles.info_right}>
                  <View className={styles.item_line}>
                    <View className={styles.info_title}>
                      <Ellipsis count={2} className={styles.title_in}>
                        {item.orderSource === 5 && <View className={styles.live_type}>转播</View>}
                        {item.orderSource === 6 && <View className={styles.live_type}>自营</View>}
                        {item.itemTitle}
                      </Ellipsis>
                    </View>
                    <View className={styles.num}>¥ {item.agentUnitPrice}</View>
                  </View>
                  <View className={`${styles.item_line} ${styles.second}`}>
                    <View>
                      {this.getProps(item.propsValue)}
                    </View>
                    <View className={styles.count_box}>x{item.count}</View>
                  </View>
                  {shopLevel >= 2 && <View className={`${styles.item_line}`}>
                    <View className={styles.recv}>预计收益￥{item.income || 0}</View>
                    <View></View>
                  </View>}
                  <View className={`${styles.all_price}`}>
                    总计:
                        <View className={`${styles.all_num} ${styles.red}`}>￥{formatPoint(item.agentUnitPrice * item.count, 4)}</View>
                  </View>
                </View>
              </View>
              {isSelf === 2 && item.orderStatus === 1 && item.afterSale === 0 &&
                <View className={styles.bottom_box}>
                  <View className={styles.button_box}>
                    <View className={`${styles.button} ${styles.gray_button}`}
                      onClick={() => this.setState({
                        sureModal: true,
                        checkNo: item.orderNo,
                        actionOption: {
                          type: 1,
                          title: '到店提货',
                          desc: '店主配送模式发货，无需物流'
                        }
                      })}>
                      店主配送
                      </View>
                    <View className={`${styles.button} ${styles.shouhuo}`} onClick={() => this.goDetail(item.orderNo, item.afterSaleNo)}>去发货</View>
                  </View>
                </View>
              }
            </View>
          )}
        </ListView>}
        <AtModal
          isOpened={sureModal}
          title={actionOption.type === 1 && actionOption.desc}
          cancelText='取消'
          confirmText='确定'
          onClose={() => this.setState({ sureModal: false })}
          onCancel={() => this.setState({ sureModal: false })}
          onConfirm={() => this.setaction()}
          content={actionOption.type !== 1 && actionOption.desc}
        />

      </View >
    );
  }

}

export default MyOrder;
