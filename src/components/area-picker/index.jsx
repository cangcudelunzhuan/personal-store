/**
 * @Author: 福虎
 * @Email: Shenghu.tan@jdxiaokang.com
 * @Update: 2020-02-22 13:52:26
 * @Description: taro行政区划选择组件
 */
import Taro from '@tarojs/taro';
import { Picker } from '@tarojs/components';
import { Common } from '@jxkang/wechat-utils';
import Model from '@/model'

class AreaPicker extends Taro.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: [[], [], []],
      checked: [],
    }
    this.regionDatas = [];
  }



  componentDidMount() {
    this.getList()
  }

  /**
   * 数据处理
   */
  dealData = (datas) => {
    this.regionDatas[0] = datas.filter(v => v.level === 0);
    this.regionDatas[1] = datas.filter(v => v.level === 1);
    this.regionDatas[2] = datas.filter(v => v.level === 2);
  }

  getList = () => {
    // 默认历史数据
    const { value } = this.props;
    let { range, checked } = this.state

    Model.common.getAreaList({
      parentCode: null,
      level: null,
      pageNo: 0,
      pageSize: 50000   // 因为后端接口原因，这里只能传一个比较大的pageSize值
    }).then(resModel => {
      if (resModel) {
        const data = resModel.records;
        this.dealData(Common.clone(data));

        if (Array.isArray(value) && value.length) {
          let preItem;
          value.forEach((item, idx) => {
            range[idx] = idx === 0 ? this.regionDatas[0] : this.onFindChild(idx - 1, preItem);
            checked[idx] = range[idx].find(v => `${v.areaCode}` === `${item}`) || {};
            preItem = item;
          });
        } else {
          range[0] = this.regionDatas[0];
          range[1] = this.onFindChild(0, range[0][0].areaCode);
          range[2] = this.onFindChild(1, range[1][0].areaCode);
          checked.push(range[0][0], range[1][0], range[2][0]);
        }
        this.setState({
          checked,
          range
        })
      }
    }).catch(err => {
      throw err
    })
  }


  /**
   * 查找指定下级数据
   */
  onFindChild = (currentIndex, currentId) => {
    const nextIndex = currentIndex + 1;
    return this.regionDatas[nextIndex] && this.regionDatas[nextIndex].filter(item => currentId && `${item.parentCode}` === `${currentId}`);
  }

  /**
   * 查找相应数据索引值
   */
  onFindIndex = () => {
    const { checked } = this.state;
    const { value = checked.map(v => v.areaCode) } = this.props;
    const { range } = this.state;
    let valueIndex;
    if (Array.isArray(value) && value.length) {
      valueIndex = [];
      value.forEach((item, index) => {
        valueIndex.push(range[index].findIndex(v => item && `${v.areaCode}` === `${item}`));
      });
    }
    return valueIndex;
  }

  onChangeCity = e => {
    const { onChange } = this.props;
    onChange(e, this.state.checked);
  }

  onColumnSelect = e => {
    const { column, value } = e.detail;
    const { range, checked } = this.state;

    const current = range[column][value];
    checked[column] = current;

    let loopCurrent = current;

    new Array(range.length - column - 1).fill('').forEach((item, idx) => {
      if (range[column + idx + 1]) {
        range[column + idx + 1] = this.onFindChild(column + idx, loopCurrent.areaCode);
        loopCurrent = range[column + idx + 1][0];
        // 选中值
        checked[column + idx + 1] = loopCurrent;
      }
    })

    this.setState({ checked, range });
  }

  render() {
    const { range } = this.state;
    const { children } = this.props;
    let valueIndex = this.onFindIndex();

    return (
      <Picker
        mode='multiSelector'
        range={range}
        rangeKey='areaName'
        onChange={this.onChangeCity}
        onColumnChange={this.onColumnSelect}
        value={valueIndex}
      >
        {children}
      </Picker>
    );
  }
}

export default AreaPicker;