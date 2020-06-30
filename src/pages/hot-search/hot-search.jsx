/**
 * @Author: 福虎
 * @Email: Shenghu.tan@jdxiaokang.com
 * @Update: 2020-04-09 20:13:47
 * @Description: 爆品搜索界面
 */
import Taro from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import ListView from 'taro-listview';
import { message } from '@jxkang/wechat-utils';
import withPage from '@/components/with-page';
import Empty from '@/components/empty';
import Model from '@/model';
import Assets from '@/components/assets';
import List from '../shopworker/components/selectshop/components/list';
import styles from './hot-search.module.styl';


@withPage
class HotSearch extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '分销市场',
    }

    this.state = {
      // 界面/组件 初始数据
      datas: [],
      historySearchList: Taro.getStorageSync('historySearchList') || [],
      // 分页参数
      paginationParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: ''
      },
      // 是否有下一页
      hasMore: true,
      // 是否正在加载中
      isLoading: false,
      // 搜索过列表记录
      hasSearch: false,
    };
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
   * 拉列表数据
   */
  getListData = ({ pageNum, pageSize, reload, callback }={}) => {
    const { paginationParams, hotDomRect } = this.state;
    const params = {
      pageNum: reload ? 1 : pageNum || paginationParams.pageNum,
      pageSize: pageSize || paginationParams.pageSize,
      keyword: paginationParams.keyword || ''
    }
    this.setState({isLoading: true});
    Model.goods.elasticSearch(params).then(resModel => {
      if(Array.isArray(resModel)){
        let { datas } = this.state;
        datas = datas || [];
        datas = reload ? resModel : datas.concat(resModel);

        paginationParams.pageNum += 1;
        
        this.setState({
          datas,
          paginationParams,
          hasMore: resModel.length>=10,
          isLoading: false,
          hasSearch: true,
        },()=>{
          if(callback){
            callback()
          }
        });
      }
    });
  }

  /**
   * 上拉 加载更多
   */
  onScrollToLower = (fn) => {
    this.getListData({callback: fn});
  }

  onChangeKeyWord = (e) => {
    const {paginationParams} = this.state;
    paginationParams.keyword = typeof e === 'string' ? e : e.target.value;
    this.setState({paginationParams});

    // 点历史记录
    if(typeof e === 'string'){
      this.getListData({reload: true});
    }

  }

  onSearch = () => {
    // 历史记录
    const { paginationParams } = this.state;
    const keyword = paginationParams.keyword.trim();
    if(!keyword){
      return message.warn('请输入关键词');
    }

    const historySearchList = Taro.getStorageSync('historySearchList') || [];
    this.getListData({reload: true});
    
    if(keyword && !historySearchList.find(v => v===keyword)){
      historySearchList.push(keyword);
      Taro.setStorageSync('historySearchList', historySearchList);
    }
  }

  onCleanHistory = () => {
    Taro.setStorageSync('historySearchList', []);
    this.setState({historySearchList: []});
  }

  onCleanKeyWord = () => {
    const {paginationParams} = this.state;
    paginationParams.keyword = '';
    this.setState({
      paginationParams,
      hasSearch: false
    });
  }

  getTopHeight = () => {
    const el = document.querySelector('#app>.taro_router>.taro_page:last-child #top_search_box');
    return el ? el.offsetHeight : 36;
  }

  render() {
    const { datas, hasSearch, historySearchList, hasMore, paginationParams, isLoading } = this.state;
    const { globalStore } = this.props;
    const { systemInfo } = globalStore.data;

    return (
      <View className={styles.page}>
        <View id="top_search_box" className={styles.top_search}>
          <View className={styles.search_box}>
            <View className={`iconfont iconsousuo ${styles.search_icon}`} />
            <Input type="text" placeholder="请输入商品名称" value={paginationParams.keyword} onInput={this.onChangeKeyWord} />
            <View hidden={!paginationParams.keyword} className={`iconfont iconshanchu1 ${styles.clean_icon}`} onClick={() => this.onCleanKeyWord()} />
          </View>
          <Text className={styles.search_btn} onClick={this.onSearch}>搜索</Text>
        </View>
        {
          hasSearch || historySearchList.length===0 ? null :
        <View>
          <View className={styles.history_box}>
            <View className={styles.history_title}>搜索历史</View>
            <View className={`iconfont iconqingchu ${styles.clean_item_icon}`} onClick={this.onCleanHistory} />
            {
              historySearchList.reverse().slice(0,30).map((item,idx) => <View key={idx} className={styles.history_items} onClick={()=>this.onChangeKeyWord(item)}>{item}</View>)
            }
          </View>
        </View>
        }
        {
          hasSearch ? 
          <ListView
            ref={node => this.refList=node}
            isLoaded={!isLoading}
            hasMore={hasMore}
            style={{ height: systemInfo.screenHeight - this.getTopHeight() }}
            className={styles.list_view}
            isEmpty={datas && datas.length===0}
            launch={{
              launchEmpty: true
            }}
            renderEmpty={<View className={styles.grid_empty}><Empty msg="暂无相关商品" /></View>}
            // onPullDownRefresh={this.onPullDownRefresh}
            onScrollToLower={this.onScrollToLower}
          >
            <List
              data={datas}
              onShelves={this.onShelves}
            />
          </ListView> : null
        }
      </View >
    );
  }

}

export default HotSearch;
