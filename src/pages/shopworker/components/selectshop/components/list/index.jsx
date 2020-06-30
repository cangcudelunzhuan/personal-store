/**
 * @Author: 福虎
 * @Email: tanshenghu@163.com
 * @Update: 2020-02-27 11:30:14
 * @Description: 选货市场
 */
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { Ellipsis } from '@jxkang/wechat-cmpt';
import Utils from '@/utils';
import styles from './index.module.styl';


const List = function ({
  data = [],
  onShelves = (lineData, e) => {
    e.preventDefault()
    e.stopPropagation()
    const { itemId } = lineData
    Taro.navigateTo({
      url: `/pages/goods-price/goods-price?itemId=${itemId}`
    });
  },
  goDetail = (itemId) => {
    Taro.navigateTo({
      url: `/pages/goodsdetail/goodsdetail?itemId=${itemId}`
    })
  }
}) {

  return Array.isArray(data) && data.map((item, idx) => (
    <View key={idx + 1} className={styles.shop_items} >
      <View className={styles.shop_img} onClick={() => goDetail(item.itemId)}>
        <Image
          src={Utils.getFileUrl(item.mainImgUrl, { w: 95, height: 95 })}
          className={styles.image}
        />
        {item.totalValidStockQty == 0 ? <View className={styles.saleEnd}>
          <Image className={`${styles.saleEnd_img} no-loading`} src='https://jxkcdn.jingxiaokang.com/assets/images/1592272572984_6193.png'>
          </Image>
        </View> : ''}

      </View>
      <View onClick={(e) => goDetail(item.itemId)}>
        <View className={styles.shop_title}>
          <Ellipsis count={2}>
            {
              item.itemTitle
            }
          </Ellipsis>
        </View>
        <View className={styles.price_box}>
          <Text className={styles.now_price}>
            ¥
            {
              item.minTradePrice
            }
          </Text>
          <Text className={styles.old_price}>
            ¥
            {
              item.minScribingPrice
            }
          </Text>
        </View>
      </View>
      <View className={styles.handler_box}>
        <View className={styles.up_shop_btn} onClick={(e) => onShelves(item, e)}>上架商品</View>
      </View>
    </View>
  ));

};

export default List;