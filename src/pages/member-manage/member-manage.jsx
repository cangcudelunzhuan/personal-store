/**
 * @Author: limin.zhang
 * @Email: limin.zhang@jdxiaokang.com
 * @Update: 2020-03-05 17:30:01
 * @Description: 会员管理
 */
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import styles from './member-manage.module.styl';



@withPage
class MemberManage extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '会员管理',
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
  goset = () => {
    Taro.navigateTo({
      url: `/pages/storegrade/storegrade?type=edit`
    })
  }
  gostore = () => {
    Taro.navigateTo({
      url: `/pages/store-member/store-member`
    })
  }
  render() {
    const { } = this.state;

    return (
      <View>
        <View className={styles.cell} onClick={this.gostore}>
          <View className={styles.cell_left}>
            <View style={{ marginRight: '10px', fontSize: '16px' }} className='iconfont iconhuiyuan'></View>
            <View className={styles.cell_title}>店铺会员</View>
          </View>
          <View className={styles.cell_right}>
            <View className='iconfont icongengduo'></View>
          </View>
        </View>

        <View className={styles.cell} onClick={this.goset}>
          <View className={styles.cell_left}>
            <View style={{ marginRight: '10px', fontSize: '16px' }} className='iconfont iconhuiyuanshezhi arrow'></View>
            <View className={styles.cell_title}>会员设置</View>
          </View>
          <View className={styles.cell_right}>
            <View className='iconfont icongengduo'></View>
          </View>
        </View>
      </View >
    );
  }

}

export default MemberManage;
