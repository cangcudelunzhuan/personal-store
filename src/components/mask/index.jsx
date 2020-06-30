import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { getFileUrl } from '@/utils'
import styles from './index.module.styl';


class Mask extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '查看微信二维码',
    }

    this.state = {
      // 界面/组件 初始数据
    };
  }
  render() {
    const { url } = this.props;
    
    return (
      <View className={styles.container}>
        <View className={styles.main}>
          <View className={styles.code_box}>
            <View className={styles.code}>
              <Image src={getFileUrl(url)} className={styles.img} mode='widthFix' />
            </View>
          </View>
          <View className={styles.change_code} onClick={this.props.onClose}>关闭</View>
        </View>
      </View>
    )
  }
}


export default Mask
