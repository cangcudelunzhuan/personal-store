import Taro from '@tarojs/taro';
import { View, Image, Canvas } from '@tarojs/components';
import { AtModal, AtModalContent } from "taro-ui";
import { message } from '@jxkang/wechat-utils';
import Utils from '@/utils';
import Store from '@/store';
import Config from '@/config';
import Assets from '@/components/assets';
import Collectmodal from '@/components/collect-modal'
import styles from './index.module.styl';



const { drawQrcode } = Utils;

class Collect extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '',
    }

    this.state = {
      // 界面/组件 初始数据
      modalVisible: false,
      tempFilePath: '',
    };
  }
  componentDidMount() { }

  openShareTip = () => {
    this.collect.setState({
      shareVisible: true
    })
  }

  copyLink = (link) => {
    Taro.setClipboardData({
      data: link,
      success() {
        message.success('复制成功');
      }
    })
  }

  drawBall = () => {
    const { code } = this.props.params;
    const { globalStore } = Store
    const { shareImgInfo } = globalStore.data
    const { background, avatar, logoImg } = shareImgInfo;
    if (!background || !avatar || !logoImg || !code) {
      Utils.imgshare.init()
      message.warn('图片未保存成功，请再试一次');
      return
    }
    this.openImageShare()
    const drawCvs = () => {
      const canvasW = 574
      const canvasH = 932
      const logoW = 60
      const avatarW = 88
      const qrCodeW = 220

      drawQrcode({
        width: 1,
        height: 1,
        x: 10,
        y: 10,
        image: background ? {
          imageResource: background,
          dWidth: canvasW,
          dHeight: canvasH,
          dx: 0,
          dy: 0
        } : {},
        canvasId: 'canvas',
        text: '',
        callback: (ctx) => {
          // 绘制头像
          const radius = parseInt(avatarW / 2, 10)
          const y = 30 // 176
          ctx.save()
          ctx.beginPath()
          ctx.arc(canvasW / 2, y + radius, radius, 0, Math.PI * 2, false)
          ctx.clip()
          ctx.drawImage(
            avatar,
            canvasW / 2 - radius,
            y,
            radius * 2,
            radius * 2,
          );
          ctx.restore()

          // 邀请码文字
          ctx.font = '26px sans-serif'
          ctx.setTextAlign('center')
          ctx.setFillStyle('#9A9A9A')
          ctx.fillText(
            '专属邀请码',
            canvasW / 2,
            y + 334,
          )

          // 邀请码
          ctx.font = 'bold 36px sans-serif'
          ctx.setTextAlign('center')
          ctx.setFillStyle('#333333')
          ctx.fillText(
            code,
            canvasW / 2,
            y + 392,
          )

          // 二维码
          drawQrcode({
            width: qrCodeW,
            height: qrCodeW,
            hasBgRadius: true,
            x: (canvasW - qrCodeW) / 2,
            y: 462,
            ctx,
            text: `${Config.webHost}/#/pages/guide/guide?mark=${code}`,
          });

          // 绘制二维码中间的logo
          ctx.drawImage(logoImg, (canvasW - logoW) / 2, 547, logoW, logoW);

          // 二维码备注
          ctx.font = '22px sans-serif'
          ctx.setTextAlign('center')
          ctx.setFillStyle('#999999')
          ctx.fillText(
            '扫描二维码注册登录康小铺',
            canvasW / 2,
            y + 720,
          )
          ctx.draw(true, () => {
            Taro.canvasToTempFilePath({
              canvasId: 'canvas',
              success: ({ tempFilePath }) => {
                this.setState({ tempFilePath: tempFilePath })
              }
            })
          });
        }
      }, this);
    }
    drawCvs()
  }

  openImageShare = () => {
    console.log('this.props', this.props.params)
    this.setState({ modalVisible: true })
  }

  closeImageShare = () => {
    this.setState({ modalVisible: false })
  }

  componentDidHide() { }

  render() {
    const { modalVisible, tempFilePath } = this.state;
    const { link, showShareImg } = this.props.params
    return (
      <View className={styles.out}>
        <View className={styles.share_box}>
          <View className={styles.item} onClick={this.openShareTip}>
            <View className={`iconfont ${styles.wx}`}>&#xe648;</View>
            <View className={styles.font}>分享微信</View>
          </View>
          {showShareImg ? <View className={styles.item} onClick={this.drawBall}>
            <View className={`iconfont ${styles.img}`}>&#xe69c;</View>
            <View className={styles.font}>生成图片</View>
          </View> : ''}

          <View className={styles.item} onClick={() => this.copyLink(link)}>
            <View className={`iconfont ${styles.link}`}>&#xe689;</View>
            <View className={styles.font}>复制链接</View>
          </View>
        </View>

        {/* 生成图片 */}
        <View className={`${styles.qrModal}`}>
          <AtModal isOpened={modalVisible} onClose={this.closeImageShare}>
            <AtModalContent>
              <View style={{ visibility: tempFilePath ? 'visible' : 'hidden' }} className={styles.share_close_container} onClick={this.closeImageShare}>
                <Image className={`${styles.share_close} no-loading`} src={Assets.common.share_close} />
              </View>
              <View className={styles.canvasImg}>
                <Image mode='widthFix' src={tempFilePath} className={styles.img}></Image>
              </View>
              <View style={{ visibility: tempFilePath ? 'visible' : 'hidden' }} className={styles.img_desc}>长按图片保存到手机</View>
            </AtModalContent>
          </AtModal>
        </View>
        {/* 分享微信 */}
        <Collectmodal ref={node => this.collect = node}></Collectmodal>
        <Canvas className={`${styles.canvas}`}
          canvasId='canvas'
          style={{ height: '932px', width: '574px' }}
        >
          抱歉哦，当前浏览器不支持生成图片功能
        </Canvas>
      </View >
    );
  }

}

export default Collect;
