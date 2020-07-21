/**
 * @Author: limin.zhang
 * @Email: 1196217890@qq.com
 * @Update: 2020-02-25 16:58:26
 * @Description: true
 */
import Taro from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image, Text, ScrollView, Button, Video } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Config from '@/config';
import Utils from '@/utils';
import { message } from '@jxkang/wechat-utils';
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
      VideoContext: '',
      newVideoImg: '',
      domain: process.env.NODE_ENV === 'production' ? 'https://shop-m.kangxiaopu.com' : 'https://daily-shop-m.kangxiaopu.com',
      tagList: [],
    };
  }

  componentWillReact() { }

  componentDidMount() {
    this.getShopInfo()
  }
  addListener = (e) => {
    if (e.detail.errMsg === 'launch:fail') {
      this.downloadApp()
    }
  }
  downloadApp = () => {
    window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.jdxiaokang.shop.live&g_f=undefined&from=singlemessage'
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
          noArea: res.noArea || [], // 不发货地区
          tagList: this.dealTag(res.tagList || []),
        })
      }

    })
  }
  // 处理规格
  dealTag = (tagList) => {
    const a = Object.entries(tagList);
    return a;
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

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  // 轮播图切换
  handleChange = (e) => {
    if (e.detail.current !== 0) {
      this.refs.myVideo.pause();
    } else {
      this.refs.myVideo.play();
    }
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

  checkFull = () => {
    var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
    if (isFull === undefined) isFull = false;
    return isFull;
  }

  listenVideo = () => {
    console.log(11111);
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
      domain,
      newVideoImg,
      tagList,
    } = this.state;
    
    return (
      <View className={styles.imgturn} style={{
        height: (isOpenItem || noAreaModal) ? `${windowH}` : '100%'
      }
      }>
        {showToAppTips ? <View className={styles.toApp}>
          <View className={styles.appLeft} style='height:42px;'>
            <View onClick={() => this.setState({ showToAppTips: false })} className={`${styles.appColse} iconfont`}>&#xe6de;</View>
            <Image className={styles.appLogo} src={Assets.register.squareLogo}></Image>
            <View className={styles.appLabel}>打开康小铺APP，纵享低价</View>
          </View>
          <View className={styles.appRight} style='height:42px;'>
            <View style='width:100%;height:42px;background:#F9482E;'>
              <wx-open-launch-app
                onError={(e) => this.addListener(e)}
                appid={Config.clientAppId}
                extinfo={`${domain}/#/pages/goodsdetail/goodsdetail?itemId=${this.$router.params.itemId}`}
              >
                <script type='text/wxtag-template'>
                  <button
                    style='font-size:15px;color: #ffffff;display:block;width:80px;border:0px;background:#F9482E;padding:0px;margin:0px auto;height:42px;line-height:42px;'
                  >立即打开</button>
                </script>
              </wx-open-launch-app>
            </View>
          </View>
        </View> : null}
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
                      ref="myVideo"
                      // ref={(ele, i) => this.imgRef('myVideo', index)}
                      src={Utils.getFileUrl(item.url)}
                      controls={true}
                      autoplay={false}
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
                      onFullscreenChange={(e) => this.listenVideo(e)}
                    /> : null}
                  {item.type == 'oneToOne' ? <View className={styles.banner_img_items} style={{ backgroundImage: `url(${Utils.getFileUrl(item.url)})`, backgroundSize: 'contain' }}></View> : null}
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
            <View style='width:343px;height:42px;background:#F7F8FA;'>
              <wx-open-launch-app
                onError={(e) => this.addListener(e)}
                appid={Config.clientAppId}
                extinfo={`${domain}/#/pages/goodsdetail/goodsdetail?itemId=${this.$router.params.itemId}`}
              >
                <script type='text/wxtag-template'>
                  <button
                    style='font-size:15px;color: #CCCCCC;display:block;width:336px;border:0px;background:#F7F8FA;padding:0px;line-height:42px;height:42px;margin:0px auto;'
                  >请在康小铺APP内查看价格</button>
                </script>
              </wx-open-launch-app>
            </View>
          </View>
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
        {goodsDetail.shelfStatus == 1 && goodsDetail.totalValidStockQty !== 0 ? <View className={styles.footbar}>
          <View style='font-size:15px;height:34px;line-height:34px;width:167px;' className={styles.button_item} onClick={this.rightBuy}>查看规格</View>
          <View className={styles.button_item} style='font-size:15px;height:34px;line-height:34px;width:167px;background:#332826;border-radius:4px;'>
            <wx-open-launch-app
              onError={(e) => this.addListener(e)}
              appid={Config.clientAppId}
              extinfo={`${domain}/#/pages/goodsdetail/goodsdetail?itemId=${this.$router.params.itemId}`}
            >
              <script type='text/wxtag-template'>
                <button
                  style='font-size:15px;color: #ffffff;display:block;width:167px;border:0px;background:transparent;padding:0px;line-height:34px;height:34px;margin: 0 auto;'
                >上架商品</button>
              </script>
            </wx-open-launch-app>
          </View>
        </View>
          : null
        }
        {goodsDetail.shelfStatus == 0 ? <View className={styles.newfootbar}>
          <View className={styles.off_notice}>该商品已下架，非常抱歉</View>
        </View> : null
        }
        {goodsDetail.totalValidStockQty == 0 && goodsDetail.shelfStatus == 1 ? <View className={styles.newfootbar}>
          <View className={styles.off_notice}>商品已售罄</View>
        </View> : null
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
