import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './index.module.styl'


class Dialog extends Taro.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  // 取消
  cancle = () => {
    const { cancle } = this.props;
    cancle()
  }
  // 确认
  ok = () => {
    const { ok } = this.props;
    ok()
  }
  render() {
    const { content = '内容', okText = '确定', cancleText = '取消' } = this.props
    return (
      <View className={styles.dialog_box}>
        <View className={styles.box}>
          <View className={`${styles.content} last`}>{content}</View>
          <View className={styles.btn_box}>
            <View className={`${styles.btn} ${styles.after}`} onClick={this.cancle}>{cancleText}</View>
            <View className={`${styles.btn} ${styles.red}`} onClick={this.ok}>{okText}</View>
          </View>
        </View>
      </View>
    );
  }
}

export default Dialog;