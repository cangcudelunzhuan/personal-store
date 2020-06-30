/**
 * @Author: 福虎
 * @Email: tanshenghu@163.com
 * @Update: 2020-02-27 11:30:14
 * @Description: 选货市场
 */
import Taro from '@tarojs/taro';
import { View, Image, Input } from '@tarojs/components';
import classnames from 'classnames';
import { AtTabs } from 'taro-ui'
import ListView from 'taro-listview';
import Assets from '@/components/assets';
import Empty from '@/components/empty';
import withPage from '@/components/with-page';
import List from './components/list';
import Model from '@/model';
import styles from './index.module.styl';


@withPage
class ChooseShop extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '店铺工作台',
    }

    this.state = {
      // 爆品活动
      hotData: [],
      // 分页数据 []
      datas: null,
      // 类目数据
      tabList: [],
      // 当前选中tab值
      tabCurrent: 0,
      // 爆品Dom数据信息
      hotDomRect: {},
      // 展开与收起爆品
      showHotShop: true,
      // 分页参数
      paginationParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 是否有下一页
      hasMore: true,
      // 是否正在加载中
      isLoading: false,
    };

    this.systemInfo = props.globalStore ? props.globalStore.data.systemInfo : {};

  }

  componentDidMount() {
    // 今日爆品活动
    this.getHotActive();
    // 类目数据
    this.getCatalog();
  }

  /**
   * 爆品活动
   */
  getHotActive = () => {
    Model.goods.market().then(resModel => {
      if (resModel) {
        this.setState({
          hotData: resModel,
        }, () => {
          setTimeout(() => {
            const query = Taro.createSelectorQuery();
            query.select('#hot_list').boundingClientRect();
            query.selectViewport().scrollOffset();
            query.exec((res) => {
              const { offsetHeight = 98 * resModel.length } = document.querySelector('#app>.taro_router>.taro_page:last-child #hot_list') || {};
              res[0] = res[0] || {};
              res[0].height = Math.max(res[0].height, offsetHeight);

              this.setState({ hotDomRect: Object.assign({}, res[0], res[1]) });
            });
          }, 1500);
        });
      }
    })
  }

  /**
   * 类目列表
   */
  getCatalog = () => {
    Model.goods.getCategoryListByParentId({
      parentCid: 0,
      pageNum: 1,
      pageSize: 20000,
    }).then(resModel => {
      if (resModel && Array.isArray(resModel)) {
        resModel.forEach(item => {
          item.title = item.catName;
        });
        this.state.tabList = resModel;
        this.setState({ tabList: resModel });
        this.getListData({});
      }
    })
  }

  /**
   * Tab 切换
   */
  onChangeTab = (tabCurrent) => {
    const { paginationParams, hotDomRect } = this.state;
    paginationParams.pageNum = 1;

    this.setState({
      tabCurrent,
      datas: null,
      paginationParams,
      showHotShop: true
    }, () => {
      this.getListData({ fetchType: 'onChangeTab' });
    });
  }

  /**
   * 拉列表数据
   */
  getListData = ({ pageNum, pageSize, callback }) => {
    const { tabList, tabCurrent, paginationParams, hotDomRect } = this.state;
    const params = {
      pageNum: pageNum || paginationParams.pageNum,
      pageSize: pageSize || paginationParams.pageSize,
      firstCategoryId: tabList[tabCurrent].id,
    }
    this.setState({ isLoading: true });
    Model.goods.getListByCatId(params).then(resModel => {
      if (Array.isArray(resModel)) {
        let { datas } = this.state;
        datas = datas || [];
        datas = datas.concat(resModel);

        paginationParams.pageNum += 1;

        this.setState({
          datas,
          paginationParams,
          hasMore: resModel.length >= 10,
          isLoading: false
        }, () => {
          if (callback) {
            callback()
          }
          setTimeout(function () {
            document.querySelector(`.${styles.list_view}`).scrollTop = hotDomRect.height;
          }, 500);

        });
      }
    });
  }

  /**
   * 下拉 刷新
   */
  onPullDownRefresh = () => {

  }

  /**
   * 上拉 加载更多
   */
  onScrollToLower = (fn) => {
    this.getListData({ callback: fn });
  }

  /**
   * 滚动事件
   */
  onListScroll = (e) => {
    const { scrollTop } = this.refList.state;
    const { hotDomRect, showHotShop } = this.state;
    const hotHeight = hotDomRect.height - 10;
    const nowShow = scrollTop < hotHeight;

    if (hotHeight && showHotShop !== nowShow) {
      this.setState({ showHotShop: nowShow });
    }
  }

  /**
   * 点击 上架商品 按钮
   */
  onShelves = (lineData) => {
    const itemId = lineData.itemId;
    Taro.navigateTo({
      url: `/pages/goods-price/goods-price?itemId=${itemId}`
    });
  }

  /**
   * 进入搜索列表界面
   */
  gotoSearch = () => {
    Taro.navigateTo({
      url: '/pages/hot-search/hot-search'
    });
  }

  render() {
    const { tabCurrent, datas, hotData, hotDomRect, tabList, hasMore, showHotShop, isLoading } = this.state;

    return (
      <View>
        <View className={styles.tab_paging_box}>
          {
            showHotShop ?
              null :
              <View className={classnames(styles.tab_bar, styles.fix_tab)}>
                <AtTabs
                  current={tabCurrent}
                  tabList={tabList}
                  scroll
                  onClick={this.onChangeTab}
                />
              </View>
          }
          <ListView
            ref={node => this.refList = node}
            isLoaded={!isLoading}
            hasMore={hasMore}
            style={{ height: this.systemInfo.screenHeight - 40 }}
            className={styles.list_view}
            // isEmpty={datas && datas.length===0}
            launch={{
              launchEmpty: true
            }}
            renderEmpty={<View className={styles.grid_empty}><Empty /></View>}
            // onPullDownRefresh={this.onPullDownRefresh}
            onScrollToLower={this.onScrollToLower}
            onScroll={this.onListScroll}
          >
            <View className={styles.hot_list} id="hot_list" style={{ height: hotDomRect.height }}>
              <View className={styles.search_box} onClick={this.gotoSearch}>
                <View className={`iconfont iconsousuo ${styles.search_icon}`} />
                <Input type="text" placeholder="请输入商品名称" />
              </View>
              <View>
                <Image src={Assets.shop.hotBanner} className={styles.hot_banner} mode="widthFix" />
              </View>
              <List
                data={hotData}
                onShelves={this.onShelves}
              />
            </View>
            {/** 爆品分割 */}
            <View className={classnames(styles.tab_bar, { [styles.hidden_bar]: !showHotShop })}>
              <AtTabs
                current={tabCurrent}
                tabList={tabList}
                scroll
                onClick={this.onChangeTab}
              />
            </View>
            {/** tab 列表数据 */}
            <View className={styles.list_content_box}>
              {
                datas && datas.length === 0 ?
                  <View className={styles.grid_empty}><Empty msg="" /></View> : null
              }
              <List
                data={datas}
                onShelves={this.onShelves}
              />
            </View>
          </ListView>
        </View>
      </View>
    );
  }
}

export default ChooseShop;
