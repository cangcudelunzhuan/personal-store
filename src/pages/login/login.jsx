/**
 * @Author: chunxiao.zhang
 * @Email: chunxiao.zhang@jdxiaokang.com
 * @Update: 2020-02-18 15:13:03
 * @Description: 注册页面
 */
import Taro from '@tarojs/taro';
import { View, Form, Text, Input, Button } from '@tarojs/components';
import { Common, $ajax, message } from '@jxkang/wechat-utils'
import withPage from '@/components/with-page';
import Model, { getFetchHeader } from '@/model';
import Assets from '@/components/assets';
import styles from './login.module.styl';
import Utils from '@/utils';
import OB from '@/utils/jump'

@withPage
class Register extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '注册',
    }

    this.state = {
      // 界面/组件 初始数据
      telphone: '',//手机号码
      mark: '',//验证码
      send: false,//是否发送验证码
      second: 60, //倒计时
      TARO_ENV: process.env.TARO_ENV,
    };
  }

  formSubmit = (value) => {
    this.setState({
      register: false
    })
  }

  getTelphone = (value) => {
    this.setState({
      telphone: value.detail.value
    })
  }

  getCode = (evt) => {
    const value = evt.detail.value.slice(0, 6);
    this.setState({
      mark: value
    });
    evt.target.value = value;
  }

  onCodeBlur = (evt) => {
    const { mark } = this.state;
    this.setState({
      mark: mark.slice(0, 6)
    })
    this.scroll(evt);
    evt.target.value = mark.slice(0, 6);
  }

  //发送验证码
  sendCode = () => {
    const { telphone } = this.state
    this.setState({
      send: true
    })
    let second = 60
    let timer = setInterval(() => {
      second = second - 1
      if (second == 0) {
        clearInterval(timer);
        this.setState({
          send: false
        })
      }
      this.setState({
        second
      })
    }, 1000)
    Model.login.sendCode({
      phone: telphone,
      codeType: 20
    }).then(res => {
      if (res === true) {
        message.success('发送成功');
      }
    }
    )

  }

  goNext = () => {
    const { telphone, mark } = this.state;
    const { globalStore } = this.props;
    // 开启控制台
    if (telphone === '13588428548') {
      Taro.setStorageSync('showWebControl', { showTime: new Date().valueOf() });
    }
    // ===

    const params = {
      phone: telphone,
      smsCode: mark,
    };
    Model.login.smsLogin(params).then(data => {
      this.logger({
        loger: '用户已经调用登录接口成功了,准备调用openProcess接口判断去往哪个界面',
        api_url: Model.login.smsLogin.toString(),
        api_req: JSON.stringify(params),
        api_res: JSON.stringify(data)
      });
      if (data) {
        globalStore.setData('userInfo', data);
        $ajax.injectHeaders(getFetchHeader());
        this.openProcess(data);
      }
    })
  }

  openProcess = () => {
    const { mark = '', isFree = 3 } = this.$router.params
    const { telphone } = this.state
    OB.jump({ telphone, isFree: Number(isFree) })
  }

  scroll = () => {
    window.scroll(0, 0)
  }

  render() {
    const { telphone, mark, send, second } = this.state;
    const reg = /^1\d{10}$/

    return (
      <View className={styles.container}>
        <View className={styles.back}></View>
        <View className={styles.inner}>
          {/**
         * 头像
         *  */}
          <View className={styles.icon} style={{ backgroundImage: `url(${Assets.register.logo})` }}></View>
          {/**
         * 店铺名称
         * */}
          <View className={styles.store_name}>康小铺店铺登录</View>
          <View className={styles.store_desc}>你的专属小店，快来加入吧！</View>
          {/**
         * 注册表单
         */}
          <View className={styles.form_box}>
            <View className={styles.info_box}>
              <Text>手机号</Text>
              <Input
                className={styles.info_insert}
                type='number'
                maxLength={11}
                name='telphone'
                onInput={this.getTelphone}
                onBlur={this.scroll}
              />
            </View>
            <View className={styles.info_box}>
              <Text>验证码</Text>
              <View className={styles.code_box}>
                <Input
                  className={styles.info_insert_code}
                  name='mark'
                  type='number'
                  maxLength={6}
                  onBlur={this.onCodeBlur}
                  onInput={this.getCode}
                />
                {(reg.test(telphone) && !send) && <Text className={styles.mark} onClick={this.sendCode}>获取验证码</Text>}
                {send && <Text className={styles.time}>{second}s后重发</Text>}
              </View>
            </View>
            {
              (!reg.test(telphone) || mark.length < 6) && <Text className={styles.btn_gray}>下一步</Text>
            }
            {
              reg.test(telphone) && mark.length == 6 && <Text className={styles.btn_red} onClick={this.goNext}>下一步</Text>
            }
          </View>
        </View>
      </View >
    );
  }

}

export default Register;
