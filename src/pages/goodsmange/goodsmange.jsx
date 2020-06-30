/**
 * @Author: qiang.zhang
 * @Email: 1196217890@qq.com
 * @Update: 2020-02-24 17:27:23
 * @Description: true
 */
import Taro from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import withPage from '@/components/with-page';
import GoodsList from '@/components/goodslist';
import { message } from '@jxkang/wechat-utils';
import Model from '@/model';
import Empty from '@/components/empty';
import styles from './goodsmange.module.styl';
import { AtTabs, AtTabsPane, AtFloatLayout, AtModal } from 'taro-ui'
import ListView from 'taro-listview';

@withPage
class Goodsmange extends Taro.Component {
  constructor(props) {
    super(props)

    this.state = {
      current: 0,
      showItem: 0,
      isOpenedItem: false,
      downloadgoods: [],
      pageIndex: 1,
      status: 'ON_SALES',
      hasMore: true,
      isEmpty: false,
      isOpenConfirm: false,
      sortId: '',
      sortValue: 1,
      clickMes: 1,
      downloadId: '',
    };

    this.config = {
      navigationBarTitleText: '商品管理',
    }
  }

  componentWillReact() { }

  componentDidMount() {
    this.selfList({});
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleClick(value) {
    console.log(value);
    let currentStatus;
    if (value == 0) {
      currentStatus = 'ON_SALES'
    } else if (value == 1) {
      currentStatus = 'DOWN_SALES'
    } else if (value == 2) {
      currentStatus = 'INVALID'
    }
    this.setState({
      pageIndex: 1,
      status: currentStatus,
      current: value,
      downloadgoods: [],
    }, () => {
      this.selfList({})
    })
  }



  changeSortItem = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({
        sortValue: value,
      })
    }
  }

  /**
   * @description: 分页相关
   * @param {type} 
   * @return: 
   */
  insRef = (node) => {
    this.refList = node;
  };


  onScrollToLower = (fn) => {
    let { pageIndex } = this.state;
    this.state.pageIndex += 1;
    this.selfList({ pageNo: this.state.pageIndex, callBack: fn });
  };

  selfList = ({ pageNo = 1, pageSize = 10, callBack }) => {
    const { status, downloadgoods } = this.state;
    const currentData = {
      status: status,
      pageNo,
      pageSize,
    }
    Model.goods.selfList(currentData).then(res => {
      if (!res) {
        return false;
      }
      const listArr = res.map((v, index) => {
        v.openItem = false;
        return v
      })
      this.setState({
        downloadgoods: downloadgoods.concat(listArr),
        pageIndex: pageNo,
        hasMore: !(res.length < pageSize)
      }, () => {
        const { downloadgoods } = this.state;
        if (downloadgoods.length === 0) {
          this.setState({
            isEmpty: true,
          })
        } else {
          this.setState({
            isEmpty: false,
          })
        }
        if (callBack) {
          callBack()
        }
      })
    })
  }

  handleClose = () => {
    this.setState({
      isOpenedItem: false,
    })
  }

  operatorItem = () => {
    const { showItem } = this.state;
    let showSp;
    if (showItem == 1) {
      showSp = 0
    } else {
      showSp = 1
    }
    this.setState({
      showItem: showSp
    })
  }

  showItemFooter = (id) => {
    console.log('需要排序的商品', id);
    this.setState({
      isOpenedItem: true,
      sortId: id,
    })
  }

  sortGoodsList = () => {
    const { sortId } = this.state;
    this.setState({
      isOpenedItem: false,
    })
  }

  onchangebool = (goods, index) => {
    const { downloadgoods } = this.state;
    downloadgoods[index].openItem = !downloadgoods[index].openItem;
    this.setState({
      downloadgoods: downloadgoods,
    }, () => {
      console.log('设置完成之后', downloadgoods);
    })
  }

  addItem = () => {
    const { sortValue } = this.state;
    const currentValue = sortValue + 1;
    this.setState({
      sortValue: currentValue,
      clickMes: 2,
    })
  }

  substrctItem = () => {
    const { sortValue } = this.state;
    const currentValue = sortValue - 1;
    this.setState({
      sortValue: currentValue,
      clickMes: 1,
    })
  }

  handleConfirm = () => {
    const { downloadId } = this.state;
    this.downshelf(downloadId);
  }

  downshelf = (id) => {
    const currentData = {
      agentItemId: id
    }
    Model.goods.downshelf(currentData).then(res => {
      if (res) {
        message.success('下架成功');
        this.handleClick(0);
        this.handleClose();
      }
    })
  }


  showConfirm = (id) => {
    console.log('=========', id)
    this.setState({
      isOpenConfirm: true,
      downloadId: id,
    })
  }

  handleClose = () => {
    this.setState({
      isOpenConfirm: false,
    })
  }

  render() {
    const { globalStore: { data : {systemInfo}} } = this.props;
    const { isOpenedItem, downloadgoods, current, isLoaded, hasMore, isEmpty, isOpenConfirm, sortValue, clickMes } = this.state;
    const tabList = [{ title: '在售' }, { title: '已下架' }, { title: '已失效' }];
    const screenHeight = systemInfo.windowHeight - 56;

    return (
      <View className={styles.allInner}>
        <View className={styles.fixedInner}>
          <AtTabs current={current}
            tabList={tabList}
            onClick={this.handleClick.bind(this)}
          >
          </AtTabs>
        </View>
        <View style={{ height: Taro.pxTransform(100), width: '100%' }} />
        <AtTabsPane current={current} index={current} >
          <View className={styles.dailyred}>
            <ListView
              // lazy
              ref={node => this.insRef(node)}
              isLoaded={isLoaded}
              // isError={error}
              hasMore={hasMore}
              style={{ height: screenHeight }}
              isEmpty={isEmpty}
              onPullDownRefresh={this.pullDownRefresh}
              onScrollToLower={this.onScrollToLower}
              launch={{
                launchEmpty: true
              }}
              renderEmpty={<View className={styles.empty_box}><Empty /></View>}
            >
              <View className={styles.firInner}>
                <GoodsList
                  typeNum={current}
                  isSwiper={current == 0 ? 0 : 1}
                  goodsList={downloadgoods}
                  herfType='goodsmange'
                  onChangeItem={(goods, index) => this.onchangebool(goods, index)}
                  onShowSort={(id) => this.showItemFooter(id)}
                  onShowConfirm={(id) => this.showConfirm(id)}
                ></GoodsList>
              </View>
            </ListView>
          </View>
        </AtTabsPane>
        <AtFloatLayout isOpened={isOpenedItem} onClose={() => this.handleClose()}>
          <View className={styles.topInner}>
            商品排序
          </View>
          <View className={styles.middleInner}>
            <View className={styles.btnMes}>
              <View className={styles.titleName}>排序</View>
              <Input type="number" value={sortValue} className={styles.inputstyle} onChange={(e) => this.changeSortItem(e)} />
              <View className={styles.iconaddsub}>
                <View className={`iconfont iconshangsanjiaoxing ${styles.shangsanStyle}`} style={{ color: `${clickMes == 2 ? '#CBCBCB' : null}` }} onClick={this.addItem}></View>
                <View className={`iconfont iconxiasanjiaoxing ${styles.xiasanStyle}`} style={{ color: `${clickMes == 1 ? '#CBCBCB' : null}` }} onClick={this.substrctItem}></View>
              </View>
            </View>
          </View>

          <View className={styles.fottermiddleInner}>
            <View className={styles.fotterBtnMes} onClick={this.sortGoodsList}>
              确定
            </View>
          </View>
        </AtFloatLayout>
        <AtModal
          isOpened={isOpenConfirm}
          cancelText='取消'
          confirmText='确认'
          onClose={this.handleClose}
          onCancel={this.handleClose}
          onConfirm={this.handleConfirm}
          content='是否确认下架?'
        />
      </View >
    );
  }
}

export default Goodsmange;
