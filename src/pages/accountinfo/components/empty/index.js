import Taro from '@tarojs/taro';
import { View, } from '@tarojs/components';
import withPage from '@/components/with-page';
import Assets from '@/components/assets'
import styles from './index.module.styl';


@withPage
class Empty extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '',
    }

    this.state = {
      // 界面/组件 初始数据
    };
  }
  render() {
    return (
      <View className={styles.empty} style={{ backgroundImage: `url(${Assets.account.empty})` }}>
        暂无数据
      </View>
    )
  }
}


export default Empty
