/**
 * @Author: qiang.zhang
 * @Email: 1196217890@qq.com
 * @Update: 2020-03-19 14:55:54
 * @Description: 人脸核身
 */
import Taro from '@tarojs/taro';
import { View, WebView } from '@tarojs/components';
import withPage from '@/components/with-page';
import Model from '@/model';
import { $ajax } from '@jxkang/wechat-utils';


@withPage
class Facecheck extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '人脸核身',
    }

    this.state = {
      // 界面/组件 初始数据
      faceUrl: ''
    };
  }

  componentWillReact() { }

  componentDidMount() {
    const token = this.$router.params.token?this.$router.params.token:'';
    console.log('token信息',token)
    $ajax.injectHeaders({
      jdxiaokang_client: 'H5',
      token: token,
    });
    this.getDetectAuch();
  }

  getDetectAuch = () =>{
    Model.common.getDetectAuch().then(resModel=>{
      if(resModel) {
        this.setState({faceUrl: resModel.url});
      }
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { faceUrl } = this.state;

    return (
      <View>
         {/* 这里会调用接口跳转到人脸核身 */}
         <WebView src={faceUrl} />
      </View >
    );
  }

}

export default Facecheck;
