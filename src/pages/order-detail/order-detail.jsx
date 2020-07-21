/**
 * @Author: cai.ping
 * @Email: cai.ping@jdxiaokang.com
 * @Update: 2020-02-26 15:13:21
 * @Description: true
 */
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { message } from '@jxkang/wechat-utils';
import { RunSecond, Ellipsis } from '@jxkang/wechat-cmpt';
import { AtIcon, AtModal } from 'taro-ui'
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import { getFileUrl, formatPoint, orderPay } from '@/utils'
import LogisticsModal from '@/components/logistics-modal'
import styles from './order-detail.module.styl';


@withPage
class OrderDetail extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '我的订单',
    }

    this.state = {
      // 界面/组件 初始数据
      item: {},
      afterInfo: {},
      imgs: [],
      sureModal: false,
      actionOption: {
        type: 1,
        desc: ''
      },
      addressInfo: {
        list: []
      }
    };
  }
  goTransDetail = () => {
    const { orderNo, } = this.$router.params
    const { addressInfo } = this.state
    if (addressInfo.list.length === 0) {
      return false
    }
    Taro.navigateTo({
      url: `/pages/logistics-detail/logistics-detail?orderNo=${orderNo}`
    })
  }
  queryDetail = (orderNo) => {
    const { isSelf = 1, isYun = 1 } = this.$router.params
    Model.order.queryDetail({
      orderNo
    }).then(res => {
      // delete res.orderStatus
      // res.orderStatus = 4
      if (res) {
        res.propsValue = this.getProps(res.newPropsValue)
        // res.logisticsType = res.logisticsType || 2
        this.setState({
          item: res,
          isSelf: Number(isSelf),
          isYun: Number(isYun)
        })
        const { afterSaleNo } = this.$router.params
        res.afterSale === 1 && (this.afterDetail(res.afterSaleNo || afterSaleNo))
        res.logisticsType === 2 && (this.getDeliveryTrail(orderNo))
      }
    })
  }
  getDeliveryTrail = (orderNo) => {
    Model.order.getDeliveryTrail({ orderNo }).then(res => {
      if (res) {
        this.setState({
          addressInfo: res
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
  afterDetail = (afterSaleNo) => {
    // const { afterSaleNo } = this.$router.params
    Model.order.afterDetail(afterSaleNo).then(res => {
      if (res) {
        const imgs = (res.imgs || '').split(',')
        this.setState({
          afterInfo: res,
          imgs
        })
      }
    })
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
  goRefund = (type) => {
    const { orderNo } = this.$router.params
    Taro.navigateTo({
      url: `/pages/after-sales/after-sales?type=${type}&orderNo=${orderNo}`
    })
  }
  copyAction = (data) => {
    Taro.setClipboardData({
      data,
      success() {
        message.success('复制成功');
      }
    })
  }
  setaction = () => {
    const { actionOption } = this.state
    if (actionOption.type === 1) {
      this.sendTrans({})
    }
  }
  sendTrans = ({ logisticsType = 1, deliveryCompany = 'xxxxxxx', deliveryNo = '000000' }) => {
    const { item } = this.state
    Model.order.sendTrans({
      deliveryCompany,
      deliveryNo,
      orderNo: item.orderNo,
      logisticsType
    }).then(res => {
      if (res === true) {
        this.setState({
          sureModal: false
        }, () => {
          message.success('提交成功')
          this.queryDetail(item.orderNo)
          this.getDeliveryTrail(item.orderNo)
        })

      }
    })
  }
  sendgoods = (data) => {
    const { company, value } = data
    this.sendTrans({ logisticsType: 2, deliveryCompany: company, deliveryNo: value })
  }
  componentWillReact() { }

  componentDidMount() {
    const { orderNo } = this.$router.params
    this.queryDetail(orderNo)
    // this.getDeliveryTrail(orderNo)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { item, afterInfo, imgs, sureModal, actionOption, isSelf, addressInfo, isYun } = this.state;
    const afterStatus = (status) => {
      let title = '售后中'
      let desc = '售后申请已提交，正在等待审核...'
      let iconName = 'iconshouhou'
      if (status === 98) {
        title = '商家驳回'
        desc = '商家已驳回申请,请与商家沟通'
        iconName = 'iconzhifushibai'
      } else if (21 <= status && status < 52) {
        title = '商家审核通过'
        desc = '审核已通过，等待买家退回物品'
        iconName = 'iconkaidianchenggong'
      }
      else if (52 <= status && status < 53) {
        title = '商家确认收货'
        desc = '买家已退回物品，等待确认收货'
        iconName = 'iconkaidianchenggong'
      }
      else if (status === 99 || status === 53) {
        title = '售后成功'
        desc = '您的售后订单已成功，退款金已原路退回'
        iconName = 'iconkaidianchenggong'
      }
      return { title, desc, iconName }
    }
    return (
      <View className={styles.container}>
        <View className={styles.back}></View>
        <View className={styles.red_back}>
          {item.afterSale === 0 &&
            <View>
              <View className={styles.status_line}>
                {item.orderStatus === 0 && <View className="iconfont icondaizhifu" />}
                {item.orderStatus === 3 && <View className="iconfont iconyiwancheng" />}
                {item.orderStatus === 2 && <View className="iconfont icondaishouhuo2" />}
                {item.orderStatus === 1 && <View className="iconfont iconxiangqing-daifahuo" />}
                {item.orderStatus === 4 && <View className="iconfont iconguanbi" />}
                {item.orderStatus === 7 && <View className="iconfont iconyiquxiao" />}
                {item.afterSale === 1 && <View className="iconfont iconshouhou" />}
                <View>
                  {item.orderStatus === 0 && '待支付'}
                  {item.orderStatus === 1 && '待发货'}
                  {item.orderStatus === 2 && '待收货'}
                  {item.orderStatus === 3 && '已完成'}
                  {item.orderStatus === 4 && '已关闭'}
                  {item.orderStatus === 7 && '已取消'}
                  {item.afterSale === 1 && item.orderStatus === 2 && '退款中'}
                  {item.afterSale === 1 && item.orderStatus === 3 && '售后中'}
                </View>
              </View>
              <View className={styles.desc}>
                {item.orderStatus === 0 && '客户已下单，尚未支付'}
                {item.orderStatus === 1 && '订单已支付，等待发货'}
                {item.orderStatus === 2 && '订单已发货，等待收货…'}
                {item.orderStatus === 3 && '订单已签收完成，感谢您使用康小铺购物'}
                {item.orderStatus === 4 && '您的订单已关闭'}
                {item.orderStatus === 7 && '您的订单已取消'}
                {item.afterSale === 1 && item.orderStatus === 2 && '退款申请已提交，正在等待审核...'}
                {item.afterSale === 1 && item.orderStatus === 3 && '售后申请已提交，正在等待审核...'}
              </View>
            </View>
          }
          {afterInfo && item.afterSale === 1 &&
            < View >
              <View className={styles.status_line}>
                <View className={`iconfont ${afterStatus(afterInfo.afterSaleStatus).iconName}`} />
                <View>
                  {afterStatus(afterInfo.afterSaleStatus).title}
                </View>
              </View>
              <View className={styles.desc}>
                {afterStatus(afterInfo.afterSaleStatus).desc}
              </View>
            </View>
          }
        </View>
        <View className={styles.addres_box}>
          <View className={styles.item}>
            <View className={styles.left}>
              <View className={styles.name_box}>
                <Text className={styles.name}>{`${item.receiveName}`.substr(0.10)}{item.receiveName > 10 ? '...' : null}</Text>
                <Text className={styles.tel}>{item.receivePhone}</Text>
                <View className={styles.copy_box} onClick={() => this.copyAction(`${item.receiveName} ${item.receivePhone} ${item.detailAddress}`)}>复制</View>
              </View>
              <Text className={styles.gray}>
                <Ellipsis count={2}> {item.detailAddress}</Ellipsis>
              </Text>
            </View>
          </View>
        </View>
        {(addressInfo.expName || item.deliveryNo) && item.logisticsType === 2 &&
          <View className={`${styles.addres_box} ${styles.trans_box}`}>
            <View className={styles.item}>
              <View className={styles.left}>
                <View className={styles.name_box}>
                  <Text className={styles.name}>{addressInfo.expName || item.deliveryCompany}</Text>
                  <View className={styles.tel}>{addressInfo.number || item.deliveryNo}
                    <View className={styles.copy_box} onClick={() => this.copyAction(addressInfo.number || item.deliveryNo)}>复制</View>
                  </View>
                </View>
                {addressInfo.list.length > 0 &&
                  <View>
                    <Text className={`${styles.gray} ${styles.red}`}> {addressInfo.list ? addressInfo.list[0].status : '--'}</Text>
                    <View className={styles.date}>{addressInfo.list ? addressInfo.list[0].time : '--'}</View>
                  </View>
                }
              </View>
              {addressInfo.list.length > 0 && <View className={`iconfont ${styles.icon}`} onClick={this.goTransDetail}>&#xe68f;</View>}
            </View>
          </View>
        }
        {item.logisticsType === 1 && item.orderStatus >= 2 &&
          <View className={styles.product_box}>
            <View className={styles.order_info}>
              <View className={styles.title}>配送方式：</View>
              <View>店主配送</View>
            </View>
          </View>
        }

        <View className={styles.product_box}>
          <View className={styles.title}>
            <View className={styles.buy_icon}>{isYun === 1 && '买'}{isYun === 2 && '店'}</View>
            {isYun === 1 && <Text className={styles.font} >{item.buyerUserName || '--'}</Text>}
            {isYun === 2 && <Text className={styles.font} >{item.shopName || '--'}</Text>}
          </View>
          <View className={styles.info_box} >
            <Image className={styles.img} src={getFileUrl(item.skuImg)}></Image>
            <View className={styles.info_right}>

              <View className={styles.item_line}>
                <View className={styles.info_title}>
                  <Ellipsis count={2}>
                    {item.orderSource === 5 && <View className={styles.live_type}>转播</View>}
                    {item.itemTitle}
                  </Ellipsis>
                </View>
                <View className={styles.num}>¥ {item.agentUnitPrice}</View>
              </View>
              <View className={`${styles.item_line} ${styles.second}`}>
                <View>
                  {item.propsValue}
                </View>
                <View className={styles.count_box}>x{item.count}</View>
              </View>
              <View className={`${styles.item_line_container}`}>
                <View className={`${styles.item_line}`}>
                  {/* <View className={styles.recv}>预计收益￥{item.income || 0}</View> */}
                  <View ></View>
                </View>
              </View>
              <View className={`${styles.all_price}`}>
                总计: <View className={`${styles.all_num} ${styles.red}`}>￥{formatPoint(item.agentUnitPrice * item.count, 4)}</View>
              </View>
              <View className={styles.post_feebox}>
                运费: ¥ {item.postage || 0}
              </View>
            </View>
          </View>
        </View>

        <View className={styles.product_box}>
          <View className={styles.order_info}>
            <Text className={styles.title}>订单编号：</Text>
            <Text>{item.orderNo}</Text>
            <View className={styles.copy_box} onClick={() => this.copyAction(item.orderNo)}>复制</View>
          </View>
          <View className={styles.order_info}>
            <Text className={styles.title}>提交时间：</Text>
            <Text>
              {item.gmtCreated}
            </Text>
          </View>
          {item.gmtPayment && < View className={styles.order_info}>
            <Text className={styles.title}>支付时间：</Text>
            <Text>{item.gmtPayment}</Text>
          </View>}
          {item.gmtSend && <View className={styles.order_info}>
            <Text className={styles.title}>发货时间：</Text>
            <Text>{item.gmtSend}</Text>
          </View>}
          {item.gmtReceive && <View className={styles.order_info}>
            <Text className={styles.title}>完成时间：</Text>
            <Text>{item.gmtReceive}</Text>
          </View>}
        </View>

        {/* <View className={styles.product_box}>
          <View className={styles.transfee_box}>
            <Text>运费</Text>
            <Text className={styles.gray}>{item.freePostage === 1 && '免运费'}<Text className={styles.red}>¥ {item.postage || '0.00'}</Text></Text>
          </View>
        </View> */}

        {item.orderSource === 5 && <View className={styles.product_box}>
          <View className={styles.order_info}>
            <Text className={styles.title}>转播自：</Text>
            <Text>{item.liveShopName}</Text>
          </View>
          {/* <View className={styles.order_info}>
            <Text className={styles.title}>直播主可赚：</Text>
            <Text>{item.liveShopName}</Text>
          </View>
          <View className={styles.order_info}>
            <Text className={styles.title}>我可赚：</Text>
            <Text>{item.liveShopName}</Text>
          </View> */}
        </View>}
        {
          afterInfo && item.afterSale === 1 &&
          < View >
            {/* 卖家同意退货款 */}
            {
              afterInfo.afterSaleStatus !== 98 && afterInfo.afterSaleType === 2 &&
              < View >
                {
                  afterInfo.afterSaleStatus >= 52 &&
                  < View className={`${styles.product_box} ${styles.after_box}`}>
                    <View className={`${styles.title} ${styles.item}`}>退回物流</View>
                    <View className={styles.item}>
                      <View className={styles.label}>快递公司：</View>
                      <View className={styles.desc}>{afterInfo.deliveryCompany}</View>
                    </View>
                    <View className={styles.item}>
                      <View className={styles.label}>快递单号：</View>
                      <View className={styles.desc}>{afterInfo.deliveryNo}</View>
                    </View>
                  </View>
                }
                {afterInfo.afterSaleStatus >= 21 &&
                  <View className={`${styles.product_box} ${styles.after_box}`}>
                    <View className={`${styles.title} ${styles.item}`}>商品退回</View>
                    <View className={styles.item}>
                      <View className={styles.label}>退回地址：</View>
                      <View className={styles.desc}>{afterInfo.receiveDetailAddress}</View>
                    </View>
                    <View className={styles.item}>
                      <View className={styles.label}>收货人：</View>
                      <View className={styles.desc}>{afterInfo.receiveName || afterInfo.receivePerson}</View>
                    </View>
                    <View className={styles.item}>
                      <View className={styles.label}>联系电话：</View>
                      <View className={styles.desc}>{afterInfo.receivePhone}</View>
                    </View>
                  </View>
                }
              </View>
            }
            {/* 卖家不同意 */}
            {
              afterInfo.afterSaleStatus === 98 &&
              < View className={`${styles.product_box} ${styles.after_box}`}>
                <View className={`${styles.title} ${styles.item}`}>驳回原因</View>
                <View className={styles.item}>
                  <View className={styles.label}>卖家留言：</View>
                  <View className={styles.desc}>{afterInfo.refuseReason}</View>
                </View>
              </View>
            }
            <View className={`${styles.product_box} ${styles.after_box}`}>
              <View className={styles.item}>
                <View className={styles.label}>退款类型：</View>
                <View className={styles.desc}>
                  {afterInfo.afterSaleType === 1 && '仅退款'}
                  {afterInfo.afterSaleType === 2 && '退货退款'}
                  {afterInfo.afterSaleType === 3 && '赔付'}
                </View>
              </View>
              <View className={styles.item}>
                <View className={styles.label}>退款金额：</View>
                <View className={styles.desc}>{afterInfo.afterSaleAmount}</View>
              </View>
              <View className={styles.item}>
                <View className={styles.label}>退款原因：</View>
                <View className={styles.desc}>
                  {Number(afterInfo.reason) === 1 && '质量问题'}
                  {Number(afterInfo.reason) === 2 && '实物与图片不符'}
                  {Number(afterInfo.reason) === 3 && '七天无理由'}
                  {Number(afterInfo.reason) === 4 && '其他'}
                  {!Number(afterInfo.reason) && afterInfo.reason}
                </View>
              </View>
              <View className={styles.item}>
                <View className={styles.label}>退款说明：</View>
                <View className={styles.desc}>{afterInfo.remarks}</View>
              </View>
              {afterInfo.afterSaleType === 2 && <View className={`${styles.item} ${styles.img_item}`}>
                <View className={styles.label}>退款凭证：</View>
                <View className={styles.desc}>
                  {imgs.map((item) =>
                    <Image className={styles.img} src={getFileUrl(item)}></Image>
                  )}
                </View>
              </View>}
            </View>
          </View>
        }

        {isSelf === 2 && item.orderStatus === 1 && item.afterSale === 0 && <View className={styles.button_box}>
          <View className={styles.content}>
            <View className={styles.rigth}>
              {/* <View className={`${styles.button} ${styles.gray_button}`} >关闭订单</View> */}
              <View
                className={`${styles.button} ${styles.gray_button}`}
                onClick={() => this.setState({
                  sureModal: true,
                  checkNo: item.orderNo,
                  actionOption: {
                    type: 1,
                    titlt: '到店提货',
                    desc: '店主配送模式发货，无需物流'
                  }
                })}
              >店主配送</View>
              <View className={`${styles.button} ${styles.red_button}`} onClick={() => this.logist.show()} >去发货</View>
            </View>
          </View>
        </View>}


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
        <LogisticsModal ref={node => this.logist = node}
          onOK={this.sendgoods}
        ></LogisticsModal>
      </View >
    );
  }

}

export default OrderDetail;
