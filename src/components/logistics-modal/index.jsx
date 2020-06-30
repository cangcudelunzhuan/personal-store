import Taro from '@tarojs/taro';
import { View, Input, ScrollView } from '@tarojs/components';
import { AtModal, AtModalContent, AtModalAction, } from "taro-ui";
import Model from '@/model';
import { message } from '@jxkang/wechat-utils';
import styles from './index.module.styl';


class Collect extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '',
    }

    this.state = {
      // 界面/组件 初始数据
      shareVisible: false,
      listShow: false,
      company: '',
      list: [
        {
          name: '顺丰速运'
        },
        {
          name: '圆通速递'
        },
        {
          name: '申通速递'
        },
        {
          name: '韵达快递'
        },
        {
          name: '中通速递'
        },
        {
          name: '百世汇通'
        },
      ],
      value: ''
      // screenWidth: '',
      // screenHeight: '',

    };
  }
  componentDidMount() {
    const that = this
    Taro.getSystemInfo({
      success: function (res) {
        that.setState({
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight
        })
      }
    })
  }
  setCompany = (name) => {
    this.setState({
      company: name,
      listShow: false
    })
  }
  ok = () => {
    const { value, company } = this.state
    if (!value || !company) {
      message.error('请填写完整物流信息')
      return false
    }
    this.hide()
    this.props.onOK({ company, value })
  }
  show = () => {
    this.setState({
      shareVisible: true
    })
  }
  hide = () => {
    this.setState({
      shareVisible: false,
      listShow: false,
    })
  }

  matchLogisticsCompany = () => {
    const { value } = this.state
    if (value) {
      Model.order.matchLogisticsCompany({
        deliveryNo: value
      }).then(res => {
        if (res) {
          this.setState({
            company: res.expName
          })
        }
      })
    }
  }



  render() {
    const { shareVisible, company, list, listShow, value } = this.state;
    // const { isFromModal } = this.props.params
    return (
      <View className={styles.out}>

        {/* 分享微信 */}

        <AtModal isOpened={shareVisible} onClose={() => this.hide()} >
          {/* <AtModalHeader>标题</AtModalHeader> */}
          <AtModalContent>
            <View className={styles.line}>
              <View className={styles.label}>物流单号</View>
              <View className={styles.input}><Input className={styles.inner} value={value}
                onInput={(e) => this.setState({ value: e.target.value, company: '' })}
                onBlur={this.matchLogisticsCompany}
              ></Input></View>
            </View>
            <View className={styles.line}>
              <View className={styles.label}>物流公司</View>
              <View className={styles.input}>
                <Input className={styles.inner} value={company}
                  onInput={(e) => this.setState({ company: e.target.value })}
                ></Input>
                {/* {company.substr(0, 10)}{company.length > 10 && '...'} */}
                {/* <View className={`${styles.icon} iconfont`}>&#xe68f;</View> */}
              </View>
            </View>
          </AtModalContent>
          <AtModalAction>
            <View className={styles.button_box}>
              <View className={styles.item} onClick={() => this.hide()}>取消</View>
              <View className={`${styles.item} ${styles.red}`} onClick={this.ok}>确定</View>
            </View>
          </AtModalAction>

        </AtModal>
        {
          listShow && shareVisible && <ScrollView className={styles.scroll_content} scrollY>
            {list.map((item, i) => <View key={i + 1} className={styles.item} onClick={() => this.setCompany(item.name)}>{item.name}</View>)}
          </ScrollView>
        }
      </View >


    );
  }

}

export default Collect;
