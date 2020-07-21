/**
 * @Author: limin.zhang
 * @Email: limin.zhang@jdxiaokang.com
 * @Update: 2020-03-05 12:00:09
 * @Description: 商品价格
 */
import Taro from '@tarojs/taro';
import { View, Image, Text, Input, ScrollView } from '@tarojs/components';
import withPage from '@/components/with-page';
import { AtFloatLayout, AtSwitch } from "taro-ui"
import Model from '@/model';
import utils from '@/utils';
import Config from '@/config';
import { message } from '@jxkang/wechat-utils';
import styles from './yun-goods-price.module.styl';

@withPage
class GoodsPrice extends Taro.Component {
  constructor(props) {
    super(props);
    this.config = {
      navigationBarTitleText: '云仓商品加价',
    }
    this.state = {
      // 界面/组件 初始数据
      goodsPriceDetail: null,
      addPercent: '',
      minRetailPrice: 0, //最低建议零售价
      maxRetailPrice: '',
      minTradePrice: 0, //最低进货价
      maxTradePrice: 0, //最大进货价
      selectType: 0,
      goldRate: 0,
      diamondRate: 0,
      isOpenItem: false,
      defalutImgMes: '',
      defalutDetail: '',
      skuList: '',
      goodsDetail: '',
      fouceseMes: 1,
      agentPriceIncreaseRate: '',
      agentPriceIncreaseAmount: '',
      agentPriceIncreaseType: 0,
    };
  }

  getInfo = () => {
    // 店铺会员等级配置信息详情--直推推荐费(百分比)
    const { shopId } = Taro.getStorageSync('userInfo')
    // const currentData = {
    //   shopId:Taro.getStorageSync
    // }
    Model.login.shopMemberDispose({ shopId: shopId }).then(res => {
      if (res && res.list && res.list.length) {
        const list = [...res.list];
        const goldList = list.filter(item => item.levelNum == 2).map(i => i.commissionRate) || [];
        const diamondList = list.filter(item => item.levelNum == 3).map(i => i.commissionRate) || [];
        this.setState({
          goldRate: goldList.length ? goldList[0] * 0.01 : 0,
          diamondRate: diamondList.length ? diamondList[0] * 0.01 : 0,
        })
      }
    })
    // 获取商品价格初始状态
    Model.goods.goodsPriceDetail({ itemId: this.$router.params.itemId }).then(res => {
      console.log('resdddddd', res)
      if (res) {

        //   minRetailPrice: 0, //最低建议零售价
        // maxRetailPrice: '',
        // minTradePrice: 0, //最低进货价
        // maxTradePrice: 0, //最大进货价
        if (res.agentPriceIncreaseType == 0) {
          this.setState({
            agentPriceIncreaseType: res.agentPriceIncreaseType,
            agentPriceIncreaseRate: res.agentPriceIncreaseRate * 100,
            fouceseMes: 1,
            agentPriceIncreaseAmount: '',
          })
        } else {
          this.setState({
            agentPriceIncreaseType: res.agentPriceIncreaseType,
            agentPriceIncreaseRate: '',
            fouceseMes: 2,
            agentPriceIncreaseAmount: res.agentPriceIncreaseAmount,
          })
        }
        if (res.priceIncreaseType === 1) {
          this.setState({
            goodsPriceDetail: res,

            minRetailPrice: res.minRetailPrice,
            maxRetailPrice: res.maxRetailPrice,

            minTradePrice: res.minTradePrice,
            maxTradePrice: res.maxTradePrice,

            addPercent: res.priceIncreaseAmount || 0,
            selectType: 1
          })
        } else {
          this.setState({
            goodsPriceDetail: res,

            minRetailPrice: res.minRetailPrice,
            maxRetailPrice: res.maxRetailPrice,

            maxTradePrice: res.maxTradePrice,
            minTradePrice: res.minTradePrice,

            addPercent: parseInt(res.priceIncreaseRate * 100, 10),
            selectType: 0
          })
        }
      }
    })
  }

  getAddPercent = (value) => {
    const { selectType } = this.state;
    value = `${value.target.value}`;
    if (selectType == 1) {
      this.setState({
        addPercent: value.indexOf('.') > 0 ? value.slice(0, value.indexOf('.') + 3) : value
      })
    } else if (selectType == 0) {
      this.setState({
        addPercent: parseInt(value, 10)
      })
    }
  }
  //比率 0
  getyunAddPercent = (value) => {
    value = `${value.target.value}`;
    this.setState({
      agentPriceIncreaseRate: value.indexOf('.') > 0 ? value.slice(0, value.indexOf('.') + 3) : value,
      agentPriceIncreaseType: 0,
      agentPriceIncreaseAmount: '',
    })
  }
  // 金额 1
  getyunAddIncrease = (value) => {
    value = `${value.target.value}`;
    this.setState({
      agentPriceIncreaseAmount: parseInt(value, 10),
      agentPriceIncreaseType: 1,
      agentPriceIncreaseRate: '',
    })
  }
  // 百分比获取焦点
  foucepercent = () => {
    this.setState({
      fouceseMes: 1,
      agentPriceIncreaseRate: '',
    })
  }

  // 加价获取焦点
  focusItemMes = () => {
    this.setState({
      fouceseMes: 2,
      agentPriceIncreaseAmount: '',
    })
  }

  save = () => {
    const { addPercent, selectType } = this.state;
    const { agentPriceIncreaseType, agentPriceIncreaseRate, agentPriceIncreaseAmount } = this.state;
    const finalPercent = addPercent || 0;
    const increaseLabel = selectType == 1 ? 'priceIncreaseAmount' : 'priceIncreaseRate';
    const increasePrice = selectType == 1 ? finalPercent : finalPercent * 0.01;

    const agentPriceIncreasePercent = agentPriceIncreaseType == 0 ? agentPriceIncreaseRate * 0.01 : 0;
    const agentPriceIncreaseMount = agentPriceIncreaseType == 1 ? agentPriceIncreaseAmount : 0;
    console.log('123144124', agentPriceIncreasePercent, agentPriceIncreaseMount)
    if (!(agentPriceIncreasePercent !== 0 || agentPriceIncreaseMount !== 0)) {
      message.warn('请输入云仓店加价信息');
      return false;
    }
    Model.goods.changeGoodsPrice({
      itemId: parseInt(this.$router.params.itemId, 10),
      feeRate: 0,
      priceIncreaseType: selectType,
      [increaseLabel]: increasePrice,
      agentPriceIncreaseRate: agentPriceIncreasePercent,
      agentPriceIncreaseAmount: agentPriceIncreaseMount,
      agentPriceIncreaseType: agentPriceIncreaseType,
    }).then((res) => {
      if (!res) return false

      if (Config.runEnv === 'android' || Config.runEnv === 'ios') { //ios、安卓交互
        utils.bridge.callhandler('toast', { toast: '操作成功' }, 0);
        setTimeout(() => {
          utils.bridge.callhandler('finish');
        }, 500);
      } else {
        message.success('操作成功')
        // setTimeout(() => {
        //   Taro.redirectTo({
        //     url: this.$router.params.herfType ? '/pages/goodsmange/goodsmange' : '/pages/shopworker/shopworker?tabInner=2',
        //   })
        // }, (500));
      }
    })
  }

  componentWillReact() { }

  componentDidMount() {
    this.getInfo()
    this.getShopInfo();
    this.getPreMiumMsg()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  click_item_mes = () => {

    this.setState({
      selectType: 1,
      addPercent: '',
    })
  }

  click_other_style = () => {
    this.setState({
      selectType: 0,
      addPercent: '',
    })
  }

  getShopInfo = () => {
    const { itemId } = this.$router.params
    // const userInfo = Taro.getStorageSync('userInfo') || {}

    // const { agentItemId, isLogin } = this.state
    this.goodsDetail(itemId);
    this.getImage('oneToOne');
    this.getImage('phoneDetail');
  }

  lookItem = () => {
    console.log(11111);
    this.setState({
      isOpenItem: true,
    })
  }

  getImage = (type) => {
    const { itemId } = this.$router.params
    Model.goods.getImage({
      bizId: itemId,
      bizType: 'item',
      type
    }).then(data => {
      if (!data) return false
      if (type == 'oneToOne') {
        this.setState({
          bannerList: data.records
        })
      } else if (type == 'phoneDetail') {
        this.setState({
          imgList: data.records
        })
      }

    })
  }

  // 查询sku
  getSku = () => {
    const { itemId } = this.$router.params
    const { defalutDetail } = this.state
    const params = {
      itemId,
      propsValues: defalutDetail
    }
    Model.goods.getSku(params).then(data => {
      if (!data) return false;
      this.setState({
        defalutImgMes: data,
      })
    })
  }

  goodsDetail = (itemId) => {
    console.log('itemId', itemId);
    Model.goods.goodsDetail({ itemId }).then(res => {
      if (res) {
        let d = (res && res.sku) || {}
        console.log('dddddd', d)
        d.agentStatus = res.agentStatus
        this.setState({
          mainUrl: res.mainImgUrl,
          goodsDetail: res, //详情数据
          defalutDetail: res.sku && res.sku.propsList || null, //默认规格
          defalutImgMes: d,   //默认商品
          skuList: res.propsList //规格列表
        })
      }


    })
  }
  getPreMiumMsg = () => {
    Model.goods.getPreMiumMsg().then((res) => {
      if (res) {
        utils.bridge.callhandler('setShowShareIcon', {
          show: false,
        });
        utils.bridge.callhandler('setShowQuestionIcon', {
          show: true,
          title: res.title,
          description: res.premiumMsg,
        });
      }
    })
  }

  clickItem = (v, index) => {
    const { defalutDetail } = this.state;
    defalutDetail[index].propertyValue = v;

    this.setState({
      defalutDetail: defalutDetail,
    }, () => {
      this.searchSpecification(defalutDetail[index])
    })

  }

  // 根绝规格查询其他可选规格
  searchSpecification = (propsValues) => {
    const { skuList } = this.state
    const { itemId } = this.$router.params
    const params = {
      itemId,
      propsValues: [propsValues]
    }
    Model.goods.getItemPropsValue(params).then(data => {
      if (!data) return false;
      if (data.length > 0) {
        const name = data[0].specsName;
        for (let i = 0, len = skuList.length; i < len; i++) {
          if (name == skuList[i].specsName) {
            skuList[i] = {
              specsName: name,
              propertyValueList: data.map(item => {
                return item.propertyValue
              })
            }
          }
        }
        this.setState({
          skuList
        })
      } else {
        this.setState({
          defalutDetail: [propsValues]
        })

      }
      this.getSku()
    })
  }

  getValueMes = (defalutDetail) => {
    const newPrice = (defalutDetail || []).map((v) => {
      return v.propertyValue
    })
    const priceMes = newPrice.join('/');
    return priceMes
  }



  render() {
    const {
      goodsPriceDetail, addPercent, agentPriceIncreaseAmount, agentPriceIncreaseRate,
      minRetailPrice, maxRetailPrice, selectType,
      goldRate, diamondRate, minTradePrice, maxTradePrice, isOpenItem, defalutImgMes, defalutDetail, skuList, goodsDetail, fouceseMes
    } = this.state;
    let addMinPrice = 0;
    let addMaxPrice = 0;
    let sellMinPrice = 0;
    let sellMaxPrice = 0;
    const persent = parseFloat(addPercent)
    if (selectType == 1 && persent) {
      // 固定金额
      addMinPrice = addMaxPrice = persent;
      sellMinPrice = (parseFloat(minTradePrice) + persent).toFixed(2);
      sellMaxPrice = (parseFloat(maxTradePrice) + persent).toFixed(2);
    } else if (selectType == 0 && persent) {
      // 百分比
      addMinPrice = parseFloat(minTradePrice * (persent * 0.01)).toFixed(2);
      addMaxPrice = parseFloat(maxTradePrice * (persent * 0.01)).toFixed(2);
      sellMinPrice = parseFloat(minTradePrice * (1 + persent * 0.01)).toFixed(2);
      sellMaxPrice = parseFloat(maxTradePrice * (1 + persent * 0.01)).toFixed(2);
    }

    const goldEarnings = addMaxPrice && goldRate ? (addMaxPrice * goldRate).toFixed(2) : 0;
    const diamondEarnings = addMaxPrice && diamondRate ? (addMaxPrice * diamondRate).toFixed(2) : 0;
    const selfMinEarnings = parseFloat(addMaxPrice - diamondEarnings).toFixed(2);
    const selfMaxEarnings = parseFloat(addMaxPrice).toFixed(2);
    if (!goodsPriceDetail) {
      return null;
    }
    return (
      <View className={styles.container}>
        <View className={styles.header}>
          {/* 新的header */}
          <View className={styles.newHeader}>
            <View className={styles.leftHeader}>
              <Image src={utils.getFileUrl(goodsPriceDetail.mainImgUrl)} className={styles.user_avatar}></Image>
            </View>
            <View className={styles.rightHeader}>
              <View className={styles.goods_title}>{goodsPriceDetail.itemTitle}</View>
              <View className={styles.allStork}>总库存:{goodsDetail.itemTotalStockQty}</View>
            </View>
          </View>

          <View className={styles.enterPrice}>
            <View className={styles.buy_price}>

              <Text className={styles.title}>进货价</Text>
              <View className={styles.priceContainer}>
                <Text className={`${styles.symbol} ${styles.red}`}>￥</Text>
                <Text className={`${styles.price} ${styles.red}`}>{minTradePrice}</Text>

                {minTradePrice !== maxTradePrice ? <Text><Text className={`${styles.symbol} ${styles.red}`}> ~ ￥</Text>
                  <Text className={`${styles.price} ${styles.red}`}>{maxTradePrice}</Text></Text> : null}
                <Text className={styles.lookItem} onClick={this.lookItem}>查看</Text>
              </View>
            </View>

            <View className={styles.buy_price} style={{ border: 'none' }}>
              <Text className={styles.title}>建议零售价：</Text>
              <View className={styles.priceContainer}>
                <Text className={styles.symbol}>￥</Text>
                <Text className={styles.price}>{minRetailPrice}</Text>

                {minRetailPrice !== maxRetailPrice ? <Text><Text className={styles.symbol}> ~ ￥</Text>
                  <Text className={styles.price}>{maxRetailPrice}</Text></Text> : null}
              </View>
            </View>
          </View>
        </View>
        <View className={styles.lineMes}></View>
        <View className={styles.body}>
          <View className={`${styles.cell} last`}>
            <Text className={styles.cell_title}>上架到</Text>
            <Text className={styles.cell_title}>今日爆品</Text>
          </View>

          <View className={`${styles.cell}`}>
            <Text className={styles.cell_title}>统一加价</Text>
            <View className={styles.cell_value}>
              <View className={styles.eve_money} onClick={this.click_item_mes}>
                <View
                  className={`iconfont ${selectType == 1 ? 'iconfuxuankuang_xuanzhong' : 'iconfuxuankuang_weixuanzhong'} 
                      ${selectType == 1 ? styles.select_style : styles.no_select_style}`}>
                </View>
                <View>固定金额</View>
              </View>
              <View className={styles.eve_money} style={{ marginLeft: '10px' }} onClick={this.click_other_style}>
                <View
                  className={`iconfont ${selectType === 0 ? 'iconfuxuankuang_xuanzhong' : 'iconfuxuankuang_weixuanzhong'}
                    ${selectType === 0 ? styles.select_style : styles.no_select_style}`}>
                </View>
                <View>百分比</View>
              </View>
            </View>
          </View>

          <View className={`${styles.cell} last`}>
            <Text className={styles.cell_title}></Text>
            <View className={styles.cell_value}>
              {/*  */}
              <Input
                className={`${styles.grey_value} ${styles.cell_input} ${!!addPercent ? styles.black_value : ''}`}
                value={!addPercent ? '' : addPercent}
                type='number'
                name='addpercent'
                placeholder='0'
                onChange={this.getAddPercent}
              />
              <Text className={`${styles.grey_value} ${!!addPercent ? styles.black_value : ''}`}>{selectType == 1 ? '元' : '%'}</Text>
            </View>
          </View>

          <View className={`${styles.cell} last`}>
            <Text className={styles.cell_title}>云仓价</Text>
            <View className={styles.priceContainer}>
              <Text className={styles.black_value}>￥</Text>
              <Text className={styles.black_value}>{sellMinPrice}</Text>

              {sellMinPrice !== sellMaxPrice
                ? <Text><Text className={`${styles.black_value} ${styles.extra}`}> ~ ￥</Text><Text className={styles.black_value}>{sellMaxPrice}</Text></Text>
                : null
              }
            </View>
          </View>

          <View className={`${styles.cell}`}>
            <Text className={styles.cell_title}>云仓收益</Text>
            <View className={styles.priceContainer}>
              <Text className={styles.red_value}>￥</Text><Text className={styles.red_value}>{addMinPrice}</Text>

              {addMinPrice !== addMaxPrice
                ? <Text><Text className={`${styles.red_value} ${styles.extra}`}> ~ ￥</Text><Text className={styles.red_value}>{addMaxPrice}</Text></Text>
                : null
              }
            </View>
          </View>
        </View>

        <View className={styles.lineMes}></View>

        <View className={styles.yun_add_price}>
          <View className={styles.topInner}>
            <View className={styles.topTitle}>
              <View className={styles.lines}></View>
              <View className={styles.yun_price}>云仓店加价</View>
            </View>

            <View className={styles.percentStyle} style={{ marginBottom: '10px', paddingTop: '20px' }} onClick={this.foucepercent}>
              <View className={styles.flexItem}>
                <View className={styles.leftMes}>
                  <View className={`iconfont ${fouceseMes == 1 ? 'icongouxuan' : 'iconweigouxuan'} ${fouceseMes == 1 ? styles.fouceStyle : ''}`}></View>
                </View>
                <View>
                  百分比加价
                </View>
              </View>
              <View className={`${styles.inputStyle}`}>
                <Input
                  type='number'
                  name='agentPriceIncreaseRate'
                  placeholder='请输入'
                  value={agentPriceIncreaseRate}
                  onChange={this.getyunAddPercent}
                  onFocus={this.foucepercent}
                />
                %
                </View>
            </View>

            <View className={styles.percentStyle} style={{ paddingBottom: '20px' }} onClick={this.focusItemMes}>
              <View className={styles.flexItem}>
                <View className={styles.leftMes}>
                  <View className={`iconfont ${fouceseMes == 2 ? 'icongouxuan' : 'iconweigouxuan'} ${fouceseMes == 2 ? styles.fouceStyle : ''}`}></View>
                </View>
                <View>
                  直接加价
                </View>
              </View>
              <View className={`${styles.inputStyle}`}>
                <Input
                  type='number'
                  name='agentPriceIncreaseAmount'
                  placeholder='请输入'
                  value={agentPriceIncreaseAmount}
                  onChange={this.getyunAddIncrease}
                  onFocus={this.focusItemMes}
                />
                元
                </View>
            </View>

          </View>
        </View>

        <View className={styles.lineMes}>

        </View>

        {/* <View className={styles.footer}>
          <View className={styles.triangle}></View>
          <View className={`${styles.footer_cell} ${styles.extra_margin}`}>
            <Text className={styles.cell_label}>店铺预计收益<Text className={styles.extra}>(以SKU最高价估算)</Text></Text>
            {
              selfMinEarnings === selfMaxEarnings
                ? <Text className={styles.cellValue}>￥{selfMinEarnings}</Text>
                : <Text className={styles.cellValue}>￥{selfMinEarnings} ~ ￥{selfMaxEarnings}</Text>
            }
          </View>

          <View className={`${styles.footer_cell} ${styles.extra_margin}`}>
            <Text>黄金自购/分享成单返佣</Text>
            <Text>￥{goldEarnings}</Text>
          </View>

          <View className={`${styles.footer_cell} ${styles.extra_margin}`}>
            <Text>钻石自购/分享成单返佣</Text>
            <Text>￥{diamondEarnings}</Text>
          </View>
          <View className={styles.footer_extra}>
            <Text className={`iconfont iconiconfontxiaogantanhao`}>会员分享返佣未分配完时会返还给店主</Text>
          </View>
        </View> */}

        {/* 弹出层，规格切换 */}
        <View className={styles.buy_layout}>
          <AtFloatLayout isOpened={isOpenItem} title="" onClose={() => {
            this.setState({
              isOpenItem: false
            })
          }}>
            <View className={styles.closeBtn} onClick={() => {
              this.setState({
                isOpenItem: false
              })
            }}>
              <View className={`iconfont ${styles.icon_close}`}>&#xe693;</View>
            </View>
            <ScrollView className={styles.openInner} scrollY>
              <View className={styles.pricePhoto}>
                <View className={styles.leftPriceImg} style={{ backgroundImage: `url(${utils.getFileUrl(defalutImgMes.skuImg)})` }} />
                <View className={styles.rightPriceBtn}>
                  <View classsName={styles.priceMesBtn} style={{ marginBottom: '30px' }}>
                    {defalutImgMes.itemTitle}
                  </View>
                  <View className={styles.selectColor}>总库存：{goodsDetail.itemTotalStockQty}</View>
                </View>
              </View>
              {
                (skuList || []).map((v, index) => (
                  <View key={index + 1} className={styles.eveMes}>
                    <View className={styles.titleMes}>{v.specsName}</View>
                    <View className={styles.spaceEve}>
                      {
                        v.propertyValueList && v.propertyValueList.map((v1, idx) => (
                          <View key={idx + 1} className={`${styles.eveStyle} ${defalutDetail && defalutDetail[index].propertyValue == v1 ? styles.activeColor : ''}`}
                            onClick={() => this.clickItem(v1, index)}>
                            {v1}
                          </View>
                        ))
                      }
                    </View>
                  </View>
                ))
              }
              <View className={styles.priceMes}>
                <View className={styles.enPrice}>
                  已选：<Text style={{ marginLeft: '10px' }}>{this.getValueMes(defalutDetail)}</Text>
                </View>
                <View className={styles.enPrice}>
                  进货价：<Text style={{ marginLeft: '10px', color: '#F9482E' }}>¥ {defalutImgMes.vipTradePrice}</Text>
                </View>
                <View className={styles.enPrice}>
                  建议零售价：<Text style={{ marginLeft: '10px' }}>¥ {defalutImgMes.retailPrice}</Text>
                </View>
                <View className={styles.enPrice}>
                  库存：<Text style={{ marginLeft: '10px' }}>{defalutImgMes.stockQty}</Text>
                </View>

              </View>
              {/* <View className={styles.eveMes}>
              <View className={styles.titleMes}>数量</View>
              <View className={styles.spaceEve}>
                <AtInputNumber
                  min={1}
                  max={defalutImgMes.stockQty}
                  step={1}
                  value={newValue}
                  onChange={(e) => this.handleChangeItem(e)}
                />
              </View>
            </View> */}

              {/* <View className={styles.buyItem}>
              {defalutImgMes.stockQty > 0 && <View className={styles.buyButton} onClick={this.hrefOdwnOrder}>确定</View>}
              {defalutImgMes.stockQty <= 0 && <View className={`${styles.buyButton} ${styles.gray}`} >此规格暂时无货</View>}
            </View> */}
            </ScrollView>
          </AtFloatLayout>
        </View>

        <View className={styles.save_btn} onClick={this.save}><View className={styles.btn}>确定</View></View>
      </View >
    );
  }

}

export default GoodsPrice;
