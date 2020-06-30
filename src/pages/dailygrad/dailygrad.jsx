/**
 * @Author: qiang.zhang
 * @Email: 1196217890@qq.com
 * @Update: 2020-03-02 12:09:55
 * @Description: 今日业绩
 */
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import styles from './dailygrad.module.styl';



@withPage
class Dailygrad extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '今日业绩',
    }

    this.state = {
       currentNum:1,
    };
  }

  componentWillReact() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  arrMesshow=(index)=>{
    this.setState({
      currentNum:index
    })
  }

  dailyMes=()=>{
    return ( 
      [1,2,3,4].map(()=>{
        return (
          <View className={styles.orderMes}>
              <View className={styles.ordernum}>订单号：923878418726</View>
              <View className={styles.innerMes}>
                <View className={styles.sharePrice}>分享佣金</View>
                <View className={styles.pricenum}>
                  <View className={styles.speclogo}>￥</View>
                  <View>239.00</View>
                  </View>
              </View>
              <View className={styles.timeMes}>时间：2020-02-12 23:21:00</View>
          </View>
        )
      })
    )
  }

  dailyprice=(arrMes,index)=>{
    const {currentNum } = this.state;
    return ( 
        <View className={styles.dailyeve} onClick={()=>this.arrMesshow(index)}>
          <View className={styles.dailypricetitle}>{arrMes.title}</View>
          <View className={styles.dailyprice}>{arrMes.price}</View>
          {index==currentNum?<View className={styles.dailyborderline}></View>:""}
        </View>
    )
  }

  render() {
    const {currentNum } = this.state;

    return (
      <View className={styles.dailygrad}>
          <View className={styles.dailyMes}>
             {this.dailyprice({title:'今日营业额',price:'￥888.00'},1)}
             {this.dailyprice({title:'今日订单(个)',price:'888'},2)}
             {this.dailyprice({title:'预计收益',price:'￥888.00',},3)}
          </View>

          {/* 今日营业额 */}
          {currentNum ===1?
            <View className={styles.dailyBottom}>
                {this.dailyMes()}
                <View className={styles.sanjiao}></View>
            </View>:''
          }

          {/* 今日订单 */}
          {currentNum ===2?
           <View className={styles.dailyBottom}>
              {this.dailyMes()}
              <View className={styles.secsanjiao}></View>
           </View>:''
          }
          
          {/* 预计收益 */}
          {currentNum===3?
           <View className={styles.dailyBottom}>
            {this.dailyMes()}
            <View className={styles.thrsanjiao}></View>
           </View>:''
          }
      </View >
    );
  }

}

export default Dailygrad;
