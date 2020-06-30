import { $post } from "@jxkang/wechat-utils";

export default {
  //收货地址-新增
  addAddress: (reqModel) => $post('/userservice/userAddress/addOrUp', reqModel),
  //地址详情
  getDetail: (reqModel) => $post('/userservice/userAddress/detail', reqModel),
  //收获地址-修改
  updateAddress: (reqModel) => $post('/userservice/userAddress/update', reqModel),
  //收货地址-删除
  deleteAddress: (reqModel) => $post('/userservice/userAddress/delete', reqModel),
  // 收货地址列表
  getList: (reqModel) => $post('/userservice/userAddress/pList', reqModel)
}