/**
 * @Author: 福虎
 * @Email: tanshenghu@163.com
 * @Update: 2020-03-07 10:21:09
 * @Description: 个人云仓店 引导 入注界面
 */
import Taro from '@tarojs/taro';
import { View, Image, Input, Button, Text } from '@tarojs/components';
import { AtModal, AtModalHeader, AtModalContent } from 'taro-ui';
import { message, paramType, $ajax } from '@jxkang/wechat-utils';
import withPage from '@/components/with-page';
import Assets from '@/components/assets';
import Utils from '@/utils';
import OB from '@/utils/jump';
import Model, { getFetchHeader } from '@/model';
import Pre from '../enter/pre';
import styles from './guide-private.module.styl';


@withPage
class GuidePrivate extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '康小铺开通店铺',
    }

    this.state = {
      /**
       * 界面第N步
       */
      stepNum: ~~this.$router.params.step,

      /**
       * form表单数据
       */
      formData: {},

      /**
       * 发短信验证跑秒数
       */
      secondNum: 0,

      /**
       * 邀请码
       */
      parentInvitationCode: decodeURIComponent(this.$router.params.mark) || '',

      /**
       * 邀请人的相关信息
       */
      invitationInfo: {},

      /**
       * 开店协议是否同意勾选
       */
      checked: false,

      /**
       * 协议展示的 显隐状态
       */
      agreeVisible: false,
    };
  }

  componentDidMount() {
    const { parentInvitationCode } = this.state;
    this.getInviterInfo( parentInvitationCode );
  }

  /**
   * 表单元素change事件
   * @param {event} value - 事件对象
   * @param {string} type - 类型名称
   */
  onChangeFormItem = (value, type) => {
    const { formData } = this.state;
    value = value.target ? value.target.value : value;
    formData[type] = value.toString().trim();
    this.setState({ formData });
  }

  /**
   * 短信验证码失焦事件
   * @param {event} evt - 事件对象
   */
  onCodeBlur = (evt) => {
    const { formData } = this.state;
    const codeValue = (formData.smsCode||'').slice(0, 6);
    formData.smsCode = codeValue;
    this.setState({ formData });

    evt.target.value = codeValue;
  }

  /**
   * 发送手机短信验证码
   */
  sendCode = () => {
    const { formData, secondNum } = this.state;
    const telphone = formData.phone;

    if(!/^1\d{10}$/.test(`${telphone}`)){
      return message.warn('请输入正确的手机号再操作');
    }
    if(secondNum>0){
      return false;
    }

    let second = 60
    this.setState({ secondNum: second });
    const timer = setInterval(() => {
      second -= 1;
      if (second <= 0) {
        clearInterval(timer);
      }
      this.setState({ secondNum: second });
    }, 1000);
    Model.login.sendCode({
      phone: telphone,
      codeType: 20
    }).then(resModel => {
      if (resModel) {
        message.success('发送成功');
      }
    })
  }

  /**
   * 新用户注册或登录功能
   */
  onRegister = () => {
    const { formData, parentInvitationCode } = this.state;
    const { globalStore } = this.props;
    if(!parentInvitationCode){
      return message.warn('页面错误: 邀请码不能为空');
    }

    if(/^1\d{10}$/.test(formData.phone) && /^\d{6}$/.test(formData.smsCode)){
      const params = {
        phone: formData.phone,
        smsCode: formData.smsCode,
      };
      Model.login.smsLogin(params).then(resModel => {
        if (resModel) {
          globalStore.setData('userInfo', resModel);
          $ajax.injectHeaders(getFetchHeader());
          OB.jump({
            telphone: params.phone,
            isFree: Number(3),
            callback: resq => {
              if(resq === 0){
                this.setState({ stepNum: 1 });
                return false;
              }else if(resq === 4){
                this.setState({ stepNum: 2 });
                return false;
              } else if (resq === 20){ // 全新用户 自动绑定
                Model.login.bindCompanyShop({
                  invitationCode: parentInvitationCode
                }).then((data) => {
                  if (data) {
                    this.setState({ stepNum: 1 });
                  }
                })
                return false;
              }
            }
          })
        }
      })
    } else {
      message.warn('请输入正确的手机号与六位验证码');
    }
  }

  /**
   * 新用户开店完成
   */
  onFinish = () => {
    const { formData, checked } = this.state;
    const params = {
      contacts: formData.contacts,
      phone: formData.phone,
      shopName: formData.shopName
    }

    /**
     * 定义数据字段规则
     */
    const rules = paramType.chain()
    .add('shopName')
    .rule('required', true, '店铺名称必填')
    .rule('length', {max: 30}, '店铺名称不超过30个字符')
    .end()

    .add('contacts')
    .rule('required', true, '联系人必填')
    .end()

    .add('phone')
    .rule('required', true, '联系电话必填')
    .rule('custom', function(v){return /^1\d{10}$/.test(`${v}`)}, '请输入正确的联系电话')
    .end()
    .toConfig();

    if(!checked){
      return message.warn('请勾选协议再操作');
    }

    if(paramType(params, rules, message.warn)){
      Model.login.freeApplyShop(params).then(resModel => {
        if(resModel){
          this.setState({stepNum: 2});
        }
      });
    }
    
  }

  /**
   * 通过邀请码获取邀请人的相关信息
   * @param {string} invitationCode - 邀请人的邀请码
   */
  getInviterInfo = (invitationCode) => {
    Model.login.getInviterInfo({
      invitationCode,
    }).then(resModel => {
      if (resModel) {
        resModel.icon = resModel.icon || Assets.common.default_logo;
        this.setState({ invitationInfo: resModel });
      }
    })
  }

  /**
   * 下载康小铺app
   */
  onDownloadApp = () => {
    window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.jdxiaokang.shop.live&g_f=undefined&from=singlemessage';
  }

  /**
   * 用户退出
   */
  onExit = () => {
    const { globalStore } = this.props;
    Model.login.logout().then(resModel => {
      if (resModel) {
        Taro.removeStorageSync('userInfo');
        $ajax.uninjectHeaders();
        $ajax.injectHeaders(getFetchHeader(true));
        globalStore.setData('userInfo', {});
        Utils.bridge.callhandler('exit', {});

        let backUrl = document.URL;
        if (backUrl.indexOf('step') === -1) {
          backUrl += (location.hash.indexOf('?') ? '&' : '?') + 'step=2';
        }

        Utils.navigateToLogin({
          desc: '[system] file:guide-private.jsx line:210',
          backUrl: backUrl
        });
      }
    })
  }

  /**
   * 开店 协议勾选框
   */
  onOkAgree = () => {
    const { checked } = this.state;
    this.setState({checked: !checked});
  }

  /**
   * 开店具体协议 显示
   */
  onShowAgree = () => {
    this.setState({ agreeVisible: !this.state.agreeVisible });
  }

  render() {
    const { stepNum, secondNum, invitationInfo, checked, agreeVisible } = this.state;

    return (
      <View className={styles.content}>
        <View className={styles.recommender}>
          <Image className={styles.recommender_photo} src={Utils.getFileUrl(invitationInfo.icon)} />
          <View>
            <View className={styles.recommender_title}>{invitationInfo.nickName || invitationInfo.userName || invitationInfo.inviterName} 赠送给您一个小店～</View>
            <View className={styles.recommender_desc}>你的专属小铺，快来免费领取吧！</View>
          </View>
        </View>
        <View
          className={styles.one}
          style={{
            background: `url(${Assets.guide.headImg}) top center no-repeat`,
            backgroundSize: '100%'
          }}
        />
        <View
          className={styles.reg_box}
        >
          {
            stepNum === 0 ? (<View>
              <View className={styles.form_items}>
                <View className={`iconfont iconshoujihao ${styles.icon}`} />
                <Input type="number" placeholder="请输入手机号" maxLength={11} onChange={v => this.onChangeFormItem(v, 'phone')} />
              </View>
              <View className={styles.form_items}>
                <View className={`iconfont iconyanzhengma ${styles.icon}`} />
                <Input type="number" placeholder="请输入验证码" maxLength={6} onChange={v => this.onChangeFormItem(v, 'smsCode')} onBlur={this.onCodeBlur} />
               { secondNum > 0 ? <View className={styles.rsend_msg}>{secondNum}秒后重发</View> : <View className={styles.send_msg} onClick={this.sendCode}>发送验证码</View> }
              </View>
              <View className={styles.sub_ok}><Button className={styles.sub_btn} onClick={this.onRegister}>立即开通</Button></View>
              <View align="center" style={{color:'#999'}} className="mt30" onClick={this.onDownloadApp}>我已注册过，直接下载APP</View>
            </View>) : null
          }
          {
            stepNum === 1 ? (<View>
              <View style={{backgroundImage:`url(${Assets.guide.reg_title})`}} className={styles.reg_title} />
              <View className={styles.form_items2}>
                <View className={styles.filed}>店铺名称：</View>
                <Input placeholder="请输入店铺名称" maxLength={30} onChange={v => this.onChangeFormItem(v, 'shopName')} />
              </View>
              <View className={styles.form_items2}>
                <View className={styles.filed}>联系人：</View>
                <Input placeholder="请输入联系人" onChange={v => this.onChangeFormItem(v, 'contacts')} />
              </View>
              <View className={styles.form_items2}>
                <View className={styles.filed}>联系电话：</View>
                <Input type="number" maxLength={11} placeholder="请输入联系电话" onChange={v => this.onChangeFormItem(v, 'phone')} />
              </View>
              <View className={styles.sub_ok}><Button className={styles.sub_btn} onClick={this.onFinish}>完成</Button></View>
              <View className={styles.agree_box}><Text className={`iconfont ${checked ? 'icondanxuankuang-xuanzhong' : 'icondanxuankuang-weixuan'} ${styles.checkbox}`} onClick={this.onOkAgree} />
                我已同意<Text onClick={this.onShowAgree} style={{color:'#555'}}>《康小铺开店服务协议》</Text>
              </View>
            </View>) : null
          }
          {
            stepNum === 2 ? (<View align="center">
            <View className={`iconfont icondanxuankuang-xuanzhong ${styles.sucs_icons}`} />
            <View>
              <View>恭喜您，开店成功！</View>
              快来下载康小铺APP体验吧
            </View>
            <View className={styles.handler_box}>
              <Button onClick={this.onExit}>退出登录</Button>
              <Button onClick={this.onDownloadApp}>立即下载</Button>
            </View>
          </View>) : null
          }
        </View>
        <View
          className={styles.two}
          style={{
            background: `url(${Assets.guide.mainImg}) top center no-repeat`,
            backgroundSize: '100%'
          }}
        />
        <AtModal isOpened={agreeVisible}>
          <AtModalHeader>店铺入驻协议</AtModalHeader>
          <AtModalContent>
            <Pre></Pre>
          </AtModalContent>
        </AtModal>
      </View>
    );
  }

}

export default GuidePrivate;
