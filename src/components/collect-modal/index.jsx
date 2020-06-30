import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtModal, AtModalContent } from "taro-ui";
import Assets from '@/components/assets';
import styles from './index.module.styl';


class Collect extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '',
    }

    this.state = {
      // 界面/组件 初始数据
      shareVisible: false,
      // screenWidth: '',
      // screenHeight: '',

    };
  }
  componentDidMount() {
    const that = this
    Taro.getSystemInfo({
      success: function (res) {
        that.setState({
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight
        })
      }
    })
  }




  render() {
    const { shareVisible } = this.state;
    // const { isFromModal } = this.props.params
    return (
      <View className={styles.out}>

        {/* 分享微信 */}
        <View className={`${styles.share_wx_box}`}>
          <AtModal isOpened={shareVisible}
            onClose={() => { this.setState({ shareVisible: false }) }}
          >
            <Image src={Assets.other.arrow1} className={styles.arrow}></Image>
            <AtModalContent >
              <View className={styles.share_tip_box}>
                <View className={styles.wx_shareicon}>
                  <View className={styles.icon_item}>
                    <View className={styles.icon_box}>
                      <View className='iconfont'>&#xe6d2;</View>
                    </View>
                    <View>发送给朋友</View>
                  </View>
                  <View className={styles.icon_item}>
                    <View className={styles.icon_box}>
                      <View className='iconfont'>&#xe604;</View>
                    </View>
                    <View>收藏</View>
                  </View>
                </View>
                <View className={styles.big}>微信内点击右上角就可以收藏店铺 分享给朋友和朋友圈了哦</View>
                <View className={styles.small}>分享多多，收益多多</View>
              </View>
            </AtModalContent>
          </AtModal>
        </View>

      </View >
    );
  }

}

export default Collect;
