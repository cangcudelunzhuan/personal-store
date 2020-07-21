/**
 * @Author: qiang.zhang
 * @Email: 1196217890@qq.com
 * @Update: 2020-02-25 16:58:26
 * @Description: true
 */
import Taro from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image, Text, ScrollView, Video } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Store from '@/store';
import Utils from '@/utils';
import styles from './goodsdetail.module.styl';
import { Ellipsis } from '@jxkang/wechat-cmpt';
// import Item from '@/components/product-list/item2'
import { AtFloatLayout } from "taro-ui"
import Share from '@/components/share-tool'
import Config from '@/config';


@withPage
class Goodsdetail extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '商品详情',
    }

    this.state = {
      currentIndex: 1,
      isOpenItem: false,
      isOpenShare: false,
      newValue: 1,
      goodsDetail: {},
      clickItem: [],
      defalutDetail: [],
      defalutImgMes: '',
      skuList: [],
      agentItemId: this.$router.params.agentItemId,
      itemId: this.$router.params.itemId,
      bannerList: [],// banner图
      imgList: [], //详情图
      windowH: '500px',
      companyId: this.$router.params.companyId,
      // productList: [],
      collectStatus: false,//状态
      level: 1,
      isLogin: Taro.getStorageSync('userInfo') && Taro.getStorageSync('userInfo').companyId && Taro.getStorageSync('userInfo').token, //是否登陆
      mark: '',
      mainUrl: '', // 主图
      noAreaModal: false,
      VideoContext: '',
      newVideoImg: '',
      autoplayItem: false,
    };
  }

  componentWillReact() { }

  componentDidMount() {
    this.getShopInfo();
  }

  getShopInfo = () => {
    const { itemId, frompage } = this.$router.params
    // const userInfo = Taro.getStorageSync('userInfo') || {}

    // const { agentItemId, isLogin } = this.state

    this.getImage('oneToOne');
    if (frompage == 'shopworker') {
      this.itemDetailShop(itemId);
    } else if (frompage == 'iframe') {
      this.shopDetail(itemId);
    } else {
      this.goodsDetail(itemId);
    }
    this.getImage('phoneDetail');
    // if (isLogin) {
    //   this.getCollectStatus()
    //   this.getLevel()
    //   this.companyCode()
    // }

    // Model.goods.shopBaseInfo({
    //   companyId
    // }).then(res => {
    //   if (res) {
    //     userInfo.companyId = companyId
    //     userInfo.shopId = res.shopId
    //     Store.globalStore.setData('userInfo', Object.assign(userInfo))

    //   }
    // })
  }

  /**
   * @description: 获取商品详
   * @param {type} 
   * @return: 
   */


  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleChange = (e) => {
    this.setState({
      currentIndex: e.detail.current + 1
    })
    if (e.detail.current !== 0) {
      this.refs.myVideo.pause();
      this.setState({
        autoplayItem: false,
        currentIndex: e.detail.current + 1
      })
    } else {
      this.refs.myVideo.play();
      this.setState({
        autoplayItem: true,
        currentIndex: e.detail.current + 1
      })
    }
  }

  hrefOdwnOrder = () => {
    const { newValue, defalutImgMes, goodsDetail, defalutDetail, agentItemId } = this.state
    const { shopId, companyId } = Store.globalStore.data.userInfo
    const currentData = {
      agentItemId,
      itemTitle: goodsDetail.itemTitle,
      skuImg: defalutImgMes.skuImg,
      tradePrice: defalutImgMes.agentVipTradePrice,  //单价
      brandId: defalutImgMes.brandId,
      brandName: defalutImgMes.brandName,
      count: newValue,
      freePostage: true,
      selectValue: defalutDetail,
      shopName: defalutImgMes.agentShopName,
      supplierId: defalutImgMes.supplierId,
      postage: defalutImgMes.postage,
      skuId: defalutImgMes.skuId,
      stockQty: defalutImgMes.stockQty
    }
    Model.goods.isExistMember({
      shopId
    }).then(data => {
      if (data) {
        Store.globalStore.setData('infoForOrder', Object.assign(currentData))
        Store.globalStore.setData('checkAddress', null)
        Taro.navigateTo({
          url: '/pages/submission/submission'
        })
      } else {
        Taro.navigateTo({
          url: `/pages/login/login?companyId=${companyId}`
        })
      }
    })
  }

  rightBuy = (e) => {
    this.setState({
      isOpenItem: true,
      isOpenShare: false
    })
  }

  handleChangeItem = (value) => {
    this.setState({
      newValue: value
    })
  }

  shareItem = () => {
    this.setState({
      isOpenShare: true,
      isOpenItem: false
    })
  }

  onCancalItem = () => {
    this.setState({
      isOpenShare: false,
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
      const { frompage = '' } = this.$router.params
      console.log(frompage);
      if (frompage == 'shopworker') {
        this.getSku()
      } else {
        this.getSkuClook();
      }
    })
  }

  // b查询sku
  getSku = () => {
    console.log('看看有没有走这李bcha');
    const { itemId } = this.$router.params
    const { defalutDetail, agentItemId } = this.state
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

  // c查询sku
  getSkuClook = () => {
    console.log('看看有没有走这李');
    const { itemId, agentItemId } = this.$router.params
    console.log('agentItemId', agentItemId);
    const { defalutDetail } = this.state
    const params = {
      propsValues: defalutDetail
    }
    if (agentItemId) {
      params.agentItemId = agentItemId;
    } else {
      params.itemId = itemId;
    }
    Model.goods.getSkuClook(params).then(data => {
      if (!data) return false;
      this.setState({
        defalutImgMes: data,
      })
    })
  }


  goodsDetail = (itemId) => {
    Model.goods.goodsDetail({ itemId }).then(res => {
      if (res) {
        console.log('为啥点击规格会变', res);
        let d = (res && res.sku) || {}
        d.agentStatus = res.agentStatus
        this.setState({
          mainUrl: res.mainImgUrl,
          goodsDetail: res, //详情数据
          defalutDetail: res.sku && res.sku.propsList || null, //默认规格
          defalutImgMes: d,   //默认商品
          skuList: res.propsList, //规格列表
          noArea: res.noArea || [],
          tagList: this.dealTag(res.tagList || []),
        })
        Utils.bridge.callhandler('setShowShareIcon', {
          show: res.selfItem !== true,
          title: res.itemTitle,
          description: res.itemDescription,
          url: `/#/pages/share-detail/share-detail?itemId=${res.itemId}`,
          thumb: res.mainImgUrl
        });
      }
    })
  }

  shopDetail = (itemId) => {
    Model.goods.shopDetail({ itemId }).then(res => {
      if (res) {
        console.log('为啥点击规格会变', res);
        let d = (res && res.sku) || {}
        d.agentStatus = res.agentStatus
        this.setState({
          mainUrl: res.mainImgUrl,
          goodsDetail: res, //详情数据
          defalutDetail: res.sku && res.sku.propsList || null, //默认规格
          defalutImgMes: d,   //默认商品
          skuList: res.propsList, //规格列表
          noArea: res.noArea || [],
          tagList: this.dealTag(res.tagList || []),
        })
        Utils.bridge.callhandler('setShowShareIcon', {
          show: res.selfItem !== true,
          title: res.itemTitle,
          description: res.itemDescription,
          url: `/#/pages/share-detail/share-detail?itemId=${res.itemId}`,
          thumb: res.mainImgUrl
        });
      }
    })
  }

  itemDetailShop = (itemId) => {
    Model.goods.itemDetailShop({ itemId }).then(res => {
      if (res) {
        console.log('为啥点击规格会变', res);
        let d = (res && res.sku) || {}
        d.agentStatus = res.agentStatus
        this.setState({
          mainUrl: res.mainImgUrl,
          goodsDetail: res, //详情数据
          defalutDetail: res.sku && res.sku.propsList || null, //默认规格
          defalutImgMes: d,   //默认商品
          skuList: res.propsList, //规格列表
          noArea: res.noArea || [],
          tagList: this.dealTag(res.tagList || []),
        })
        Utils.bridge.callhandler('setShowShareIcon', {
          show: res.selfItem !== true,
          title: res.itemTitle,
          description: res.itemDescription,
          url: `/#/pages/share-detail/share-detail?itemId=${res.itemId}`,
          thumb: res.mainImgUrl
        });
      }
    })
  }
  /**
   *  处理规格
  */
  dealTag = (tagList) => {
    const a = Object.entries(tagList);
    return a;
  }

  getAreaAll = ({ noArea = [] }) => {
    let str = ''
    noArea.map((item, i) => {
      str += `${i !== 0 ? '、' : ''}${item.areaName}`
      if (item.childs) {
        str += `${item.level === 0 ? ':' : ''} ${item.level === 1 ? '(' : ''}  ${this.getAreaAll({ noArea: item.childs })} ${item.level === 1 ? ')' : ''}`
      }
    })
    return str
  }

  //推荐商品列表
  // getList = (agentCompanyId) => {

  //   const { goodsDetail } = this.state
  //   if (goodsDetail && goodsDetail.agentCompanyId) {
  //     Model.goods.getRecomdList({
  //       agentCompanyId
  //     }).then(data => {
  //       if (!data) return false;
  //       this.setState({
  //         productList: data
  //       })
  //     })
  //   }

  // }

  // 收藏关注
  // getCollect = (collect) => {
  //   const { agentItemId, itemId, goodsDetail, collectStatus } = this.state;
  //   Model.goods.collect({
  //     agentItemId,
  //     itemId,
  //     agentCompanyId: goodsDetail.agentCompanyId,
  //     collect // 0:取消,1:关注
  //   }).then(data => {
  //     if (data) {
  //       this.setState({
  //         collectStatus: !collectStatus
  //       })
  //     }
  //   })

  // }
  // 关注状态
  getCollectStatus = () => {
    const { agentItemId } = this.state;
    Model.goods.isCollect({
      agentItemId
    }).then(data => {
      if (data) {
        this.setState({
          collectStatus: data
        })
      }

    })
  }

  getValueMes = (defalutDetail) => {
    const newPrice = (defalutDetail || []).map((v) => {
      return v.propertyValue
    })
    const priceMes = newPrice.join('/');
    return priceMes
  }

  getImage = (type) => {
    const { itemId, bannerList } = this.state
    Model.goods.getImage({
      bizId: itemId,
      bizType: 'item',
      type
    }).then(data => {
      if (!data) return false
      if (type == 'oneToOne') {
        this.setState({
          bannerList: data.records
        }, () => {
          this.getImage('shortVideo');
        })
      } else if (type == 'phoneDetail') {
        this.setState({
          imgList: data.records
        })
      } else if (type == 'shortVideo' && data.records.length !== 0) {
        const newVideoImg = bannerList[0].url;
        bannerList.shift();
        bannerList.unshift(data.records[0]);
        console.log('bannerList', bannerList);
        this.setState({
          bannerList: bannerList,
          newVideoImg: newVideoImg,
        }, () => {
          const { bannerList } = this.state;
        })
      }

    })
  }
  // goUrl = (type) => {
  //   const { companyId } = this.state
  //   if (type == 'home') {
  //     Taro.navigateTo({
  //       url: `/pages/index/index?companyId=${companyId}`
  //     })
  //   } else {
  //     Taro.navigateTo({
  //       url: `/pages/contactus/contactus`
  //     })
  //   }

  // }

  // 邀请信息
  companyCode = () => {
    Model.inviter.userCode().then(res => {
      if (res) {
        this.setState({
          mark: res.invitationCode,
        })
      }
    })
  }
  getLevel = () => {
    const { shopId } = Store.globalStore.data.userInfo
    Model.order.getShopMemberLevel({ shopId }).then(data => {
      if (!data) return;
      this.setState({
        level: Number(data)
      })
    })
  }
  goPrice = () => {
    const { goodsDetail } = this.state;
    console.log('goodsDetail', goodsDetail);
    if (goodsDetail.selfItem) {
      Utils.bridge.callhandler('selfItemEditorAction', { itemId: goodsDetail.itemId });
    } else {
      const { itemId } = this.$router.params
      Taro.navigateTo({
        url: `/pages/goods-price/goods-price?itemId=${itemId}`
      });
    }
  }

  render() {
    const { currentIndex,
      isOpenItem,
      newValue,
      isOpenShare,
      goodsDetail,
      defalutDetail,
      defalutImgMes,
      skuList,
      bannerList,
      imgList,
      windowH,
      productList,
      collectStatus,
      level,
      agentItemId,
      companyId,
      mark,
      mainUrl,
      noArea,
      noAreaModal,
      tagList,
      newVideoImg,
      autoplayItem,
    } = this.state;

    const { frompage } = this.$router.params
    console.log('defalutImgMes', defalutImgMes);
    return (
      <View className={styles.imgturn} style={{
        height: (isOpenItem || isOpenShare || noAreaModal) ? `${windowH}` : '100%'
      }
      }>
        <View className={styles.bannerImg} >
          <Swiper
            className={styles.bannerMes}
            indicatorColor='#999'
            indicatorActiveColor='#333'
            onAnimationFinish={(e) => this.handleChange(e)}
          >
            {(bannerList || []).map((item, index) => {
              return (
                <SwiperItem>
                  {item.type == 'shortVideo' ?
                    <Video
                      // ref="myVideo"
                      ref='myVideo'
                      key={index}
                      src={Utils.getFileUrl(item.url)}
                      controls={true}
                      autoplay={autoplayItem}
                      poster={`${Utils.getFileUrl(newVideoImg)}`}
                      initialTime='0'
                      auto-pause-if-navigate={true}
                      enableProgressGesture={false}
                      loop={false}
                      muted={false}
                      style={{ width: '100%', height: '100%' }}
                      showMuteBtn={true}
                      webkit-playsinline={true}
                      playsinline={true}
                    /> : null}
                  {item.type == 'oneToOne' ? <View className={styles.banner_img_items} style={{ backgroundImage: `url(${Utils.getFileUrl(item.url)})`, backgroundSize: 'contain' }} /> : null}
                </SwiperItem>
              )
            })}
          </Swiper>
          <View className={styles.numPoint}>{currentIndex}/{bannerList.length}</View>
        </View >
        <View className={styles.detailprice}>
          <View className={styles.topMes}>
            {defalutImgMes &&
              <View>
                <Text className={styles.priceLogo}>¥</Text>
                <Text className={styles.priceNum}>{frompage == 'shopworker' ? defalutImgMes.vipTradePrice : defalutImgMes.agentVipTradePrice}</Text>
              </View>}
            {level >= 2 && defalutImgMes.maxFee > 0 &&
              <View style={{ marginLeft: '10px' }}>
                <Text className={styles.getPrice}>赚¥{defalutImgMes && defalutImgMes.maxFee}</Text>
              </View>
            }

          </View>
          {/* <View className={styles.price_sales}>
            <View style={{ opacity: '0' }}>
              <Text className={styles.originPrice}>原价</Text>
              <Text className={styles.originpriceNum}>¥{defalutImgMes && defalutImgMes.agentScribingPrice}</Text>
            </View>
          </View> */}
          <View className={styles.goodsName}>
            {goodsDetail.itemTitle}
          </View>
          <View className={styles.stockQty_box}>
            <Text className={`${styles.originPrice} ${styles.volume_text}`}>总库存：</Text>
            <Text className={`${styles.originpriceNum} ${styles.volume_num}`}>
              {/* {defalutImgMes && (defalutImgMes.stockQty || 0)} */}
              {goodsDetail.totalValidStockQty || 0}
            </Text>
          </View>
        </View>
        {/* <View className={styles.detailMes}>
          <View>保障：</View>
          <View className={styles.allInner}>
            <Text>24小时发货</Text>
            <Text className={styles.backpoint}></Text>
            <Text>7天无理由退货</Text>
            <Text className={styles.backpoint}></Text>
            <Text>包邮</Text>
          </View>
        </View> */}
        <View className={styles.mes_item} onClick={() => this.rightBuy()}>
          <View className={styles.left}>
            <View className={styles.title}>规格</View>
            <View className={styles.area}>查看规格</View>
          </View>
          <View className={`iconfont ${styles.icon_more}`}>&#xe68f;</View>
        </View>
        {tagList && tagList.length > 0 &&
          <View className={styles.detailMes}>
            {tagList.map((v, index) => {
              return (
                v[1].length !== 0 ?
                  <View className={styles.inline_style} key={index + 1}>
                    <View className={styles.label}>{v[0]}：</View>
                    {
                      (v[1] || []).map((item, inx) => {
                        return <View className={styles.inline_mes} key={inx}>
                          {item}
                          {(v[1].length - 1) == inx ? null : <View className={styles.backpoint}></View>}
                        </View>
                      })
                    }
                  </View> : null
              )
            })}
          </View>
        }
        {noArea && noArea.length > 0 &&
          <View className={`${styles.mes_item}`} onClick={() => this.setState({ noAreaModal: true })}>
            <View className={styles.left}>
              <View className={styles.title}>不发货地区</View>
              <View className={styles.area}><Ellipsis count={1}>{this.getAreaAll({ noArea })}</Ellipsis></View>
            </View>
            <View className={`iconfont ${styles.icon_more}`}>&#xe68f;</View>
          </View>
        }
        {imgList.length > 0 && <View className={styles.titleGoods}>商品详情</View>}
        <View className={styles.allImg}>
          {(imgList || []).map(v => {
            return (
              <Image src={Utils.getFileUrl(v.url)} alt={v.name} />
            )
          })}
        </View>
        {/* {productList && productList.length > 0 && <View className={styles.titleGoods}>为你推荐</View>} */}

        <View>
          {/* <Item data={productList}></Item> */}
        </View>
        {/* {defalutImgMes && defalutImgMes.agentStatus == 'DOWN_SALES' && <View className={styles.off_notice}>该商品已下架，非常抱歉</View>}
        {defalutImgMes && defalutImgMes.agentStatus == 'INVALID' && <View className={styles.off_notice}>该商品已失效，非常抱歉</View>} */}
        {/* {goodsDetail.totalValidStockQty == 0 ? <View className={styles.newfootbar}>
          <View className={styles.button_style}>商品已售罄</View>
        </View> : <View className={styles.footbar}>
            <View>未上架</View>
            <View className={styles.btn_box}>
              <View className={styles.button_item} onClick={this.rightBuy}>查看规格</View>
              <View className={styles.button_item} onClick={this.goPrice}>{defalutImgMes.agentStatus == 'ON_SALES' ? '编辑商品' : '上架商品'}</View>
            </View>
          </View>
        } */}

        <View className={styles.footbar}>
          <View className={styles.status_box}>
            <View className={styles.status}>{defalutImgMes.agentStatus == 'DOWN_SALES' && '未上架'}</View>
            <View className={styles.status}>{defalutImgMes.agentStatus == 'INVALID' && '已失效'}</View>
            <View className={styles.status}>{defalutImgMes.agentStatus == 'ON_SALES' && ' 已上架'}</View>
            <View className={styles.font}>当前状态</View>
          </View>
          {goodsDetail.totalValidStockQty == 0 ?
            <View className={styles.btn_box}>
              <View className={`${styles.button_item} ${styles.gray}`}>商品已售罄</View>
            </View> :
            <View className={styles.btn_box}>
              <View className={styles.button_item} onClick={this.rightBuy}>查看规格</View>
              <View className={styles.button_item} onClick={this.goPrice}>{defalutImgMes.agentStatus == 'ON_SALES' ? '编辑商品' : '上架商品'}</View>
            </View>
          }

        </View>

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
                <View className={styles.leftPriceImg} style={{ backgroundImage: `url(${Utils.getFileUrl(defalutImgMes.skuImg)})` }} />
                <View className={styles.rightPriceBtn}>
                  <View>
                    <Text className={styles.priceLogo}>¥</Text>
                    <Text className={styles.priceNum}>{frompage == 'shopworker' ? defalutImgMes.vipTradePrice : defalutImgMes.agentVipTradePrice}</Text>
                  </View>
                  <View className={styles.selectColor}>已选：{this.getValueMes(defalutDetail)}</View>
                  <View className={styles.selectColor}>库存：{defalutImgMes.stockQty}</View>
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

        <View className={styles.share_popup}>
          <AtFloatLayout isOpened={isOpenShare} onClose={() => {
            this.setState({
              isOpenShare: false
            })
          }}>
            <View className={styles.popup_header} style={{ backgroundImage: `url(${Utils.getFileUrl(mainUrl)})` }} />
            <View className={styles.close} onClick={() => {
              this.setState({
                isOpenShare: false
              })
            }}>
              <View className="iconfont close_icon">&#xe693;</View>
            </View>
            <View className={styles.getMoney}>
              <View className={styles.money_sign}>￥</View>
              <View className={styles.money_num}>{defalutImgMes && defalutImgMes.vipTradePrice}</View>
              <View className={styles.own_money}>
                <Text>好友成单最高可赚</Text>
                <Text className={styles.sign}>￥</Text>
                <Text>{defalutImgMes && defalutImgMes.maxFee}</Text>
              </View>
            </View>
            <View className={styles.share_title}>
              {goodsDetail.itemTitle}
            </View>
            <Share params={{
              code: '11',
              link: `${Config.webHost}/#/pages/goodsdetail/goodsdetail?agentItemId=${agentItemId}&itemId=${goodsDetail.itemId}&companyId=${companyId}&mark=${mark}`
            }} />
            <View className={styles.cancalItem}>
              <View className={styles.cancalBtn} onClick={this.onCancalItem}>
                取消
              </View>
            </View>
          </AtFloatLayout>
        </View>

        <View className={styles.noArea_box}>
          <AtFloatLayout isOpened={noAreaModal} title="不发货地区" onClose={() => this.setState({ noAreaModal: false })}>
            {/* {this.getAreaAll({ noArea })} */}
            <ScrollView scrollY className={styles.area_scroll}>
              {(noArea || []).map(item =>
                <View className={styles.item}>
                  <View className={styles.title}>{item.areaName}
                    {item.childs && <View className={styles.mes}>
                      {
                        item.childs.length > 0 && (
                          this.getAreaAll({ noArea: item.childs })
                        )
                      }
                    </View>}
                  </View>
                </View>
              )}
            </ScrollView>

          </AtFloatLayout>
        </View>
      </View >
    );
  }

}

export default Goodsdetail;
