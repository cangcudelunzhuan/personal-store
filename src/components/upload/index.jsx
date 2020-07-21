import Taro from '@tarojs/taro';
import { AtImagePicker, AtToast } from 'taro-ui'
import { View } from '@tarojs/components';
import { getFileUrl, navigateToLogin, bridge } from '@/utils'
import Model, { getFetchHeader } from '@/model';
import { message } from '@jxkang/wechat-utils';
// import { EXIF } from 'exif-js'

class Collect extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '',
    }

    this.state = {
      // 界面/组件 初始数据
      files: [],
      isloading: false
    };
  }

  click = () => {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  onChangeFile = (list, operationType, index) => {
    const {logger} = this.props;
    const { files } = this.state;
    if (operationType === 'remove') {
      files.splice(index, 1)
      this.setState({
        files,
      })
      this.props.onRemove(index)
    }
    if (operationType === 'add') {
      if (list) {
        const info = list.slice(-1)
        const { type, size } = info[0].file
        // 默认控制在5M范围内
        const { maxSize = 5242880 } = this.props
        const extension = type.replace(/.+\//, '')
        if (typeof maxSize === 'number' && size > maxSize) {
          const uni = maxSize / 1024 / 1024 > 1 ? `${maxSize / 1024 / 1024}M` : `${maxSize / 1024}KB`;
          message.error(`上传文件大小已超过${uni}`);
          return false;
        }

        this.setState({ isloading: true });

        const uploadBegin = (base64) => {
          const formData = {
            extension
          }
          if(base64){
            formData.base64 = base64;
          }

          Taro.uploadFile({
            url: Model.common.upload(),
            name: 'file',
            filePath: info[0].file.path,
            header: getFetchHeader(),
            formData,
          }).then(res => {
            const resModel = JSON.parse(res.data);
            const { entry, responseCode } = resModel;
            this.setState({isloading: false});

            if(typeof logger === 'function'){
              logger({
                logs: `文件上传日志采集,文件信息:${JSON.stringify(info[0].file)},上传接口返回:${JSON.stringify(entry)}`
              });
            }
  
            if (entry) {
              if (this.props.showList !== false) {
                files.push({
                  url: getFileUrl(entry.filePath)
                })
              }
              this.setState({
                files,
              }, () => {
                this.props.onSuccess(entry.filePath)
              })
            } else if (`${responseCode}` === '1000010003' || `${responseCode}` === '1000010001' || `${responseCode}` === '1000010002') {
              navigateToLogin({
                desc: '[system] file:cmpt/upload.jsx line:92'
              });
              bridge.callhandler('exit');
            }else{
              message.warn(resModel.message || '文件上传异常');
            }
          })
        }

        if(typeof FileReader !== 'undefined'){
          Model.common.getLocalImg(info[0].url).then(res => {
            const fr = new FileReader();
            fr.onload = function(d){
              // 图片的base64
              uploadBegin(encodeURIComponent(d.currentTarget.result));
            }
            fr.onerror = function(){
              uploadBegin();
            }
            fr.readAsDataURL(res);
          })
        }else{
          // 不支持转base64 老旧的浏览器
          uploadBegin();
        }
        
      }
    }
  }


  render() {
    const { files, isloading } = this.state;

    return (
      <View>
        <AtImagePicker
          files={files}
          showAddBtn={files.length < (this.props.size || 1)}
          {...this.props.option}
          onImageClick={this.click}
          onChange={this.onChangeFile}
        />
        <AtToast isOpened={isloading} text='正在上传' icon='loading' status='loading' duration={0} />
      </View>
    );
  }

}

export default Collect;
