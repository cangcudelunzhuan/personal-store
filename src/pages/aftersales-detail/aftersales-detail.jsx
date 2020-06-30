/**
 * @Author: limin.zhang
 * @Email: limin.zhang@jdxiaokang.com
 * @Update: 2020-03-02 11:54:29
 * @Description: 售后进度
 */
import Taro from '@tarojs/taro';
import { View, Text, Image, Input, Textarea } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
// import Ellipsis from '@/components/ellipsis';
import { message } from '@jxkang/wechat-utils';
import { Ellipsis } from '@jxkang/wechat-cmpt';
import styles from './aftersales-detail.module.styl';
import { AtFloatLayout, AtModal, AtModalContent, AtModalHeader, AtModalAction } from 'taro-ui';
import Utils, { getFileUrl, formatPoint } from '@/utils'
// import AfterSales from '../after-sales/after-sales';

@withPage
class AftersalesDetail extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '查看售后',
      navigationBarBackgroundColor: "#F9482E",//头部背景色
      navigationBarTextStyle: "white"//头部字体颜色，

    }

    this.state = {
      // 界面/组件 初始数据
      showLogisticsPopup: false,
      stateList: [],
      imgs: [],
      afterInfo: {},
      newObj: {},
      kefuVisible: false,
      telNo: '0571-88670307',
      rejectVisible: false,
      refuseReason: '',
      sureModal: false,
      actionOption: {}
    };
  }

  logisticsInfoClick = () => {
    this.setState({
      showLogisticsPopup: true
    })
  }

  handleClose = () => {
    this.setState({
      showLogisticsPopup: false
    })
  }
  getExpressCompany = (value) => {
    this.setState({
      company: value.detail.value
    })
  }

  getExpressNumber = (value) => {
    this.setState({
      expressNumber: value.detail.value
    })
  }

  handleExpressInfo = (value) => {
    this.setState({
      showLogisticsPopup: false
    })
  }

  afterDetail = () => {
    const { afterSaleNo, isSelf = 1 } = this.$router.params;
    const that = this;
    Model.order.afterDetail(afterSaleNo).then(res => {
      if (res) {
        const imgs = (res.imgs || '').split(',')
        // res.reason = Number(res.reason)
        // res.afterSaleStatus = 2
        that.setState({
          afterInfo: res,
          imgs,
          isSelf: Number(isSelf)
        }, () => {
          const { afterInfo } = that.state;
          const newObj = that.afterStatus(afterInfo.afterSaleStatus);
          let stateList = [{
            text: '申请售后',
            isFinish: false
          }, {
            text: '店主审核',
            isFinish: false
          }, {
            text: '商家收货',
            isFinish: false
          }, {
            text: '售后完成',
            isFinish: false
          }]
          if (res.afterSaleType === 3 || res.afterSaleType === 1) {
            stateList = [{
              text: '申请售后',
              isFinish: false
            }, {
              text: '店主审核',
              isFinish: false
            }, {
              text: '售后完成',
              isFinish: false
            }]
          }
          if (afterInfo.afterSaleStatus === 98) {
            stateList = [{
              text: '申请售后',
              isFinish: false
            }, {
              text: '店主审核',
              isFinish: false
            }, {
              text: '售后驳回',
              isFinish: false
            }]
          }
          this.setState({
            newObj: newObj,
            stateList
          })
        })
      }
    })
  }


  afterStatus = (status) => {
    let title = '售后中'
    let desc = '售后申请已提交，正在等待审核...'
    let iconName = 'iconshouhou'
    const currentStatus = Number(status);
    if (currentStatus === 98) {
      title = '售后已驳回'
      desc = '商家已驳回申请'
      iconName = 'iconzhifushibai'
    } else if (21 <= currentStatus && currentStatus < 52) {
      title = '商家审核通过'
      desc = '您已通过售后申请...'
      iconName = 'iconkaidianchenggong'
    } else if (52 <= currentStatus && currentStatus < 53) {
      title = '商家确认收货'
      desc = '确认收货后，售后即可完成'
      iconName = 'iconkaidianchenggong'
    } else if (currentStatus === 99 || currentStatus === 53) {
      title = '售后成功'
      desc = '您的售后订单已成功，退款金已原路退回'
      iconName = 'iconkaidianchenggong'
    } else if (currentStatus === 97) {
      title = '售后已取消'
      desc = '您的售后订单取消'
      iconName = 'iconzhifushibai'
    }
    return { title, desc, iconName }
  }

  sendAfter = (afterSaleNo) => {
    const { company, expressNumber } = this.state
    Model.order.sendAfter({
      orderAfterNo: afterSaleNo,
      shippingCompany: company,
      shippingId: expressNumber
    }).then(res => {
      if (res) {
        this.setState({
          showLogisticsPopup: false
        })
        Taro.navigateTo({
          url: `/pages/my-order/my-order?index=6`
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
  tel = () => {
    const { telNo } = this.state;
    Taro.makePhoneCall({
      phoneNumber: telNo
    });
  }
  copyAction = (data) => {
    Taro.setClipboardData({
      data,
      success() {
        message.success('复制成功');
      }
    })
  }
  goOrderDetail = () => {
    const { afterInfo } = this.state
    Taro.navigateTo({
      url: `/pages/order-detail/order-detail?orderNo=${afterInfo.orderNo}`
    })
  }
  agreeChose = () => {
    const { afterInfo } = this.state
    const { afterSaleNo } = this.$router.params
    if (afterInfo.afterSaleType === 2) {
      Taro.navigateTo({
        url: `/pages/address/address?afterSaleNo=${afterSaleNo}`
      })
    } else if (afterInfo.afterSaleType === 3 || afterInfo.afterSaleType === 1) {
      this.setState({
        sureModal: true,
        actionOption: {
          type: 10,
          title: '同意售后',
          desc: `同意${afterInfo.afterSaleType === 3 ? '赔付' : '退款'}申请`
        }
      })
    }
  }
  setaction = () => {
    const { actionOption } = this.state
    if (actionOption.type === 10) {
      this.agreeAction(1)
    } else if (actionOption.type === 9) {
      this.receive()
    }
  }
  receive = () => {
    const { afterSaleNo } = this.$router.params
    Model.order.receive({
      afterSaleNo
    }).then(res => {
      if (res === true) {
        message.success('已收货')
        this.setState({
          sureModal: false
        }, () => this.afterDetail())
      }
    })
  }
  agreeAction = (agree) => {
    const { afterSaleNo } = this.$router.params
    const { refuseReason } = this.state
    if (agree === 0 && !refuseReason) {
      message.error('请填写理由')
      return false
    }
    Model.order.agreeAction({
      agree: agree === 1,
      afterSaleNo,
      refuseReason: agree === 0 ? refuseReason : '',
      province: 'xxxxx',
      city: 'xxxxx',
      area: 'xxxxx',
      street: 'xxxxx',
      detailAddress: 'xxxxx',
      receiveName: 'xxxxx',
      receivePhone: 'xxxxx'
    }).then(res => {
      if (res === true) {
        message.success('提交成功')
        setTimeout(() => {
          Taro.navigateTo({
            url: '/pages/my-order/my-order?index=0&isOrder=2&isSelf=2'
          })
        }, 1000)
      } else if (res === false) {
        message.error('操作失败')
      }
      this.setState({
        rejectVisible: false
      })
    })
  }
  componentWillReact() { }

  componentDidMount() {
    this.afterDetail()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const {
      stateList,
      imgs,
      showLogisticsPopup,
      afterInfo,
      expressNumber,
      company,
      newObj,
      kefuVisible,
      telNo,
      isSelf,
      rejectVisible,
      refuseReason,
      sureModal,
      actionOption
    } = this.state;


    return (
      <View className={styles.content}>
        <View className={styles.back}>
        </View>
        <View className={styles.body}>
          <View className={`${styles.info_box} ${styles.process_box}`}>
            {/** 进度条 */}
            {<View className={styles.progress_bar}>
              {
                stateList.map((item, index) => {
                  let isFinish = item.isFinish;
                  // 1、2申请售后   21、23店主审核 52买家发送物流 53商家收货 99售后成功 98商家驳回申请
                  if (index === 0) {
                    isFinish = true
                  } else if (index === 1 && afterInfo.afterSaleStatus >= 21) {
                    isFinish = true
                  } else if (index === 2 && afterInfo.afterSaleStatus >= 52) {
                    isFinish = true
                  } else if (index === 3 && afterInfo.afterSaleStatus >= 53) {
                    isFinish = true
                  }
                  return (
                    <View className={`${styles.state_item} 
                    ${(afterInfo.afterSaleType === 3 || afterInfo.afterSaleType === 1 || afterInfo.afterSaleStatus === 98) && styles.state_item_large}`}>
                      <View className={styles.state_info}>
                        <View className={`${styles.state_num} ${isFinish ? styles.finish_num : ''}`}>{index + 1}</View>
                        <View className={`${styles.state_text} ${isFinish ? styles.finish_text : ''}`}>{item.text}</View>
                      </View>
                      {index === stateList.length - 1 ? null :
                        // <View className={`iconfont ${styles.state_next} ${isFinish && styles.red}`}>&#xe6a7;</View>
                        <View className={`${styles.line} ${isFinish && styles.finish_line} ${(afterInfo.afterSaleType === 3 || afterInfo.afterSaleStatus === 98 || afterInfo.afterSaleType === 1) && styles.line_sm}`}></View>
                      }
                    </View>
                  )
                })
              }
            </View>}
          </View>

          <View className={styles.header}>
            <View className={styles.header_title}>
              <View className={`iconfont ${newObj.iconName} ${styles.header_icon}`} style={{ fontSize: '18px' }} />
              <Text>
                {
                  newObj.title
                }
              </Text>
            </View>
            <View className={styles.header_content}>{newObj.desc}</View>
          </View>

          <View className={styles.product_box}>
            <View className={styles.title}>
              {/* <View className={styles.buy_icon}>号</View> */}
              <Text className={styles.font}>订单编号:{afterInfo.orderNo || '--'}</Text>
              {afterInfo.orderNo && <View className={styles.copy_box} onClick={() => this.copyAction(`${afterInfo.orderNo}`)}>复制</View>}
            </View>
            <View className={styles.info_box} onClick={() => this.goOrderDetail({ orderNo: afterInfo.orderNo })}>
              <Image className={`${styles.img} no-loading`} src={getFileUrl(afterInfo.skuImgs)}></Image>
              <View className={styles.info_right}>
                <View className={styles.item_line}>
                  <View className={styles.info_title}>
                    <Ellipsis count={1}>{afterInfo.itemTitle}</Ellipsis>
                  </View>
                  <View className={styles.num}>¥ {afterInfo.unitPrice}</View>
                </View>
                <View className={`${styles.item_line} ${styles.second}`}>
                  <View>
                    {this.getProps(afterInfo.propsValue)}
                  </View>
                  <View className={styles.count_box}>x{afterInfo.afterSaleCount}</View>
                </View>
                {/* {shopLevel >= 2 && */}
                {/* <View className={`${styles.item_line}`}>
                  <View className={styles.recv}>预计收益￥{afterInfo.income || 0}</View>
                  <View ></View>
                </View> */}
                {/* } */}
                <View className={`${styles.all_price}`}>
                  总计:<View className={`${styles.all_num} ${styles.red}`}>￥{formatPoint(afterInfo.unitPrice * afterInfo.afterSaleCount, 4)}</View>
                </View>
              </View>
            </View>

          </View>

          {
            afterInfo.afterSaleStatus === 98 && <View className={styles.info_box}>
              <View className={styles.return}>驳回原因</View>
              <View className={styles.return_item}>
                <Text className={styles.return_title}>卖家留言：</Text>
                <Text className={styles.return_remarks}>{afterInfo.refuseReason}</Text>
              </View>
            </View>
          }
          {afterInfo.afterSaleStatus !== 98 && afterInfo.afterSaleStatus !== 97 && afterInfo.afterSaleType === 2 &&
            <View>
              {afterInfo.afterSaleStatus >= 52 &&
                <View className={styles.info_box}>
                  <View className={styles.return}>退回物流</View>
                  <View className={styles.return_item}>
                    <Text className={styles.return_title}>快递公司：</Text>
                    <Text className={styles.return_remarks}>{afterInfo.deliveryCompany}</Text>
                  </View>
                  <View className={`${styles.return_item} ${styles.noborder_bottom}`}>
                    <Text className={styles.return_title}>快递单号：</Text>
                    <Text className={styles.return_remarks}>{afterInfo.deliveryNo}</Text>
                  </View>
                </View>
              }
              {afterInfo.afterSaleStatus >= 21 &&
                <View className={styles.info_box}>
                  <View className={styles.return}>退回地址</View>
                  <View className={styles.return_item}>
                    <Text className={styles.return_title}>退回地址：</Text>
                    <Text className={styles.return_remarks}>{afterInfo.receiveDetailAddress}</Text>
                  </View>
                  <View className={styles.return_item}>
                    <Text className={styles.return_title}>收货人：</Text>
                    <Text className={styles.return_remarks}>{afterInfo.receiveName || afterInfo.receivePerson}</Text>
                  </View>
                  <View className={`${styles.return_item} ${styles.noborder_bottom}`}>
                    <Text className={styles.return_title}>联系电话：</Text>
                    <Text className={styles.return_remarks}>{afterInfo.receivePhone}</Text>
                  </View>
                </View>
              }
            </View>
          }
          <View className={styles.info_box}>
            {/* <View className={styles.info_box_title}>您发起的</View> */}
            <View className={styles.return}>售后金额: <Text className={styles.red}>￥{afterInfo.afterSaleAmount}</Text></View>
            <View className={styles.refund_item}>
              <Text className={styles.refund_title}>售后单ID：</Text>
              <Text className={styles.refund_remarks}>
                {afterInfo.afterSaleNo}
                <Text className={styles.copy_box} onClick={() => this.copyAction(afterInfo.afterSaleNo)}>复制</Text>
              </Text>
            </View>
            <View className={styles.refund_item}>
              <Text className={styles.refund_title}>售后类型：</Text>
              <Text className={styles.refund_remarks}>
                {afterInfo.afterSaleType === 1 ? '仅退款' : null}
                {afterInfo.afterSaleType === 2 ? '退货退款' : null}
                {afterInfo.afterSaleType === 3 ? '赔付' : null}
              </Text>
            </View>
            <View className={styles.refund_item}>
              <Text className={styles.refund_title}>售后原因：</Text>
              <Text className={styles.refund_remarks}>
                {Number(afterInfo.reason) === 1 ? '质量问题' : ''}
                {Number(afterInfo.reason) === 2 ? '实物与图片不符' : ''}
                {Number(afterInfo.reason) === 3 ? '七天无理由' : ''}
                {Number(afterInfo.reason) === 4 ? '其他' : ''}
                {!Number(afterInfo.reason) && afterInfo.reason}
              </Text>
            </View>
            <View className={styles.refund_item}>
              <Text className={styles.refund_title}>售后说明：</Text>
              <Text className={styles.refund_remarks}>{afterInfo.remarks}</Text>
            </View>
            <View className={styles.refund_item}>
              <Text className={styles.refund_title}>发起时间：</Text>
              <Text className={styles.refund_remarks}>{afterInfo.gmtCreated}</Text>
            </View>
          </View>
        </View>
        {(afterInfo.afterSaleType === 2 || afterInfo.afterSaleType === 3) && imgs[0] &&
          <View className={styles.info_box}>
            <View className={styles.return}>售后凭证</View>
            <View className={styles.refund_proof}>
              {/* <View className={styles.title}>售后凭证：</View> */}
              <View className={styles.proof_img}>
                {imgs.map((item) =>
                  <Image className={`${styles.img} no-loading`} src={getFileUrl(item)}></Image>
                )}
              </View>
            </View>
          </View>
        }
        {/* <View className={styles.info_box}>
          <View className={styles.return}>售后记录</View>
          {[1, 2, 3, 4, 5].map(item =>
            <View className={styles.list_item}>
              <View className={styles.title}>买家发起退货退款申请</View>
              <View className={styles.date}>2020-08-09 16:29:00</View>
            </View>
          )}
        </View> */}
        <View className={styles.button_box}>
          {/* {21 <= afterInfo.afterSaleStatus && afterInfo.afterSaleStatus < 52 && afterInfo.afterSaleType === 2 &&
            <View className={styles.last_button} onClick={this.logisticsInfoClick}>填写退货</View>
          } */}
          {isSelf === 1 && <View className={`${styles.last_button}`} onClick={() => { this.setState({ kefuVisible: true }) }}>
            <View className={`iconfont ${styles.icon_phone}`}>&#xe6c2;</View>
            联系客服
          </View>}
          {/* 21同意退货 */}
          {isSelf === 2 && afterInfo.afterSaleStatus < 21 &&
            <View className={`${styles.last_button} ${styles.gray_button}`} onClick={() => this.setState({ rejectVisible: true })}>
              拒绝
              {afterInfo.afterSaleType === 1 && '退款'}
              {afterInfo.afterSaleType === 2 && '退货'}
              {afterInfo.afterSaleType === 3 && '赔付'}
            </View>
          }
          {isSelf === 2 && afterInfo.afterSaleStatus < 21 &&
            <View className={`${styles.last_button} ${styles.red_button}`} onClick={() => this.agreeChose()} >
              同意
              {afterInfo.afterSaleType === 1 && '退款'}
              {afterInfo.afterSaleType === 2 && '退货'}
              {afterInfo.afterSaleType === 3 && '赔付'}
            </View>
          }
          {/* 52买家退回 */}
          {isSelf === 2 && afterInfo.afterSaleStatus === 52 &&
            <View className={`${styles.last_button} ${styles.red_button}`}
              onClick={() =>
                this.setState({
                  sureModal: true,
                  actionOption: {
                    type: 9,
                    title: '确认收货',
                    desc: '确定已收货'
                  }
                })
              }>
              确认收货
            </View>
          }
        </View>


        {/* 填写物流信息弹出层 */}
        <AtFloatLayout isOpened={showLogisticsPopup} onClose={this.handleClose}>
          <View className={styles.popup_header}>
            <Text>填写退回物流</Text>
            <View className={styles.close}>
              <View className="iconfont close_icon" onClick={this.handleClose}>&#xe6c2;</View>
            </View>
          </View>
          <View className={styles.popup_body}>
            <View className={styles.item}>
              <Text className={styles.xrequired}>快递公司 : </Text>
              <Input className={styles.input} type='text'
                name='text' placeholder='请填写快递公司'
                value={company}
                onInput={this.getExpressCompany}></Input>
            </View>
            <View className={styles.item}>
              <Text className={styles.xrequired}>快递单号 : </Text>
              <Input className={styles.input} type='text' value={expressNumber}
                name='text' placeholder='请填写快递单号' onInput={this.getExpressNumber}></Input>
            </View>
          </View>
          <View className={styles.bottom_tool}>
          </View>
          <View className={styles.popup_button}>
            {expressNumber && company && <View className={styles.btn} onClick={() => this.sendAfter(afterInfo.afterSaleNo)}>我已退回</View>}
            {(!expressNumber || !company) && <View className={`${styles.btn} ${styles.gray_btn}`} >我已退回</View>}
          </View>
        </AtFloatLayout>
        {/* 联系客服弹出 */}
        <AtModal isOpened={kefuVisible}>
          {/* <AtModalHeader>联系客服</AtModalHeader> */}
          <AtModalContent>
            <View className={styles.kefu_box} onClick={this.tel}>
              <View className={styles.title}>平台联系电话</View>
              <View>{telNo}</View>
            </View>
          </AtModalContent>
        </AtModal>
        <View className={styles.reject_box}>
          <AtModal isOpened={rejectVisible}>
            <AtModalHeader>拒绝理由</AtModalHeader>
            <AtModalContent>
              <View className={styles.kefu_box} >
                <Textarea
                  className={styles.text_area}
                  placeholder="可详细说明拒绝理由，限200字，可选填"
                  onInput={(e) => { this.setState({ refuseReason: e.detail.value }) }}
                  value={refuseReason}></Textarea>
              </View>
            </AtModalContent>
            <AtModalAction>
              <View className={styles.modal_button_box}>
                <View className={styles.item} onClick={() => this.setState({ rejectVisible: false })}>取消</View>
                <View className={`${styles.item} ${styles.red}`}
                  onClick={() => this.agreeAction(0)}>确定</View>
              </View>
            </AtModalAction>
          </AtModal>
        </View>
        <AtModal
          isOpened={sureModal}
          title={(actionOption.type === 10 || actionOption.type === 9) && actionOption.desc}
          cancelText='取消'
          confirmText='确定'
          onClose={() => this.setState({ sureModal: false })}
          onCancel={() => this.setState({ sureModal: false })}
          onConfirm={() => this.setaction()}
          content={(actionOption.type !== 10 && actionOption.type !== 9) && actionOption.desc}
        />
      </View >
    );
  }

}

export default AftersalesDetail;
