/**
 * @Author: qiang.zhang
 * @Email: 1196217890@qq.com
 * @Update: 2020-03-02 15:04:57
 * @Description: 提现
 */
import Taro from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { AtNoticebar, AtInput, AtFloatLayout } from 'taro-ui'
import { paramType, message, Common } from '@jxkang/wechat-utils';
import withPage from '@/components/with-page';
import { formHandlerChange, formatPoint } from '@/utils';
import Model from '@/model';
import Assets from '@/components/assets';
import styles from './cashout.module.styl';
import { add, subtract } from '@/utils/tointerger'



@withPage
class Cashout extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '提现',
    }

    this.state = {
      // 界面/组件 初始数据
      current: -1,
      isOpenShare: false,
      rateMes: {},
      bankList: [],
      showInfo: {},
      formData: {
        amount: '',
        selectedBank: {}
      }
    };

    // 防止重复点 提现按钮
    this.amountClick = true;
    // 数据收集事件
    this.onInputChange = formHandlerChange(this);
  }

  componentDidMount() {
    this.userbanklist();
    this.withdrawConfig();
    this.fundShow();
  }

  /**
   * 可提现金额 展示
   */
  fundShow = () => {
    Model.fund.show().then(resModel => {
      if (resModel) {
        this.setState({
          showInfo: resModel,
        })
      }
    })
  }


  /**
   * 提现服务费、手续费说明
   */
  withdrawConfig = () => {
    Model.goods.withdrawConfig().then(resModel => {
      if (resModel) {
        this.setState({
          rateMes: resModel,
        })
      }
    })
  }

  /**
   * 提现记录 列表
   */
  withdrawList = () => {
    Model.goods.withdrawList().then(res => {
      console.log(res);
    })
  }

  /**
   * 银行列表
   */
  userbanklist = () => {
    Model.bankcard.userbanklist().then(resModel => {
      if (Array.isArray(resModel)) {
        if (resModel.length > 0) {
          this.clickItem(resModel[0], 0);
        }
        this.setState({
          bankList: resModel,
          // bankList: []
        })
      }
    })
  }

  clickItem = (v, index) => {
    this.setState({
      current: index
    });
    this.onInputChange(v, 'selectedBank');
  }

  cashItem = () => {
    const { formData } = this.state;
    const Interface = this.createInterface();

    if (paramType(formData, Interface, message.warn)) {
      this.setState({
        isOpenShare: true
      })
    }
  }

  closeItem = () => {
    this.setState({
      isOpenShare: false
    })
  }

  /**
   * 计算要扣除的金额
   */
  computeOffAmount = (amount) => {
    const { rateMes } = this.state;
    return formatPoint(rateMes.withdrawServiceRate * 0.01 * amount + rateMes.withdrawFeeAmount)
  }

  /**
   * 生成数据验证规则
   */
  createInterface = () => {
    return paramType.chain()
      .add('amount')
      .rule('required', true, '请输入提现金额')
      .rule('custom', (v) => v > 0, '请输入正确的提现金额')
      .end()
      .add('selectedBank')
      .rule('required', true, '请选择提现银行卡')
      .rule('custom', (v) => !!v.id, '请选择提现银行卡')
      .end()
      .toConfig();
  }

  /**
   * 确定提现
   */
  onWithdraw = () => {
    const { formData } = this.state;
    /**
     * merPriv   用户私有域
     * 商户业务域 p_m:pc-m端,  p_b:pc-b端, p_shop:pc-服务商端,  m_h5:m端-h5
     * requestType: P、 M
     */
    const Interface = this.createInterface();

    if (paramType(formData, Interface, message.warn)) {
      if (this.amountClick === false) {
        return message.warn('不能重复点击提现');
      }
      this.amountClick = false;
      //   Model.fund.withdrawAmount({
      //     amount: formData.amount,
      //     // merPriv: 'm_h5',
      //     merPriv: `${location.origin}/#/pages/result/result`,
      //     requestType: 'M',
      //     thirdBankCardId: formData.selectedBank.bindCardId
      //   }).then(resModel => {
      //     this.amountClick = true;
      //     if (resModel) {
      //       Common.winOpen({
      //         target: '_self',
      //         type: 'post',
      //         url: resModel.url,
      //         params: {
      //           check_value: resModel.checkValue,
      //           mer_cust_id: resModel.merCustId,
      //           version: resModel.version
      //         }
      //       });
      //     }
      //   });
      // }
      Model.fund.withdrawApi({
        amount: formData.amount,
        requestType: 'M',
        merPriv: `SHOP`,
        thirdBankCardId: formData.selectedBank.bindCardId
      }).then(res => {
        this.amountClick = true;
        if (res) {
          message.success('提现申请已提交')
          Taro.navigateTo({
            url: '/pages/cashout-result/cashout-result?type=success'
          })
        }
      })
    }
  }

  onChangeAmount = (e) => {
    const { showInfo } = this.state;
    // this.onInputChange(Math.min(Math.max(0, e), showInfo.balanceAccount), 'amount');

    let s = e.replace(/[^\d.]/g, '')//去除小数点和数字以外
    s = s.replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".") //只留一个小数点
    s = s.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') //最多两位小数
    s = s > showInfo.balanceAccount ? showInfo.balanceAccount : s
    this.onInputChange(s, 'amount');
    return s
  }

  allMoney = () => {
    const { formData, showInfo } = this.state
    formData.amount = Number(showInfo.balanceAccount || 0).toFixed(2)
    this.setState({
      formData
    })
  }
  addbank = () => {
    Taro.navigateTo({
      url: '/pages/addBank/addBank'
    })
  }

  render() {
    const { current, isOpenShare, rateMes, bankList, showInfo, formData } = this.state;

    return (
      <View className={styles.cashout}>
        <AtNoticebar icon='volume-plus'>
          提现手续费：平台服务费{rateMes.withdrawServiceRate || ''}%+银行转帐手续费{rateMes.withdrawFeeAmount || ''}元
          </AtNoticebar>
        <View className={styles.pricetitle}>提现金额</View>
        <View className={styles.pricelist}>
          <AtInput
            name='amount'
            title='￥'
            type='text'
            placeholder='0.00'
            value={formData.amount}
            onChange={this.onChangeAmount}
          />
          <View className={styles.priceTop}>
            <View className={styles.canprice}>可提现金额：¥ {(Number(showInfo.balanceAccount || 0)).toFixed(2)}</View>
            <View className={styles.allCanPrice} onClick={this.allMoney}>全部</View>
          </View>
          <View className={styles.yellow}>手续费：{this.computeOffAmount(formData.amount)}元(含{rateMes.withdrawServiceRate}%平台服务费+{rateMes.withdrawFeeAmount}元提现手续费）</View>
        </View>
        <View className={styles.line}></View>
        <View className={styles.pricetitle}>
          提现到银行卡
           {bankList.length > 0 && bankList.length < 5 && <View className={styles.add_btn} onClick={this.addbank}>添加银行卡</View>}
        </View>
        {bankList.length > 0 && <ScrollView className={styles.scroll_content} scrollY>
          <View className={styles.allbanks}>
            {
              bankList.map((v, index) => (
                <View className={styles.eveback} onClick={() => this.clickItem(v, index)}>
                  <View className={styles.leftMes}>
                    <View className={styles.eveleft}>
                      <Image className={`${styles.imageMes} no-loading`} src={Assets.home.backcard} alt="" />
                    </View>
                    <View>
                      <View className={styles.bankTit}>{v.bankName}</View>
                      <View className={styles.bankNum}>{v.cardNum}</View>
                    </View>
                  </View>
                  <View className={`iconfont iconyinhangkamorengouxuan ${current == index ? styles.icon_color : ''}`} style={{ fontSize: '18px' }} />
                </View>
              ))
            }
          </View>
        </ScrollView>}
        {bankList.length === 0 && <View className={styles.add_box} onClick={this.addbank}>
          <View className={`iconfont ${styles.add_icon}`} >&#xe678;</View>
          <View>添加银行卡</View>
        </View>}
        <View className={styles.mes}>*最多支持绑定5张银行卡</View>
        <View className={styles.footerbar}>
          {bankList.length > 0 && <View className={styles.footerInner} onClick={this.cashItem}>
            申请提现
           </View>
          }
          {bankList.length <= 0 && <View className={`${styles.footerInner} ${styles.gray}`}>
            申请提现
           </View>
          }
        </View>
        <AtFloatLayout isOpened={isOpenShare} onClose={this.closeItem}>
          <View className={styles.cash_top}>
            <View style={{ opacity: '0' }}>demo</View>
            <Text className={styles.confirmTitle}>确认提现</Text>
            <View className={`iconfont iconguanbi1`} style={{ marginRight: '20px' }} onClick={this.closeItem} />
          </View>
          <View className={styles.fact}>
            <View className={styles.fact_price}>实际到账</View>
            <View className={styles.fact_all}>
              <Text className={styles.fact_logo}>¥</Text>
              <Text className={styles.fact_num}>{subtract(formData.amount, this.computeOffAmount(formData.amount))}</Text>
            </View>
          </View>
          <View className={styles.eveprice}>
            <View className={styles.evePrice_mes}>
              <View className={styles.evePrice_mes_left}>提现金额</View>
              <View className={styles.evePrice_mes_right}>¥ {formData.amount}</View>
            </View>
            <View className={styles.evePrice_mes}>
              <View className={styles.evePrice_mes_left}>手续费</View>
              <View className={styles.evePrice_mes_right}>
                <Text className={styles.evePrice_text}>（含{rateMes.withdrawServiceRate}%平台服务费+{rateMes.withdrawFeeAmount}元提现手续费）</Text>¥ {this.computeOffAmount(formData.amount)}
              </View>
            </View>
            <View className={styles.evePrice_mes}>
              <View className={styles.evePrice_mes_left}>提现到</View>
              <View className={styles.evePrice_mes_right}>{formData.selectedBank.bankName}({(formData.selectedBank.cardNum || '').slice(-4)})</View>
            </View>
          </View>
          <View className={styles.cancalItem}>
            <View className={styles.cancalBtn} onClick={this.onWithdraw}>
              确认提现
            </View>
          </View>
        </AtFloatLayout>
      </View >
    );
  }

}

export default Cashout;
