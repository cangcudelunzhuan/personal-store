/**
 * @Author: qiang.zhang
 * @Email: 1196217890@qq.com
 * @Update: 2020-02-27 10:19:00
 * @Description: hello
 */
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import styles from './stockmarket.module.styl';
import { AtSearchBar, AtTabs, AtTabsPane} from 'taro-ui'



@withPage
class Stockmarket extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '进货市场',
    }

    this.state = {
      newValue:''
    };
  }

  componentWillReact() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onChangeSearch=()=>{

  }

  HelloMessage = (props) => {
    const { showItem } = this.state;
    return (
      <View className={styles.eveInner}>
        <View className={styles.leftInner}>

        </View>
        <View className={styles.RightInner}>
          <View className={styles.titleInner}>
            商品标题商品标题最好一行显示，最多支持商品标题商品标题最好一行显示，最多
        </View>
          <View className={styles.sharePrice}>分享赚4.5</View>
          <View className={styles.priceInner}>
            <View className={styles.priceMes}>
              <Text className={styles.priLogo}>¥</Text>
              <Text className={styles.priStyle}>999</Text>
              <Text className={styles.botStyle}>¥ 1099</Text>
            </View>
            <View className={styles.twoButton}>
              <View className={styles.shareButton}>立即分销</View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  handleClick = (value)=> {
    this.setState({
      current: value
    })
  }
  render() {
    const {newValue, current} = this.state;
    const tabList = [{ title: '首页' }, { title: '美装' }, { title: '水果' },{title:'生鲜'},
    { title: '酒水饮料' }, { title: '日用百货' }]
    return (
      <View className={styles.stockmarket}>
          <AtSearchBar
            value={newValue}
            onChange={this.onChangeSearch()}
            placeholder='请输入您要搜索的商品或类目'
          />

          <AtTabs current={current} 
            tabList={tabList} 
            scroll
            onClick={(e)=>this.handleClick(e)}
            >
              <AtTabsPane current={current} index={0} >
                <View className={styles.firInner}>
                  {this.HelloMessage()}
                </View>
              </AtTabsPane>

              <AtTabsPane current={current} index={1} >
                <View className={styles.firInner}>
                  美妆
                </View>
              </AtTabsPane>

              <AtTabsPane current={current} index={2} >
                <View className={styles.firInner}>
                  美妆
                </View>
              </AtTabsPane>

              <AtTabsPane current={current} index={3} >
                <View className={styles.firInner}>
                  美妆
                </View>
              </AtTabsPane>
          </AtTabs>
          <View className></View>
      </View >
    );
  }

}

export default Stockmarket;
