/**
 * @Author: cai.ping
 * @Email: cai.ping@jdxiaokang.com
 * @Update: 2020-05-25 14:01:45
 * @Description: 订单搜索界面
 */
import Taro from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import { message } from '@jxkang/wechat-utils';
import styles from './order-search.module.styl';



@withPage
class Search extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '订单查询',
    }

    this.state = {
      // 界面/组件 初始数据
      showList: false,
      type: 2,
      value: '',
      typelist: [
        {
          name: '商品名称',
          type: 2
        },
        {
          name: '订单编号',
          type: 1
        },
        {
          name: '收货人',
          type: 3
        },
        {
          name: '电话',
          type: 4
        },
      ],
      taglist: [
        {
          value: 'x',
          key: 'orderNo',
          queryType: 1
        },
      ]
    };
  }
  taggleTip = () => {
    const { showList } = this.state
    this.setState({
      showList: !showList
    })
  }
  setType = (type) => {
    this.setState({
      type,
      showList: false
    })
  }

  goOrder = () => {
    const { isSelf = 1 } = this.$router.params
    const { value, type, isYun, taglist } = this.state
    // let orderSearchHistory = isOrder===1?(Taro.getStorageSync('orderSearchHistory') || []):;
    const tagArr = taglist.reverse()
    let key = 'orderNo'
    if (type === 1) {
      key = 'orderNo'
    } else if (type === 2) {
      key = 'itemName'
    } else if (type === 3) {
      key = 'consigneeName'
    } else if (type === 4) {
      key = 'phone'
    }
    if (!value) {
      message.error('请输入关键字')
      return
    }
    tagArr.map((item, i) => {
      if (item.queryType === type && item.value === value) {
        tagArr.splice(i, 1)
      }
    })
    tagArr.push({ key, queryType: type, value })
    if (isYun === 1) {
      Taro.setStorageSync('orderSearchHistory', tagArr);
    } else if (isYun === 2) {
      Taro.setStorageSync('yunCangSearchHistory', tagArr);
    }
    Taro.navigateTo({
      url: `/pages/my-order/my-order?isSearchResult=2&isYun=${isYun}&isSelf=${isSelf}&queryType=${type}&${key}=${value}`
    })
  }
  setValue = (e) => {
    const { value } = e.target
    let s = value.replace(/(^\s*)|(\s*$)/g, '')
    s = s.substr(0, 20)
    this.setState({
      value: s
    })
  }
  setTag = (item) => {
    this.setState({
      value: item.value,
      type: item.queryType
    })
  }
  clearHistory = () => {
    const { isYun } = this.state
    if (isYun === 1) {
      Taro.setStorageSync('orderSearchHistory', []);
    } else if (isYun === 2) {
      Taro.setStorageSync('yunCangSearchHistory', []);
    }
    this.setState({
      taglist: []
    })
  }

  componentWillReact() { }

  componentDidMount() {
    const orderSearchHistory = Taro.getStorageSync('orderSearchHistory') || [];
    const yunCangSearchHistory = Taro.getStorageSync('yunCangSearchHistory') || [];
    let { isYun = 1 } = this.$router.params
    isYun = Number(isYun)
    this.setState({
      isYun,
      taglist: isYun === 1 ? orderSearchHistory.reverse() : yunCangSearchHistory.reverse()
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { showList, type, typelist, taglist, value } = this.state;
    const i = typelist.findIndex(r => r.type === type)
    return (
      <View className={styles.out}>
        <View className={styles.back}></View>
        <View className={styles.search_box}>
          <View className={styles.left}>
            <View className={styles.search_type} onClick={this.taggleTip}>
              {typelist[i].name}
              <View className={`iconfont ${styles.icon} ${showList === true && styles.down}`}>&#xe643;</View>
              {showList && <View className={styles.tip_box}>
                {typelist.map((item, index) =>
                  <View className={styles.item} onClick={() => this.setType(item.type)}>{item.name}</View>
                )}
              </View>}
            </View>
            <Input className={styles.input} placeholder='请输入' value={value} onInput={this.setValue}></Input>
            {value && <View className={`iconfont ${styles.delete}`}
              onClick={() => { this.setState({ value: '' }) }}>&#xe679;</View>}
          </View>
          <View className={`${styles.red} ${styles.search_buttton}`} onClick={this.goOrder}>搜索</View>
        </View>
        {taglist.length > 0 && <View className={styles.tags_box}>
          <View className={styles.title_box}>
            <View>历史搜索</View>
            <View className={`iconfont ${styles.icon}`} onClick={this.clearHistory}>&#xe6f8;</View>
          </View>
          <View className={styles.tags_content}>
            {taglist.slice(0, 20).map((item, index) =>
              <View className={styles.item} onClick={() => this.setTag(item)}>
                {item.value.substr(0, 20)}
                {item.value.length > 20 ? '....' : ''}
              </View>
            )}
          </View>
        </View>}
      </View >
    );
  }

}

export default Search;
