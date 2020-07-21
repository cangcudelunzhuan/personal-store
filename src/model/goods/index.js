import { $get, $post } from '@jxkang/wechat-utils';

export default {
  // 商品管理接口
  selfList: (reqModel) => $post('/productservice/product/agentitem/self/', reqModel),
  // 分销市场接口
  market: (reqModel) => $post('/productservice/product/agentitem/market/', reqModel),
  // 分销市场上架商品  productservice/product/agentitem/market/upshelf
  upshelf: (reqModel) => $get('/productservice/product/agentitem/market/upshelf', reqModel),
  // 以及类目 /product/category/getCategoryListByParentId  /productservice/product/agentitem/market/getListByCatIdV2  /productservice/product/agentitem/category/getCategoryListByParentIdV2
  getCategoryListByParentId: (reqModel) => $post('/productservice/product/agentitem/category/getCategoryListByParentIdV2', reqModel),
  // 分销市场过滤 productservice/product/agentitem/market/getListByCatId
  getListByCatId: (reqModel) => $post('/productservice/product/agentitem/market/getListByCatIdV2', reqModel),
  // 分销市场详情  productservice/product/agentitem/market/detail
  goodsPriceDetail: (reqModel) => $get('/productservice/product/agentitem/market/detail', reqModel),
  // 提交商品加价  productservice/product/agentitem/self/price
  changeGoodsPrice: (reqModel) => $post('/productservice/product/agentitem/self/price', reqModel),
  // 下架商品
  downshelf: (reqModel) => $get('/productservice/product/agentitem/self/downshelf', reqModel),
  // 提现  /withdraw/config
  withdrawConfig: (reqModel) => $get('/settleservice/withdraw/config', reqModel),
  // 提现记录列表 /withdraw/list
  withdrawList: (reqModel) => $get('/settleservice/withdraw/list', reqModel),
  //商品详情
  goodsDetail: (reqModel) => $get('/productservice/product/agentitem/itemDetail', reqModel),
  itemDetailShop: (reqModel) => $get('/productservice/product/agentitem/itemDetailShop', reqModel),
  shopDetail: (reqModel) => $get('/productservice/product/agentitem/shop-itemDetail', reqModel),
  // 查询图片
  getImage: (reqModel) => $get('/productservice/img/getImageByType', reqModel),
  // 点击规格查询其他可选择规格属性
  getItemPropsValue: (reqModel) => $post('/productservice/product/agentitem/getItemPropsValue', reqModel),
  // b 通过规格反查sku
  getSku: (reqModel) => $post('/productservice/product/agentitem/getItemSkuByItemPropsValue', reqModel),
  // c 查看
  getSkuClook: (reqModel) => $post('/productservice/product/agentitem/getItemSkuByPropsValue', reqModel),
  // 分销市场 搜索接口
  elasticSearch: reqModel => $get('/elasticsearch-service/product/market/search-item-summary', reqModel),
  //加价说明
  getPreMiumMsg: reqModel => $get('/productservice/product/item/getPreMiumMsg', reqModel)
}
