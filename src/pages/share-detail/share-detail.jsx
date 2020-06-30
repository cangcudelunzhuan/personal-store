/**
 * @Author: limin.zhang
 * @Email: 1196217890@qq.com
 * @Update: 2020-02-25 16:58:26
 * @Description: true
 */
import Taro from '@tarojs/taro';
import { WX } from '@/utils';
import { View, Swiper, SwiperItem, Image, Text, ScrollView, Button } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Store from '@/store';
import Config from '@/config';
import Utils from '@/utils';
import Assets from '@/components/assets';
import styles from './share-detail.module.styl';
import { Ellipsis } from '@jxkang/wechat-cmpt';
import { AtFloatLayout } from "taro-ui"

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
      goodsDetail: {},
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
      level: 1,
      isLogin: Taro.getStorageSync('userInfo') && Taro.getStorageSync('userInfo').companyId && Taro.getStorageSync('userInfo').token, //是否登陆
      mark: '',
      mainUrl: '', // 主图
      noAreaModal: false,
      showToAppTips: true,
      showLabel: true,
    };
  }

  componentWillReact() { }

  componentDidMount() {
    // WX.setWxConfig(Store.globalStore.data.envUserInfo.ticket);
    // WX.setWxConfig('kgt8ON7yVITDhtdwci0qeQ9iFv9Pf4OzQjXcS7aus6KftfHWdZHuoJ4ArWyKXuyBjgSIEVXm_pzyskfAl5ar0Q')
    this.getShopInfo()
    this.addListener()
  }
  addListener = () => {
    this.jumpBtn.addEventListener('launch', function () {
      this.setState({
        showLabel: false
      });
    });
    this.jumpBtn.addEventListener('error', function (e) {
      console.log('addEventListener error fail', e);
    });
    this.jumpBtn.addEventListener('click', function (e) {
      console.log('addEventListener click');
    });
  }
  getShopInfo = () => {
    const { itemId } = this.$router.params
    this.goodsDetail(itemId);
    this.getImage('oneToOne');
    this.getImage('phoneDetail');
  }
  goodsDetail = (itemId) => {
    Model.goods.goodsDetail({ itemId }).then(res => {
      if (res) {
        let d = (res && res.sku) || {}
        d.agentStatus = res.agentStatus
        this.setState({
          mainUrl: res.mainImgUrl,
          goodsDetail: res, //详情数据
          defalutDetail: res.sku && res.sku.propsList || null, //默认规格
          defalutImgMes: d,   //默认商品
          skuList: res.propsList, //规格列表
          noArea: res.noArea || [] // 不发货地区
        })
      }

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
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  // 轮播图切换
  handleChange = (e) => {
    this.setState({
      currentIndex: e.detail.current + 1
    })
  }
  // 查看规格
  rightBuy = (e) => {
    this.setState({
      isOpenItem: true,
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

  getValueMes = (defalutDetail) => {
    const newPrice = (defalutDetail || []).map((v) => {
      return v.propertyValue
    })
    const priceMes = newPrice.join('/');
    return priceMes
  }

  getApp = () => {
    console.log('获取App')
  }

  render() {
    const { currentIndex,
      isOpenItem,
      goodsDetail,
      defalutDetail,
      defalutImgMes,
      skuList,
      bannerList,
      imgList,
      windowH,
      noArea,
      noAreaModal,
      showToAppTips,
      showLabel
    } = this.state;
    return (
      <View className={styles.imgturn} style={{
        height: (isOpenItem || noAreaModal) ? `${windowH}` : '100%'
      }
      }>
        {showToAppTips ? <View className={styles.toApp}>
          <View className={styles.appLeft}>
            <View onClick={() => this.setState({showToAppTips : false})} className={`${styles.appColse} iconfont`}>&#xe6de;</View>
            <Image className={styles.appLogo} src={Assets.register.logo}></Image>
            <View className={styles.appLabel}>打开康小铺APP，纵享低价</View>
          </View>
          <Button className={styles.appRight}>
            <wx-open-launch-app
              appid={Config.clientAppId}
              extinfo={JSON.stringify({itemId:this.$router.params.itemId})}
              ref={node => this.jumpBtn = node}
            >
              {showLabel ? <div>点击app</div>
              : <script type='text/wxtag-template'>
                <div>立即打开</div>
              </script>}
              <template>
                <div class="btn">App内查看</div>
              </template>
            </wx-open-launch-app>
          </Button>
        </View> : null}
        < View className={styles.bannerImg} >
          <Swiper
            className={styles.bannerMes}
            indicatorColor='#999'
            indicatorActiveColor='#333'
            onChange={(e) => this.handleChange(e)}
            autoplay>
            {(bannerList || []).map((item) => {
              return (
                <SwiperItem>
                  <Image className={styles.banner_img_items} src={Utils.getFileUrl(item.url, { w: 750 })} alt={item.name} />
                </SwiperItem>
              )
            })}
          </Swiper>
          <View className={styles.numPoint}>{currentIndex}/{bannerList.length}</View>
        </View >
        <View className={styles.detailprice}>
          <View className={styles.goodsName}>
            {goodsDetail.itemTitle}
          </View>
          <View className={styles.openAppBtn}>
            <Button className={styles.btn}>
              {showLabel ? '请在康小铺APP内查看价格' : <wx-open-launch-app
                appid={Config.clientAppId}
                extinfo={JSON.stringify({itemId:this.$router.params.itemId})}
                ref={node => this.jumpBtn2 = node}
              >
                <script type='text/wxtag-template'>
                  <div>请在康小铺APP内查看价格</div>
                </script>
              </wx-open-launch-app>}
            </Button>
          </View>
        </View>
        <View className={styles.detailMes}>
          <View>保障：</View>
          <View className={styles.allInner}>
            <Text>24小时发货</Text>
            <Text className={styles.backpoint}></Text>
            <Text>7天无理由退货</Text>
            <Text className={styles.backpoint}></Text>
            <Text>包邮</Text>
          </View>
        </View>
        {noArea && noArea.length > 0 &&
          <View className={styles.mes_item} onClick={() => this.setState({ noAreaModal: true })}>
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
        {defalutImgMes && defalutImgMes.agentStatus == 'DOWN_SALES' && <View className={styles.off_notice}>该商品已下架，非常抱歉</View>}
        {defalutImgMes && defalutImgMes.agentStatus == 'INVALID' && <View className={styles.off_notice}>该商品已失效，非常抱歉</View>}
        {goodsDetail.totalValidStockQty == 0 ? <View className={styles.newfootbar}>
          <View className={styles.button_style}>商品已售罄</View>
        </View> : <View className={styles.footbar}>
            <View className={styles.button_item} onClick={this.rightBuy}>查看规格</View>
            <View className={styles.button_item}>
              {showLabel ? '上架商品' : <wx-open-launch-app
                  appid={Config.clientAppId}
                  extinfo={JSON.stringify({itemId:this.$router.params.itemId})}
                  ref={node => this.jumpBtn3 = node}
                >
                  <script type='text/wxtag-template'>
                    <div>上架商品</div>
                  </script>
                </wx-open-launch-app>}
            </View>
          </View>
        }

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
            </ScrollView>
          </AtFloatLayout>
        </View>

        <View className={styles.noArea_box}>
          <AtFloatLayout isOpened={noAreaModal} title="不发货地区" onClose={() => this.setState({ noAreaModal: false })}>
            <ScrollView scrollY className={styles.area_scroll}>
              {(noArea || []).map(item =>
                <View className={styles.item}>
                  <View className={styles.title}>{item.areaName}
                    <View className={styles.mes}>
                      {
                        item.childs && (
                          this.getAreaAll({ noArea: item.childs })
                        )
                      }
                    </View>
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
