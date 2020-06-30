
import Taro from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import ListView, { LazyBlock } from 'taro-listview';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import Empty from '@/components/empty';
import styles from './yq-list.module.styl';
import { Common } from '@jxkang/wechat-utils';
import { getFileUrl } from '@/utils'


@withPage
class Success extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '我的邀请记录',
    }

    this.state = {
      // 界面/组件 初始数据
      list: [],
      screenHeight: '',
      isLoaded: false,
      error: false,
      hasMore: true,
      isEmpty: false,
      pageNum: 1
    };
  }

  getData = ({ pageNum = 1, pageSize = 15, callback }) => {
    Model.shopInfo.companyRecords({
      pageNum,
      pageSize
    }).then(res => {
      if (res) {
        const { list } = this.state
        const l = list.concat(res.records)
        this.setState({
          isLoaded: true,
          isShow: true,
          list: l,
          hasMore: res.hasNextPage === true,
          pageNum: res.pageNum,
          isEmpty: l.length <= 0
        })
        if (callback) {
          callback()
        }
      }

    })
  }
  onScrollToLower = (fn) => {
    let { pageNum } = this.state;
    this.state.pageNum += 1
    this.getData({ pageNum: this.state.pageNum, callback: fn })
  };
  onPullDownRefresh = (fn) => {
    this.setState({
      list: []
    }, () => this.getData({ callback: fn }))
  }
  componentWillReact() { }

  componentDidMount() {
    const that = this
    Taro.getSystemInfo({
      success: function (res) {
        that.setState({
          // screenWidth: res.screenWidth,
          screenHeight: res.screenHeight,
          // type: Number(type)
        })
        that.getData({})
      }
    })
    // this.companyRecords()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const {
      isLoaded, hasMore, isEmpty, list,
      screenHeight,
    } = this.state;

    return (
      <View className={styles.list_out}>
        <ListView
          // lazy
          ref={node => this.scrollV = node}
          isLoaded={isLoaded}
          hasMore={hasMore}
          isEmpty={isEmpty}
          onScrollToLower={this.onScrollToLower}
          onPullDownRefresh={this.onPullDownRefresh}
          className={styles.scroll_content}
          style={{ height: `${screenHeight}px` }}
          launch={{
            launchEmpty: true
          }}
          renderEmpty={<View className={styles.empty_box}><Empty /></View>}
        >
          <View className={styles.container} style={{ 'min-height': `${screenHeight}px` }}>
            {
              list.map(item =>
                <View className={styles.item}>
                  <Image className={styles.img} src={getFileUrl(item.icon) || Assets.register.logo} ></Image>
                  <View className={styles.right}>
                    <View className={styles.name}>{item.inviteeName}</View>
                    <View className={styles.bottom}>
                      <Text>{item.phone.substr(0, 3)}****{item.phone.substr(7, 10)}</Text>
                      <Text>{
                        Common.dateFormat(item.invitationTime, 'yyyy-mm-dd hh:ii:ss')
                      }</Text>
                    </View>
                  </View>
                </View>
              )
            }
          </View >

        </ListView>
      </View>


    );
  }

}

export default Success;
