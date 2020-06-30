// 基础 配置
export default {
  // 公众号 信息
  appId: 'wx3a9fb3fb00eaaf30',
  // 公众号 secret
  appSecret: 'b96705e77446b741754cbbdf1b9725a8',
  // 跳转APP，appId
  clientAppId: 'wx5318285d458b2534',
  // 个人店H5版本号
  version: '1.2.3',
  // 图片访问域名
  imgHost: process.env.NODE_ENV === 'production' ? 'https://jxkcdn.jingxiaokang.com' : 'https://test-static.jdxiaokang.com',
  // 文件下载域名
  downImgHost: 'https://public-jingxiaokang.oss-accelerate.aliyuncs.com',
  // 按要求文件名下载文件
  dowmImgUrl: 'https://web-service.jingxiaokang.com/common/download',
  // 跨域访问文件
  crossFile: 'https://web-oss.jingxiaokang.com'+(process.env.NODE_ENV === 'production'?'/':'/test/'),
  //当前域名
  webHost: process.env.NODE_ENV === 'production' ? 'https://shop-m.kangxiaopu.com' : 'https://daily-shop-m.kangxiaopu.com',
  // 宿主环境
  runEnv: globalThis.webViewType,
  // 开通店铺费用金额
  costAmount: '599/年',
}
