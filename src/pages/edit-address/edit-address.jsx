/**
 * @Author: cai.ping
 * @Email: cai.ping@jdxiaokang.com
 * @Update: 2020-02-24 16:40:32
 * @Description: 地址新增/修改
 */
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtForm, AtInput, AtButton, AtSwitch, AtTextarea } from 'taro-ui';
import { message, Common } from '@jxkang/wechat-utils';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import styles from './edit-address.module.styl';
import Dialog from '@/components/dialog'
import AreaPicker from '@/components/area-picker';
import Utils from '@/utils';

@withPage
class EditAddress extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '编辑地址',
    }

    this.state = {
      cityData: [],
      isPhone: true,
      phone: '',
      receiver: '',//收货人
      isDefault: false, //默认
      id: '',
      house: '',// 详细地址
      visiable: false
    };
  }

  getDetail = (id) => {
    Model.address.getDetail({ id }).then(data => {
      if (!data) return;
      this.setState({
        receiver: data.receiver,
        phone: data.phone,
        isDefault: data.isDefault,
        house: data.house,
        area: `${data.province}/${data.city}/${data.area}`,
        cityData: [
          {
            areaName: data.province,
            areaCode: data.provinceId
          }, {
            areaName: data.city,
            areaCode: data.cityId
          }, {
            areaName: data.area,
            areaCode: data.areaId
          }
        ]
      })
    })
  }

  onSubmit = (event) => {
    // const { globalStore } = this.props;
    // const { backUrl = '', first, } = this.$router.params;
    const { isPhone, isDefault, cityData, id, receiver, phone, house } = this.state
    // const { receiver, phone, area, house } = event.detail.value
    if (!receiver) {
      message.error('请填写收件人')
      return
    }
    if (!isPhone || !phone) {
      message.error('请填写正确的手机号码')
      return
    }
    if (cityData.length < 3) {
      message.error('请选择正确的省市区')
      return
    }
    if (!house) {
      message.error('请填详细的地址')
      return
    }

    const reqModel = {
      id: id ? id : '',
      receiver,
      phone,
      provinceId: cityData[0].areaCode,
      province: cityData[0].areaName,
      cityId: cityData[1].areaCode,
      city: cityData[1].areaName,
      areaId: cityData[2].areaCode,
      area: cityData[2].areaName,
      isDefault,
      house,
    }

    Model.address.addAddress(reqModel).then(data => {
      if (data) {
        message.success(id ? '修改成功' : '添加成功');
        setTimeout(() => {
          const { params } = this.$router
          delete params.id
          let str = '?'
          for (let k in params) {
            str += `${k}=${params[k]}&`
          }
          Taro.reLaunch({
            url: `/pages/address/address${str}`
          })
        }, 1000)

      }

    })
  }

  changeMoren = e => {
    this.setState({
      isDefault: e
    })
  }
  getInput = (e, name) => {
    this.setState({
      [name]: e
    }, () => {
      if (name === 'phone') {
        this.setState({
          isPhone: /^1\d{10}$/.test(e)
        })
      }

    })
  }

  // 删除地址
  delAddress = () => {
    this.setState({
      visiable: true
    })

  }

  cancle = () => {
    this.setState({
      visiable: false
    })
  }

  ok = () => {
    const { id } = this.state
    Model.address.deleteAddress({ id }).then(data => {
      if (data) {
        const { params } = this.$router
        delete params.id
        let str = '?'
        for (let k in params) {
          str += `${k}=${params[k]}&`
        }
        Taro.reLaunch({
          url: `/pages/address/address${str}`
        })
      }
    })
  }

  componentWillReact() { }

  componentDidMount() {
    const { id } = this.$router.params
    if (!id) return false;
    this.setState({
      id
    }, () => this.getDetail(id))

  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  /**
   * 城市地区选择
   */
  AreaPickerChange = (e, values) => {
    this.setState({ cityData: values });
  }

  render() {
    const { cityData,
      phone,
      isPhone,
      receiver,
      house,
      isDefault,
      id,
      visiable } = this.state;

    return (
      <View className={`${styles.edit_box}`}>
        {visiable && < Dialog cancle={this.cancle} ok={this.ok} content='是否确定删除收货地址' okText='确定删除' />}
        <AtForm
          onSubmit={this.onSubmit}
          onReset={this.onReset}
        >
          <AtInput
            name='receiver'
            title='收货人'
            type='text'
            placeholder='请输入'
            value={receiver}
            onChange={(e) => { this.getInput(e, 'receiver') }}
          />
          <AtInput
            name='phone'
            title='手机号'
            error={!isPhone}
            type='phone'
            placeholder='请输入收货人手机号'
            onChange={(e) => { this.getInput(e, 'phone') }}
            value={phone}
          />
          <View className={`${styles.area_content} last`}>
            <View className={styles.addressTitle}>所在地区</View>
            <View className={styles.area_box}>
              <AreaPicker
                onChange={this.AreaPickerChange}
              >
                <View className={styles.show_area_box}>
                  {
                    cityData.length ? cityData.map(v => v.areaName).join(' / ') : <Text className={styles.grayText}>请选择地区</Text>
                  }
                </View>
              </AreaPicker>
            </View>
            <View className={`iconfont ${styles.icon_arrow}`}>&#xe694;</View>
          </View>

          {/* <AtButton formType='submit'>提交</AtButton> */}
          <View className={`${styles.addressContainer} last`}>
            <View className={styles.addressTitle}>详细地址</View>
            <AtTextarea
              className={styles.textarea}
              name='house'
              type='text'
              placeholder='请输入街道、小区、门牌号等'
              value={house}
              onChange={(e) => { this.getInput(e, 'house') }}
              placeholderClass={styles.placeholder}
            />
          </View>
          <View className={`${isDefault === true ? styles.moren : styles.switch} last`}>
            <AtSwitch title='设为默认地址' checked={isDefault} onChange={this.changeMoren} name='isDefault' color='#FF3013' />
          </View>
          {id && <View className={`${styles.del_address} last`} onClick={this.delAddress}>
            删除收货地址
          </View>}

          <View className={styles.button_box}>
            <AtButton formType='submit'>{id ? '编辑完成' : '保存地址'}</AtButton>
          </View>
        </AtForm>
      </View >
    );
  }

}

export default EditAddress;
