/**
 * @Author: qiang.zhang
 * @Email: 1196217890@qq.com
 * @Update: 2020-02-27 11:30:14
 * @Description: 工作台
 */
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtBadge } from 'taro-ui'
import { Common, $ajax } from '@jxkang/wechat-utils';
import withPage from '@/components/with-page';
import Assets from '@/components/assets';
import Model, { getFetchHeader } from '@/model';
import utils, { navigateToLogin } from '@/utils';
import styles from './index.module.styl';


@withPage
class Shopworker extends Taro.Component {
  constructor(props) {
    super(props);
    this.config = {
      navigationBarTitleText: '店铺工作台',
    }
    this.state = {
      info: {},
      showPrice: {},
      conut1: 0,
      conut2: 0,
      conut3: 0,
      conut4: 0,
      orderCount: 0,
      orderAmount: 0,
      income: 0
    };
  }

  componentWillReact() { }
  componentDidMount() {
    const that = this
    that.getInfo();
    that.getPrice();
    that.orderCount(0)//待付款个数
    that.orderCount(1)//待发货个数
    that.orderCount(2)//待收货个数
    // that.orderCount(3)//已完成个数
    that.afterCount()//售后个数
    that.queryShopOrderData()
  }

  queryShopOrderData = () => {
    Model.order.queryShopOrderData().then(res => {
      if (res) {
        this.setState({
          ...res
        })
      }
    })
  }

  hrefTopay = () => {
    window.location.href = 'https://jxkcdn.jingxiaokang.com/assets/html/app_setup.html'
  }

  orderCount = (orderStatus) => {
    Model.order.orderCount({
      orderStatus
    }).then(res => {
      if (res) {
        this.setState({
          [`conut${orderStatus + 1}`]: res
        })
      }
    })
  }

  afterCount = () => {
    Model.order.afterCount().then(res => {
      if (res) {
        this.setState({
          [`conut4`]: res
        })
      }
    })
  }

  getPrice = () => {
    Model.fund.show().then(res => {
      if (!res) return false;
      this.setState({
        showPrice: res,
      })
    })
  }

  getInfo = () => {
    Model.login.shopInfo().then(res => {
      if (res) {
        this.setState({
          info: res,
        })
      }
    })
  }

  lookShopInner = (e) => {
    e.stopPropagation()
    // const { info } = this.state;
    // const host = process.env.NODE_ENV === 'production' ? 'https://shop.kangxiaopu.com' : 'https://daily-shop.kangxiaopu.com'
    // window.location.href = `${host}/#/pages/index/index?companyId=${info.companyId}`;
    Taro.navigateTo({
      url: '/pages/go-shopstore/go-shopstore'
    });
  }

  shopMangeItem = (type) => {
    // 1.商品管理  2.会员管理
    const url = Common.seek()
      .equal(type == 1, '/pages/goodsmange/goodsmange')
      .equal(type == 2, '/pages/member-manage/member-manage')
      .equal(type == 3, '/pages/storeinfo/storeinfo')
      .get();

    Taro.navigateTo({
      url
    })
  }

  loginOut = () => {
    const { globalStore } = this.props
    Model.login.logout().then(res => {
      if (res) {
        Taro.removeStorageSync('userInfo')
        $ajax.uninjectHeaders();
        $ajax.injectHeaders(getFetchHeader(true));
        globalStore.setData('userInfo', {});
        utils.bridge.callhandler('exit', {});
        navigateToLogin({
          desc: '[system] file:shopworker.jsx line:241'
        });
      }
    })
  }
  goOrder = (index) => {
    Taro.navigateTo({
      url: `/pages/my-order/my-order?index=${index === 6 ? 0 : index}&isOrder=${index === 6 ? 2 : 1}`
    })
  }

  goAccountInfo = (index) => {
    Taro.navigateTo({
      url: `/pages/accountinfo/accountinfo?current=${index}`
    })
  }

  /**
   * 商品列表 滑动事件
   */
  onListViewScroll = (top = this.refList.state.scrollTop) => {
    const { hiddenTopBox } = this.state;
    if (!hiddenTopBox && top >= 670) {
      this.setState({ hiddenTopBox: true });
    }
  }

  render() {
    const { info, showPrice, conut1, conut2, conut3, conut4, orderAmount, orderCount, income } = this.state;

    return (
      <View className={styles.container}>
        <View className={styles.topworker}>
          <View className={styles.topworkerMes} onClick={() => this.shopMangeItem(3)}>
            <View style={{ display: 'flex' }} >
              <View className={styles.lefthead} >
                <View className={styles.headImg}>
                  <Image className={`${styles.imgMes} no-loading`} src={info.logo ? utils.getFileUrl(info.logo) : Assets.register.logo} alt="" />
                </View>
              </View>
              <View className={styles.righthead}>
                <View className={styles.topname}>
                  <View className={styles.realname}>{`${info.shopName || ''}`.substr(0, 10)}
                    {`${info.shopName}`.length > 10 ? '...' : null}</View>
                  {/* <View className={styles.factname}>个人店</View> */}
                </View>
                <View className={styles.lv_box}>
                  <Image src={Assets.shop.lv} className={`${styles.img} no-loading`}></Image>
                  <View className={styles.font}>个人店</View>
                </View>
              </View>
            </View>
            <View className={styles.right_box}>
              {/* <View className={styles.turnMes}>切换到云仓</View> */}
              <View className={styles.botname} onClick={(e) => this.lookShopInner(e)}>查看店铺</View>
            </View>
          </View>



          <View className={styles.workerInner}>
            <View className={styles.botorderList}>
              <View className={styles.eveOrderMes}>
                <View onClick={() => this.goAccountInfo(0)}>
                  <Text style={{ marginRight: '4px', color: '#666666' }} >累计收益</Text>
                  <Text style={{ fontSize: '10px', color: '#CCCCCC' }} className='iconfont iconzhanghuyue-gengduo'></Text>
                </View>
                <View className={styles.textColor}>￥{Number(showPrice.totalIncome || 0).toFixed(2)}</View>
              </View>

              <View className={styles.lineMes}></View>

              <View className={styles.eveOrderMes} onClick={() => this.goAccountInfo(1)}>
                <View>
                  <Text style={{ marginRight: '4px', color: '#666666' }} >账户余额</Text>
                  <Text style={{ fontSize: '10px', color: '#CCCCCC' }} className='iconfont iconzhanghuyue-gengduo'></Text>
                </View>
                <View className={styles.textColor}>￥{Number(showPrice.balanceAccount || 0).toFixed(2)}</View>
              </View>

              <View className={styles.lineMes}></View>

              <View className={styles.eveOrderMes} onClick={() => this.goAccountInfo(2)}>
                <View>
                  <Text style={{ marginRight: '4px', color: '#666666' }} >待结算金额</Text>
                  <Text style={{ fontSize: '10px', color: '#CCCCCC' }} className='iconfont iconzhanghuyue-gengduo'></Text>
                </View>
                <View className={styles.textColor}>￥{Number(showPrice.pendingSettle || 0).toFixed(2)}</View>
              </View>
            </View>
          </View>
        </View>
        <View className={styles.storeMes} onClick={this.hrefTopay}>
          <Image className={styles.store_img} src={Assets.home.storeName}></Image>
        </View>
        <View className={styles.todaygrad}>
          <View className={styles.toporder}>
            <View style={{ color: '#9A9A9A' }}>今日业绩</View>
            {/* <View style={{ fontSize: '12px', color: '#333' }} className='iconfont icongengduo'></View> */}
          </View>
          <View className={styles.botorderList}>
            <View className={styles.eveOrderMes}>
              <View>今日营业额</View>
              <View className={styles.textColor}>￥{orderAmount || 0}</View>
            </View>

            <View className={styles.lineMes}></View>

            <View className={styles.eveOrderMes}>
              <View>今日订单</View>
              <View className={styles.textColor}>{orderCount || 0} 个</View>
            </View>

            <View className={styles.lineMes}></View>

            <View className={styles.eveOrderMes}>
              <View>预计收益</View>
              <View className={styles.textColor}>￥{income || 0}</View>
            </View>
          </View>
        </View>

        <View className={styles.shoporder}>
          <View className={styles.toporder} onClick={() => this.goOrder(0)}>
            <View style={{ color: '#9A9A9A' }}>店铺订单</View>
            <View style={{ fontSize: '12px', color: '#333' }} className='iconfont icongengduo'></View>
          </View>
          <View className={styles.botorder}>
            <View className={styles.botInnerMes} onClick={() => this.goOrder(1)}>
              {conut1 > 0 && <AtBadge value={conut1} maxValue={99}>
                <View className={`iconfont icondaifukuan ${styles.iconfontstyle}`}></View>
              </AtBadge>}
              {conut1 <= 0 && <View className={`iconfont icondaifukuan ${styles.iconfontstyle}`}></View>}
              <View className={styles.font}>待付款</View>
            </View>

            <View className={styles.botInnerMes} onClick={() => this.goOrder(2)}>
              {conut2 > 0 && <AtBadge value={conut2} maxValue={99}>
                <View className={`iconfont icondaifahuo ${styles.iconfontstyle}`}></View>
              </AtBadge>}
              {conut2 <= 0 && <View className={`iconfont icondaifahuo ${styles.iconfontstyle}`}></View>}
              <View>待发货</View>
            </View>

            <View className={styles.botInnerMes} onClick={() => this.goOrder(3)}>
              {conut3 > 0 && <AtBadge value={conut3} maxValue={99}>
                <View className={`iconfont icondaishouhuo ${styles.iconfontstyle}`}></View>
              </AtBadge>}
              {conut3 <= 0 && <View className={`iconfont icondaishouhuo ${styles.iconfontstyle}`}></View>}
              <View>待收货</View>
            </View>

            <View className={styles.botInnerMes} onClick={() => this.goOrder(6)}>
              {conut4 > 0 && <AtBadge value={conut4} maxValue={99}>
                <View className={`iconfont icontuihuanhuo ${styles.iconfontstyle}`}></View>
              </AtBadge>}
              {conut4 <= 0 && <View className={`iconfont icontuihuanhuo ${styles.iconfontstyle}`}></View>}
              <View>退换货</View>
            </View>
          </View>
        </View>

        <View className={styles.evehref}>
          <View className={styles.eveInner} onClick={() => this.shopMangeItem(1)}>
            <View className={styles.leftInner}>
              <View style={{ marginRight: '10px', fontSize: '16px' }} className='iconfont iconshangpinguanli'></View>
              <View className={styles.shopMange}>商品管理</View>
            </View>
            <View className={styles.rightInner}>
              <View className='iconfont icongengduo'></View>
            </View>
          </View>

          <View className={styles.eveInner} onClick={() => this.shopMangeItem(2)}>
            <View className={styles.leftInner}>
              <View style={{ marginRight: '10px', fontSize: '16px' }} className='iconfont iconhuiyuanguanli'></View>
              <View className={styles.shopMange}>会员管理</View>
            </View>
            <View className={styles.rightInner}>
              <View className='iconfont icongengduo'></View>
            </View>
          </View>

          <View className={styles.eveInner} onClick={() => this.shopMangeItem(3)}>
            <View className={styles.leftInner}>
              <View style={{ marginRight: '10px', fontSize: '16px' }} className={`iconfont icondianpushezhi`}></View>
              <View className={styles.shopMange}>店铺设置</View>
            </View>
            <View className={styles.rightInner}>
              <View className='iconfont icongengduo'></View>
            </View>
          </View>

          <View className={styles.eveInner} onClick={() => this.loginOut()}>
            <View className={styles.leftInner}>
              <View style={{ marginRight: '10px', fontSize: '16px' }} className='iconfont'>&#xe6a0;</View>
              <View className={styles.shopMange}>退出账号</View>
            </View>
            <View className={styles.rightInner}>
              <View className='iconfont icongengduo'></View>
            </View>
          </View>

          {/* <View className={styles.eveInner}>
            <View className={styles.leftInner}>
              <View style={{ marginRight: '10px', fontSize: '16px' }} className='iconfont iconshengjiyuncang'></View>
              <View className={styles.shopMange}>升级云仓</View>
            </View>
            <View className={styles.rightInner}>
              <View className='iconfont icongengduo'></View>
            </View>
          </View> */}
        </View>
      </View>
    )
  }
}

export default Shopworker;
