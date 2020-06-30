/**
 * @Author: chunxiao.zhang
 * @Email: chunxiao.zhang@jdxiaokang.com
 * @Update: 2020-02-27 17:25:34
 * @Description: 店铺信息
 */
import Taro from '@tarojs/taro';
import { View, Text, Input, Image } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import styles from './storeinfo.module.styl';
import Mask from '@/components/mask';
import { message } from '@jxkang/wechat-utils';
import Upload from '@/components/upload'
import Utils, { getFileUrl } from '@/utils'
import { AtIcon } from "taro-ui"

@withPage
class Storeinfo extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '店铺工作台',
    }

    this.state = {
      // 界面/组件 初始数据
      before: false,//之前
      mask: false,
      logo: '',
      shopName: '',
      contacts: '',
      phone: '',
      weixnNo: '',
      weixnQrCode: '',
    };
  }

  getInfo = () => {
    Model.login.shopInfo().then(res => {
      if (res) {
        this.setState({
          ...res,
        })
        this.wxup.setState({
          files: res.weixnQrCode ? [{ url: getFileUrl(res.weixnQrCode) }] : []
        })
      }
    })
  }

  saveInfo = () => {
    const {
      logo,
      shopName,
      contacts,
      phone,
      weixnNo,
      weixnQrCode
    } = this.state
    Model.shopInfo.updateBaseInfo({
      logo,
      shopName,
      contacts,
      phone,
      weixnNo,
      weixnQrCode
    }).then(res => {
      if (res) {
        Utils.bridge.callhandler('finish');
        message.success('已修改')
        Taro.navigateTo({
          url: `/pages/shopworker/shopworker`
        })
      }
    })
  }

  change = (e, name) => {
    let s = e.detail.value
    if (name === 'phone') {
      s = s.replace(/[^\d]/g, '')
    } else
      if (name === 'shopName') {
        s = s.replace(/[^\a-zA-Z\u4E00-\u9FA5\d]/g, '')
      }
      else if (name === 'contacts') {
        s = s.replace(/[^\a-zA-Z\u4E00-\u9FA5]/g, '')
      }
    this.setState({
      [name]: s
    })
  }

  removeWx = () => {
    this.setState({
      weixnQrCode: ''
    })
  }

  successWx = (url) => {
    this.setState({
      weixnQrCode: url
    })
  }

  removeLogo = () => {
    this.setState({
      logo: ''
    })
  }

  successLogo = (url) => {
    this.setState({
      logo: url
    })
  }

  componentWillReact() { }

  componentDidMount() {
    this.getInfo()
  }

  scroll = () => {
    window.scroll(0, 0)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { mask, logo, shopName, contacts, phone, weixnNo, weixnQrCode, } = this.state;
    const isPhone = /^1\d{10}$/
    return (
      <View>
        {/**
         * 填写信息
         */}
        <View className={styles.after}>
          <View className={`${styles.list} last ${styles.logo_box}`}>
            <Text>店铺头像</Text>
            <Image className={`${styles.head_img}`} src={getFileUrl(logo) || Assets.register.logo} />
            <View className={styles.pick_box}>
              <Upload
                option={{ length: 1 }}
                maxSize={1024 * 1024 * 5}
                showList={false}
                onRemove={this.removeLogo}
                onSuccess={this.successLogo}
                ref={node => this.logoup = node}
              />
            </View>
          </View>
          <View className={`${styles.list} last`}>
            <Text>店铺名称</Text>
            <View>
              <Input
                className={styles.insert}
                type='text'
                maxLength={30}
                placeholder=''
                value={shopName}
                onBlur={this.scroll}
                onChange={(e) => this.change(e, 'shopName')}
              />
            </View>
          </View>
          <View className={`${styles.list} last`}>
            <Text>联系人</Text>
            <View>
              <Input
                className={styles.insert}
                maxLength={10}
                type='text'
                onBlur={this.scroll}
                placeholder='请输入联系人'
                value={contacts}
                onChange={(e) => this.change(e, 'contacts')}
              />
            </View>
          </View>
          <View className={`${styles.list} last`}>
            <Text>联系人电话</Text>
            <View className={styles.has_errorline}>
              <Input
                className={styles.insert}
                type='text'
                placeholder='请输入联系人电话'
                value={phone}
                maxLength={11}
                onBlur={this.scroll}
                onChange={(e) => this.change(e, 'phone')}
              />
              {(!isPhone.test(phone) && phone) && <AtIcon value='alert-circle' size='20' color='#F9482E' className={styles.icon}></AtIcon>}
            </View>
          </View>
          <View className={`${styles.list} last`}>
            <Text>店铺微信号</Text>
            <View>
              <Input
                className={styles.insert}
                type='text'
                placeholder='请输入微信号'
                value={weixnNo}
                onBlur={this.scroll}
                onChange={(e) => this.change(e, 'weixnNo')}
              />
            </View>
          </View>
          <View className={`${styles.list_one} last ${styles.wx_box}`}>
            <Text>微信二维码</Text>
            <Upload
              option={{ length: 1 }}
              maxSize={1024 * 1024 * 5}
              onRemove={this.removeWx}
              onSuccess={this.successWx}
              logger={this.logger}
              onClick={() => this.setState({ mask: true })}
              ref={node => this.wxup = node}
            />
          </View>
          {shopName && contacts && isPhone.test(phone) && <View className={styles.save_btn} onClick={this.saveInfo} >保存</View>}
          {(!shopName || !contacts || !isPhone.test(phone)) && <View className={`${styles.save_btn} ${styles.gray_button}`}>保存</View>}
        </View>
        {
          mask && <Mask url={weixnQrCode} onClose={() => this.setState({ mask: false })} />
        }
      </View >
    );
  }

}

export default Storeinfo;
