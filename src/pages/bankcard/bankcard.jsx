
import Taro from '@tarojs/taro';
import { View, Input, Text } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent, AtIcon } from "taro-ui"
import { message } from '@jxkang/wechat-utils';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import Pre from './pre';
import Utils from '@/utils';
import Shopinfo from '@/components/open-process-title';
import styles from './bankcard.module.styl';

@withPage
class Bankcard extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '绑定银行卡',
    }

    this.state = {
      // 界面/组件 初始数据
      userName: '',
      idCard: '',
      bankNum: '',
      tel: '',//
      bankName: '',//银行名称
      info: {},
      moVisible: false,
      agree: false,
      customerId: '',
      hasInfo: false,
      infoList: []
    };
  }


  getBankNum = (value) => {
    this.setState({
      bankNum: value.detail.value,
      moVisible: false
    }, () => {
      if (value.detail.value.length >= 16 && value.detail.value.length <= 19) {
        this.getBankInfo()
      } else {
        message.error('请填写正确的银行卡号')
      }

    })
    this.scroll()
  }

  getBankInfo = () => {
    // this.setState({
    //   bankName: '',
    // })
    const { bankNum } = this.state
    Model.bankcard.getBankInfo({
      bankNum
    }).then((data) => {
      if (data) {
        this.setState({
          bankName: data.bankName,
        })
      }
    })
  }

  getBind = () => {
    const { bankName, bankNum, idCard, tel, userName, agree, hasInfo, customerId } = this.state
    if (agree === false) {
      return message.error('请勾选同意开户服务协议');
    }
    const params = {
      // bankName, //'建设银行',
      // cardNum: bankNum,
      idCard,
      // userMobile: tel,
      userName,
      // requestType: 'M',
      // customerId
    }
    // let p = hasInfo === true ?
    //   Model.bankcard.localBindCard(params) :
    //   Model.bankcard.getBindCard(params)
    let p = Model.bankcard.openAccount(params)
    p.then(res => {
      if (res) {
        Taro.navigateTo({
          url: `/pages/storegrade/storegrade`
        });
        Utils.bridge.callhandler('openShopFinish');
      }
    })
  }
  userLocal = () => {
    const { userCustId } = this.state
    Model.bankcard.userLocal({
      userCustId
    }).then(res => {
      if (res) {
        Taro.navigateTo({
          url: `/pages/storegrade/storegrade`
        })
      }
    })
  }

  openXy = (e) => {
    e.stopPropagation()
    this.setState({
      moVisible: true
    })
  }

  checkUserIDNo = (e) => {
    let value = e.detail.value.trim();
    value = value.replace(/[^\dx]/ig, '');
    this.setState({
      idCard: value
    });
  }

  changeInput = (e, name) => {
    let s = e.detail.value
    if (name === 'userName') {
      s = s.replace(/[^\a-zA-Z\u4E00-\u9FA5]/g, '')
    }
    if (name === 'idCard') {
      s = s.replace(/[\W]/g, '')
    }
    if (name === 'bankNum') {
      this.setState({
        bankName: ''
      })
      s = s.replace(/\D/g, '')
    }
    this.setState({
      [name]: s,
      moVisible: false,
    })

  }
  getAgree = () => {
    const { agree } = this.state
    this.setState({
      agree: !agree,
      moVisible: false,
    })
  }
  scroll = () => {
    window.scroll(0, 0)
  }
  // accountInfo = () => {
  //   Model.bankcard.accountInfo().then(res => {
  //     if (res) {
  //       this.setState({
  //         bankName: res.bankName,
  //         bankNum: res.cardNum,
  //         idCard: res.idCard,
  //         tel: res.userMobile,
  //         userName: res.userName,
  //         customerId: res.customerId
  //       })
  //     }
  //     this.setState({
  //       hasInfo: res ? true : false
  //     })
  //   })
  // }
  canUseInfo = () => {
    Model.bankcard.canUseInfo({
      userType: 3
    }).then(res => {
      if (res && res.useListVOS) {
        // res.useListVOS = [
        //   {
        //     accountName: "海燕",
        //     createTime: 1585289617000,
        //     idCard: "310109199911110216",
        //     userCustId: "6666000000257190",
        //     userType: 3
        //   },
        //   {
        //     accountName: "海燕2",
        //     createTime: 1585289617000,
        //     idCard: "310109199911110217",
        //     userCustId: "6666000000257191",
        //     userType: 3
        //   },
        //   {
        //     accountName: "海燕3",
        //     createTime: 1585289617000,
        //     idCard: "310109199911110218",
        //     userCustId: "6666000000257192",
        //     userType: 3
        //   }
        // ]
        this.setState({
          hasInfo: true,
          infoList: res.useListVOS,
          userCustId: res.useListVOS[0].userCustId
        })
      }
    })
  }
  checkItem = (userCustId) => {
    this.setState({
      userCustId
    })
  }
  componentWillReact() { }

  componentDidMount() {
    // this.accountInfo()
    this.canUseInfo()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const {
      bankName, moVisible, userName,
      idCard,
      bankNum,
      tel,
      agree,
      infoList,
      userCustId,
      hasInfo
    } = this.state;
    const isId = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    const isPhone = /^1\d{10}$/
    
    return (
      <View className={styles.out}>
        <Shopinfo />
        <View className={styles.container}>
          {hasInfo === false && <View>
            <View className={styles.form_box}>
              <View className={`${styles.list} last`}>
                <View className={styles.label_box}>
                  <Text className={styles.symbol}>*</Text>
                  <Text className={styles.name}>真实姓名</Text>
                </View>
                <Input className={styles.insert} type='text'
                  maxLength={10}
                  onBlur={this.scroll}
                  placeholder='请输入真实姓名' value={userName} onInput={(e) => this.changeInput(e, 'userName')}></Input>
              </View>
              <View className={`${styles.list} last`}>
                <View className={styles.label_box}>
                  <Text className={styles.symbol}>*</Text>
                  <Text className={styles.name}> 身份证号</Text>
                </View>
                <Input 
                  className={styles.insert}
                  type='text'
                  value={idCard}
                  maxLength={18}
                  onBlur={e => {this.scroll();this.checkUserIDNo(e);}}
                  placeholder='请输入身份证号' onInput={(e) => this.changeInput(e, 'idCard')}></Input>
                {(!isId.test(idCard) && idCard) && <AtIcon value='alert-circle' size='20' color='#F9482E'></AtIcon>}
              </View>
            </View>
            <View className={styles.desc} onClick={this.getAgree}>
              {agree === true && <Text className={`iconfont ${styles.icon} ${styles.active}`}>&#xe628;</Text>}
              {agree === false && <Text className={styles.nocheck}></Text>}
              <Text>我已同意<Text onClick={(e) => this.openXy(e)}>《汇付天下开户服务协议》</Text></Text>
            </View>
            <View className={styles.yellow}>提示：请输入您的真实身份信息用于店铺开户收款，提现时需提供与此身份信息对应的银行卡，请谨慎填写！</View>
            {userName && isId.test(idCard) && <View className={styles.bind_btn} onClick={this.getBind}>绑定</View>}
            {(!userName || !(isId.test(idCard))) && <View className={`${styles.bind_btn} ${styles.gray}`}>绑定</View>}
          </View>}
          {hasInfo === true &&
            <View>
              <View className={styles.has_infobox}>
                <View className={styles.title}>已有账户选择</View>
                {infoList.map(item =>
                  <View className={`${styles.item} ${userCustId === item.userCustId && styles.active}`} onClick={() => this.checkItem(item.userCustId)}>
                    <View className={`iconfont ${styles.icon}`}>&#xe6cd;</View>
                    <View className={styles.right}>
                      <View className={styles.name}>{item.accountName}</View>
                      <View className={styles.idnumber}>{item.idCard}</View>
                    </View>
                  </View>
                )
                }
              </View>
              {userCustId && <View className={styles.bind_btn} onClick={this.userLocal}>确定</View>}
              {!userCustId && <View className={`${styles.bind_btn} ${styles.gray}`} >无可沿用账户</View>}
            </View>
          }
          <AtModal isOpened={moVisible}>
            <AtModalHeader>支付服务协议</AtModalHeader>
            <AtModalContent>
              <Pre></Pre>
            </AtModalContent>
          </AtModal>
        </View >
      </View>
    );
  }

}

export default Bankcard;
