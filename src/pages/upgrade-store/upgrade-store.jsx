/**
 * @Author: limin.zhang
 * @Email: limin.zhang@jdxiaokang.com
 * @Update: 2020-03-05 18:03:53
 * @Description: 升级云仓
 */
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import styles from './upgrade-store.module.styl';



@withPage
class UpgradeStore extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '升级云仓',
    }

    this.state = {
      // 界面/组件 初始数据
    };
  }

  componentWillReact() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { } = this.state;

    return (
      <View>
        <View className={styles.cell}>
          <View className={styles.cell_left}>
            <View style={{marginRight:'10px',fontSize:'16px'}} className='iconfont iconqiyerenzheng'></View>
            <View className={styles.cell_title}>企业认证</View>
          </View>
          <View className={styles.cell_right}>
            <View className='iconfont icongengduo'></View>
          </View>
        </View>

        <View className={styles.cell}>
            <View className={styles.cell_left}>
              <View style={{marginRight:'10px',fontSize:'16px'}} className='iconfont iconshengjiyuncang1'></View>
              <View className={styles.cell_title}>升级云仓</View>
            </View>
            <View className={styles.cell_right}>
              <View className='iconfont icongengduo'></View>
            </View>
        </View>
      </View >
    );
  }

}

export default UpgradeStore;
