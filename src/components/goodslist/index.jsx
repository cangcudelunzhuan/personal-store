import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Ellipsis } from '@jxkang/wechat-cmpt';
import Assets from '@/components/assets';
import { AtSwipeAction } from "taro-ui"
import Utils from '@/utils';
import styles from './index.module.styl';

class GoodsList extends Taro.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount() {

  }

  operatorItem = (goods, index) => {
    this.props.onChangeItem(goods, index);
  }

  upGoodsMes = (itemId, passDate) => {
    console.log(passDate);
    if (passDate != 2) {
      Taro.navigateTo({
        url: `/pages/goods-price/goods-price?itemId=${itemId}`
      })
    }
  }

  handleClick = (e, v) => {
    console.log(e, v);
    if (e.value === 1) {
      this.props.onShowConfirm(v.id)
    } else if (e.value == 2) {
      this.onSortItem(v.id);
    } else if (e.value == 3) {
      this.editorItem(e, v);
    }

  }

  handleSingle = () => {

  }

  onSortItem = (id) => {
    // e.stopPropagation();
    this.props.onShowSort(id);
  }

  editorItem = (e, v) => {
    const { herfType } = this.props;
    Taro.navigateTo({
      url: `/pages/goods-price/goods-price?itemId=${v.itemId}&herfType=${herfType}`
    })
  }

  goDetail = (detail) => {
    Taro.navigateTo({
      url: `/pages/goodsdetail/goodsdetail?itemId=${detail.itemId}&agentItemId=${detail.agentItemId}`
    })
  }


  render() {
    const { typeNum, goodsList, isSwiper } = this.props;
    // typeNum 0 右侧更多按钮 2 显示商品上架按钮 如果是2显示是灰色按钮(过期)
    // console.log('111222333',isSwiper);
    return (
      <View className={styles.goods_style}>
        {(goodsList || []).map((v, index) => {
          return (
            <AtSwipeAction
              key={index + 1}
              isOpened={v.openItem}
              disabled={isSwiper == 0 ? null : 'disabled'}
              onClick={(e) => this.handleClick(e, v)}
              onOpened={() => this.operatorItem(v, index)}
              onClosed={() => this.operatorItem(v, index)}
              options={[
                {
                  text: '下架',
                  style: {
                    backgroundColor: '#B3B3B3',
                    borderRadius: '10px 0px 0px 10px',
                  },
                  value: 1,
                },
                // {
                //   text: '排序',
                //   style: {
                //     backgroundColor: '#343434',
                //   },    
                //   value:2,
                // },
                {
                  text: '编辑',
                  style: {
                    backgroundColor: '#F9482E',
                    borderRadius: '0px 10px 10px 0px',
                  },
                  value: 3,
                }

              ]}
            >
              <View className={styles.eveInner} key={v.id}>
                <View className={styles.leftInner} onClick={() => this.goDetail(v)}>
                  <Image className={styles.leftInnerImg} src={Utils.getFileUrl(v.mainImgUrl) || Assets.home.backImage} alt='' />
                </View>
                <View className={styles.RightInner}>
                  <Ellipsis count={2} className={typeNum == 2 ? styles.titlegreyInner : styles.titleInner} onClick={() => this.goDetail(v.itemId)}>
                    {v.itemTitle}
                  </Ellipsis>
                  <View className={styles.priceInner}>
                    <View className={styles.priceMes} onClick={() => this.goDetail(v.itemId)}>
                      <View className={typeNum == 2 ? styles.prigreyLogo : styles.priLogo}>¥</View>
                      <View className={typeNum == 2 ? styles.prigreyStyle : styles.priStyle}>{v.minTradePrice}</View>
                      <View className={styles.botStyle}>¥ {v.minScribingPrice}</View>
                    </View>
                    {typeNum == 0 ? <View className={styles.pointstyle} onClick={() => this.operatorItem(v, index)}>
                      <View className={styles.point}></View>
                      <View className={styles.point}></View>
                      <View className={styles.point}></View>
                    </View>
                      :
                      <View className={typeNum == 2 ? styles.btnsgreyStyle : styles.btnsStyle} onClick={() => this.upGoodsMes(v.itemId, typeNum)}>上架商品</View>
                    }
                  </View>
                </View>
              </View>
            </AtSwipeAction>
          )
        })}
      </View>
    )
  }
}

export default GoodsList;

