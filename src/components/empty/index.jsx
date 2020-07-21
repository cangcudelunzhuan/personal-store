/**
 * @Author: 福虎
 * @Email: tanshenghu@163.com
 * @Update: 2020-02-25 10:24:17
 * @Description: 空/暂无记录 组件
 */
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { Common } from '@jxkang/wechat-utils';
import Assets from '@/components/assets';
import styles from './index.module.styl';

function Empty({msg='暂无数据', type, top=42}){
  const emptyImgName = 'empty' + Common.seek()
  .equal(type===1, '1')
  .equal(type===2, '2')
  .equal(type===3, '3')
  .equal(type===4, '4')
  .equal(type===5, '5')
  .equal(type===6, '6')
  .equal(type===7, '7')
  .equal(type===8, '8')
  .else('')
  .get();

  return (
    <View className={styles.empty} data-msg={msg} style={{paddingTop: top}}>
      <Image className={styles.empty_img} src={Assets.common[emptyImgName]} mode='widthFix' />
    </View>
  );
}

export default Empty;