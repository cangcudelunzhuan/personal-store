import Taro, {Component} from '@tarojs/taro';
import {View, Image} from '@tarojs/components';
import ListView, { LazyBlock } from 'taro-listview';
import Empty from '@/components/empty';

const blankList = [{
  author: {},
  title: 'this is a example',
},{
  author: {},
  title: 'this is a example',
},{
  author: {},
  title: 'this is a example',
},{
  author: {},
  title: 'this is a example',
}]
let pageIndex = 1;

export default class Index extends Component {
  state = {
    isLoaded: false,
    error: false,
    hasMore: true,
    isEmpty: false,
    list: blankList,
  };

  config = {
    navigationBarTitleText: '列表组件测试列表',
  }

  getData = (pIndex = pageIndex) => {
    if (pIndex === 1) this.setState({isLoaded: false})
    return Taro.request({
      url: 'https://cnodejs.org/api/v1/topics',
      data: {
        limit: 10,
        page: pIndex
      }
    })
  };

  componentDidMount() {
    this.refList.fetchInit()
  }

  pullDownRefresh = (rest) => {
    pageIndex = 1;
    return this.getData(1).then(resModel => {
      this.setState({list: resModel.data.data});
      rest()
    });
  };

  onScrollToLower = (fn) => {
    const {list} = this.state;
    return this.getData(++pageIndex).then(resModel => {
      this.setState({
        list: list.concat(resModel.data.data),
        hasMore: resModel.data.hasMore
      });
      fn();
    });
  };

  refList = {};

  insRef = (node) => {
    this.refList = node;
  };

  render() {
    const {isLoaded, error, hasMore, isEmpty, list} = this.state;
    
    return (
        <View className='skeleton lazy-view'>
          <ListView
            // lazy
            ref={node => this.insRef(node)}
            // isLoaded={isLoaded}
            isError={error}
            hasMore={hasMore}
            style={{height: '100vh'}}
            isEmpty={isEmpty}
            onPullDownRefresh={fn => this.pullDownRefresh(fn)}
            onScrollToLower={this.onScrollToLower}
            renderCustomizeLoading={(<View>自定义</View>)}
            customizeLoading
            launch={{
              launchEmpty: true
            }}
            renderEmpty={<View className={styles.empty_box}><Empty /></View>}
          >
            {list.map((item, index) => {
              return (
                  <View className='item skeleton-bg' key={index}>
                    
                      <Image className='avatar skeleton-radius' src="https://jxkcdn.jingxiaokang.com/assets/images/1583378791998_2415.png" />
                    
                    <View className='box'>
                      <View className='tab'>{item.tab}{item.visit_count}次</View>
                      <View className='time'>{item.create_at}</View>
                      <View className='content'>
                        {item.content}
                      </View>
                      <View className='title skeleton-rect'>
                        {item.title}
                      </View>
                    </View>
                  </View>
              )
            })}
          </ListView>
        </View>
    )
  }
}