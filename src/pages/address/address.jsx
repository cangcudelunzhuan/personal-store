/**
 * @Author: cai.ping
 * @Email: cai.ping@jdxiaokang.com
 * @Update: 2020-02-24 15:57:31
 * @Description: 地址管理
 */
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import { message } from '@jxkang/wechat-utils';
import Assets from '@/components/assets';
import Empty from '@/components/empty';
import styles from './address.module.styl';


@withPage
class Address extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '地址管理',
    }

    this.state = {
      // 界面/组件 初始数据
      listObj: [],
      checkObj: null
    };
  }

  goEdit = (id, e) => {
    e.stopPropagation()
    const { backUrl = '', afterSaleNo = '' } = this.$router.params
    if (id === 'add') {
      Taro.navigateTo({
        url: `/pages/edit-address/edit-address?backUrl=${backUrl}&afterSaleNo=${afterSaleNo}`
      })
    } else {
      Taro.navigateTo({
        url: `/pages/edit-address/edit-address?backUrl=${backUrl}&id=${id}&afterSaleNo=${afterSaleNo}`
      })
    }

  }

  getList = () => {
    Model.address.getList().then(data => {
      if (data && data.totalRecordSize > 0) {
        const { records = [] } = data
        const i = data.records.findIndex(r => r.isDefault === true)
        this.setState({
          listObj: records,
          checkObj: records[i >= 0 ? i : 0]
        })
      }

    })
  }

  checkItem = (item) => {
    // const { globalStore } = this.props;
    // const { backUrl = '' } = this.$router.params
    // item.address = item.address || item.house || '服务器没给你地址，找后端-选地址'
    this.setState({
      checkObj: item
    })
    // if (backUrl && backUrl !== '') {
    //   globalStore.setData('checkAddress', Object.assign({}, item), 'address.jsx,line:62')
    //   Taro.reLaunch({
    //     url: backUrl
    //   })
    // }
  }
  agreeAction = () => {
    const { afterSaleNo = '' } = this.$router.params
    const { checkObj } = this.state
    Model.order.agreeAction({
      agree: true,
      afterSaleNo,
      province: checkObj.province,
      city: checkObj.city,
      area: checkObj.area,
      street: checkObj.street,
      detailAddress: checkObj.house,
      receiveName: checkObj.receiver,
      receivePhone: checkObj.phone
    }).then(res => {
      if (res === true) {
        message.success('退货处理成功，自动返回列表页')
        setTimeout(() => {
          Taro.navigateTo({
            url: '/pages/my-order/my-order?index=0&isOrder=2&isSelf=2'
          })
        }, 1000)
      } else if (res === false) {
        message.error('操作失败')
      }
    })
  }

  componentWillReact() { }

  componentDidMount() {
  }

  componentWillUnmount() { }

  componentDidShow() {
    this.getList()
  }

  componentDidHide() { }

  render() {
    const { listObj, checkObj } = this.state;

    return (
      <View className={styles.content}>
        <View className={styles.back}></View>
        {
          listObj && listObj.length > 0 && listObj.map(item =>
            <View className={styles.item}>
              <View className={styles.left} onClick={() => this.checkItem(item)}>
                {item.id === checkObj.id ?
                  <View className={`iconfont ${styles.icon_ck} ${styles.active_icon}`}>&#xe6af;</View> :
                  <View className={`iconfont ${styles.icon_ck}`}>&#xe6a6;</View>
                }
                <View className={styles.name_box}>
                  <Text className={styles.name}>{`${item.receiver}`.substr(0, 10)}{item.receiver.length > 10 ? '...' : null}</Text>
                  <Text className={styles.tel}>{item.phone}</Text>
                  {item.isDefault && <Text className={styles.tag}>默认</Text>}
                </View>
                <Text className={styles.gray}>{item.address}</Text>
              </View>
              <View className={`iconfont icondizhibianji`} onClick={(e) => this.goEdit(item.id, e)}></View>
            </View>
          )
        }
        {
          listObj && listObj.length > 0 && < View className={styles.button_box}>
            <View className={styles.button} onClick={(e) => this.goEdit('add', e)}>新增收货地址</View>
            {checkObj && <View className={`${styles.button} ${styles.red}`} onClick={this.agreeAction} >确认地址</View>}
          </View>
        }
        {listObj && listObj.length == 0 && <View>
          <Empty
            msg="您还未设置过收货地址呢～"
            type={3}
          />
          <View className={styles.add_btn} onClick={(e) => this.goEdit('add', e)}>新增地址</View>
        </View>}

      </View >
    );
  }

}

export default Address;
