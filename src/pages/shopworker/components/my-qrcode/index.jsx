/**
 * @Author: cai.ping
 * @Email: cai.ping@jdxiaokang.com
 * @Update: 2020-02-27 10:24:17
 * @Description: true
 */
import Taro from '@tarojs/taro';
import { View, Canvas } from '@tarojs/components';
import { message } from '@jxkang/wechat-utils';
import Share from '@/components/share-tool'
import Config from '@/config';
import Store from '@/store';
import Utils from '@/utils';
import Model from '@/model';
import Assets from '@/components/assets'
import styles from './myQrcode.module.styl';


// saveCanvas
const { getImageInfo, drawQrcode } = Utils;


class MyQrcode extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '我的推荐码',
    }

    this.state = {
      // 界面/组件 初始数据
      code: '',
      icon: '',//二维码中间的图片
    };
  }
  componentWillUnmount() { }

  // eslint-disable-next-line react/sort-comp
  componentWillReact() { }

  componentDidMount() {
    this.getShareImgInfo();
    this.companyCode();
  }
  getShareImgInfo = () => {
    Utils.imgshare.getBackground()
    Model.login.shopInfo().then(res => {
      if (res) {
        console.log('获取头像结果', res)
        const img = `${res.logo && res.logo.indexOf('.svg') === -1 ? Config.crossFile + res.logo : Assets.share.logo}`
        Utils.imgshare.getAvatar(img)
      }
    })
  }

  copys = () => {
    const { code } = this.state
    Taro.setClipboardData({
      data: code,
      success() {
        message.success('复制成功');
      }
    })
  }

  companyCode = () => {
    const { globalStore } = Store
    const userInfo = globalStore.data.userInfo || {}

    Model.shopInfo.companyCode().then(res => {
      if (res) {
        this.setState({
          code: res.invitationCode,
          icon: res.icon
        }, () => this.qrcodeDraw());

        const img = `${res.icon && res.icon.indexOf('.svg') === -1 ? Config.crossFile + res.icon : Assets.share.logo}`
        Utils.imgshare.getLogoImg(img)

        userInfo.invitationCode = res.invitationCode;
        globalStore.setData('userInfo', userInfo);

        this.props.withPageScope.updateShareConfig()
      }
    })
  }

  qrcodeDraw = () => {
    const { icon, code } = this.state;

    const drawCvs = (res) => {
      Taro.hideToast();
      // 自己要把canvas宽度，预先设定好，控制好定位
      drawQrcode({
        width: 200,
        height: 200,
        x: 50,
        y: 0,
        image: res ? {
          imageResource: res.el,
          hasBgRadius: true,
          dWidth: 60,
          dHeight: 60,
          dx: 120,
          dy: 70
        } : {},
        canvasId: 'sharQR',
        text: `${Config.webHost}/#/pages/guide/guide?mark=${code}`
      }, this);
    }

    let tid = null;

    message.loading('正在加载中...');

    getImageInfo({
      src: `${icon ? Config.crossFile + icon : Assets.share.logo}`
    }).then(res => {
      clearTimeout(tid);
      drawCvs(res);
    });

    tid = setTimeout(function () {
      drawCvs(null);
    }, 4000);

  }

  goList = () => {
    Taro.navigateTo({
      url: `/pages/yq-list/yq-list`
    })
  }

  componentWillUnmount() {

  }

  componentDidShow() { }

  componentDidHide() { }

  render() {

    const { code, icon } = this.state;
    // const {qrcode} = this.props;
    return (
      <View className={styles.content}>
        <View className={styles.code_box}>
          <View className={styles.black_bar}></View>
          <View className={styles.code_content}>
            <View className={styles.title}>推荐码</View>
            <View className={styles.font}>{code}</View>
            <View className={styles.copy} onClick={this.copys}>复制</View>
            <View className={styles.code_imgbox}>
              {/* <Image className={styles.img} src={qrcode}></Image> */}
              <View className={styles.img}>
                <Canvas canvasId='sharQR' style={{ height: 200 }} />
              </View>
              <View className={styles.desc}>您的专属二维码，可让您的朋友直接扫码注册</View>
            </View>
          </View>
          <Share params={{
            code,
            link: `${Config.webHost}/#/pages/guide/guide?mark=${code}`,
            icon: icon && `${Config.crossFile + icon}`,
            showShareImg: true
          }}
          >
          </Share>
          <View className={styles.yq_list_button} onClick={this.goList}>我的邀请记录</View>
        </View>
      </View >
    );
  }

}

export default MyQrcode;
