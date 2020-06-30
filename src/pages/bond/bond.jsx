/**
 * @Author: 福虎
 * @Email: Shenghu.tan@jdxiaokang.com
 * @Update: 2020-05-25 10:58:40
 * @Description: 自营店保证金
 */
import Taro from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import { AtModal } from 'taro-ui';
import withPage from '@/components/with-page';
import Model from '@/model';
import Assets from '@/components/assets';
import Utils, { getFileUrl } from '@/utils';
import styles from './bond.module.styl';



@withPage
class Bond extends Taro.Component {
  constructor(props) {
    super(props);

    this.config = {
      navigationBarTitleText: '个人自营入驻-交纳保证金',
    }

    this.state = {
      already: false,
      amountValue: '',
      visible: false
    };

    this.agree = false;
  }

  componentDidMount() {
    this.getPayAmount();

    this.hasSelfSale();

    Utils.bridge.registerhandler('paysuccess', (data) => {
      Taro.navigateTo({
        url: '/pages/pay-result/pay-result?from=bond'
      })
    });
  }

  /**
   * 获取保证金 金额
   */
  getPayAmount = () => {
    Model.common.getPayAmount({ bizType: 3 }).then(resModel => {
      if (resModel) {
        this.setState({ amountValue: resModel });
      }
    });
  }

  /**
   * 创建订单
   * 调用安卓、ios原生唤起支付
   */
  onPay = () => {
    if (!this.agree) {
      return this.setState({ visible: true });
    }
    Model.bond.createOrder().then(resModel => {
      if (resModel) {
        Utils.bridge.callhandler('getOrderId', { orderId: resModel });
      }
    });
  }

  /**
   * 查看是否已经交纳过保证金
   */
  hasSelfSale = () => {
    Model.bond.hasSelfSale().then(resModel => {
      if(typeof resModel === 'boolean'){
        this.setState({already: resModel, visible: !resModel});
      }
    });
  }

  onAgree = () => {
    this.setState({
      visible: false,
    });
    this.agree = true;
  }

  onNoAgree = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { already, amountValue, visible } = this.state;
    const { globalStore: { data: { userInfo } } } = this.props;
    const content = getContent();
    
    return (
      <View>
        <View className={styles.top_banner} />
        <View className={styles.content}>
          <View className={styles.user_box}>
            <Image src={getFileUrl(userInfo.headImg)} className={styles.photo} />
            <Text className={styles.company_name}>{userInfo.companyName}</Text>
            <Text className={styles.pay_status_tip}>{already ? '已开通' : '待开通'}</Text>
            {already ? <View className={styles.already_box}>
              <View className={styles.mypaytext}>我的保证金(元)</View>
              <View className={styles.mypayamout}>{amountValue}</View>
            </View> : null
            }
          </View>
        </View>
        <View className={styles.title_img_box}>
          <Image className={`${styles.title_img} no-loading`} src={Assets.bond.img7} mode="widthFix" />
        </View>
        <View className={styles.about}>
          店主可以上架自有商品到康小铺店铺，通过康小铺店铺的直播、实拍、转发等营销工具销售商品，无需繁琐的报品、上架流程，轻松拥有康小铺销售渠道。
        </View>
        <View className={styles.title_img_box}>
          <Image className={`${styles.title_img} no-loading`} src={Assets.bond.img4} mode="widthFix" />
        </View>
        <View className={styles.flow_box}>
          <View className={styles.step_box}>
            <Image className={`${styles.step_icon} no-loading`} src={Assets.bond.img2} />
            <View>缴纳保证金</View>
          </View>
          <Image className={`${styles.arr_img} no-loading`} src={Assets.bond.img8} mode="widthFix" style={{ left: Taro.pxTransform(140) }} />
          <View className={styles.step_box}>
            <Image className={`${styles.step_icon} no-loading`} src={Assets.bond.img1} />
            <View>发布商品</View>
          </View>
          <Image className={`${styles.arr_img} no-loading`} src={Assets.bond.img8} mode="widthFix" style={{ right: Taro.pxTransform(190) }} />
          <View className={styles.step_box}>
            <Image className={`${styles.step_icon} no-loading`} src={Assets.bond.img5} />
            <View>审核通过自动上架</View>
          </View>
        </View>
        <View className={styles.pay_box} hidden={already}>
          <View>保证金<Text className={styles.amout}>¥{amountValue}</Text></View>
          <View className={styles.wx_pay_btn} onClick={this.onPay}>微信支付</View>
        </View>
        <AtModal
          isOpened={visible}
        >
          <View className={styles.agre_title}>入驻申请</View>
          <ScrollView scrollY className={styles.prebox}>
            {content}
          </ScrollView>
          <View className={styles.mfooter}>
            <View onClick={this.onNoAgree}>不同意</View>
            <View onClick={this.onAgree}>同意</View>
          </View>
        </AtModal>
      </View >
    );
  }

}

export default Bond;

function getContent() {
  return `康小铺平台合作协议
签约须知：
《康小铺平台合作协议》（以下简称“本协议”）是由康小铺平台（包括但不限于康小铺APP、微信公众号、微信商城及小程序等）的运营方即河南岳森文化传媒有限公司（系京小康（杭州）网络科技有限公司全资子公司，以下简称“甲方”）与以独立第三方经营者身份入驻康小铺平台的法律实体（以下简称“乙方”或“商家”）达成的关于提供和使用康小铺平台服务的各项条款。
甲方在此特别提醒乙方认真阅读本协议各条款（对于本协议中以加粗字体显示的内容，应重点阅读），并请乙方审慎考虑并选择接受或不接受本协议。如果乙方点击“我已经阅读并同意”按钮（前述按钮的具体表述可能会做适当调整，下同），即表示乙方已充分阅读、理解并自愿接受本协议，同意受本协议各项条款的约束。
本“签约须知”为本协议正文的组成部分。
1.     协议内容及生效
1.1.      协议内容。本协议包括协议正文、附件及所有甲方已经发布的或将来可能发布的各类规则、规范、规则解读、实施细则、通知、公告等（以下合称“平台规则”）。所有附件及平台规则均为本协议不可分割的一部分，与协议正文具有同等法律效力。协议正文、附件与平台规则冲突的，以发布在后的文件为准执行。
1.2.      协议变更及生效。甲方有权变更（包括但不限于制定、修订、废止）本协议正文、附件及/或平台规则，将至少提前7日在甲方网站公示，并载明生效日期，乙方应实时关注公示内容。如乙方不接受变更，应当在公示期间内申请退店，则乙方店铺将进入“关店准备”状态，店铺内商品将全部下架，无法上架新商品，本协议将终止。乙方清楚知晓、同意并确认前述“关店准备”状态下的店铺功能限制，甲方对于该等限制、协议终止不负有任何违约责任或其他责任。如乙方未按前述约定申请退店，即视为乙方接受前述变更事项。
1.3.      服务开通。商家申请入驻康小铺平台时，商家签署或在线接受本协议后本协议立即生效，但本协议项下的平台服务并不立即开通。商家履行上传相关资质、支付保证金等义务，经甲方审核通过并向商家发出服务开通通知（通知方式包括但不限于站内信、手机短信等）时，本协议项下的平台服务正式开通。 
2.     合作方式
2.1.      账户密码。商家完成入驻后，会获得相应店铺商家后台的账户及密码，商家在遵守本协议及平台规则、不存在违约情形的前提下，可以通过商家后台进行店铺日常经营。若商家存在违约行为，平台有权限制商家后台的部分或全部功能。
2.2.      守法依规经营。商家在康小铺平台开店成功后，应当根据法律、法规及平台规则发布商品（包括服务，下同）、提供售前售后服务、提供商品免费包邮服务及其他各项服务，双方另有约定或甲方平台规则另有规定的除外；同时商家应依法为消费者开具正规的商品发票，相关税费由商家自行承担。
2.3.      甲方服务范围。甲方负责康小铺平台的日常维护、技术支持，保证平台的正常运作。作为电子商务平台经营者，甲方仅为商家与消费者达成交易提供网页空间、虚拟经营场所、交易规则等服务，甲方并非商家与消费者之间交易行为的参与方，不对商家及/或消费者的任何口头、书面陈述或承诺，发布的信息及交易行为的真实性、合法性、准确性、及时性、有效性等作任何明示或暗示的保证。
2.4.      调整商品展示位置。除双方另有约定外，甲方有权根据商品销量、商品价格、商品质量、商家的服务水平等综合因素调整商品的展示位置。
2.5.      收费标准。商家充分理解并确认，甲方有权就平台向商家提供的各项服务收取费用，具体收费标准以双方之间的约定（如有）或平台规则的规定为准。
2.6.      技术服务费。商家无条件并不可撤销地授权甲方通知相关合作方（包括但不限于第三方支付机构、合作银行等）自店铺资金中直接扣除相应的技术服务费,结算数据以康小铺平台系统记录为准。订单发生退款的，退款时不另行收取技术服务费，但已收取的技术服务费不做退还。甲方有权单方面调整技术服务费费率及/或结算方式并在平台上公布。 
3.     资格要求、证明文件及信息
3.1.      资格要求。商家保证具有履行本协议所需的行为能力及所有必要的资质和授权。
3.2.      证明文件及信息提交。商家应当向甲方或甲方指定合作方提交其应当提供的证明文件及联系人、联系地址、联系电话、联系邮箱等信息。
3.3.      证明文件及信息变更的通知。协议期内，上述相关证明文件或信息发生任何变更，商家都应及时通知甲方并更新相关证明文件或信息。
3.4.      店铺类型的确定。甲方有权对商家店铺类型做出判断及/或变更，并有权根据店铺类型确定对商家具体适用的平台规则，商家同意遵守前述对其适用的平台规则。
3.5.      抽查。甲方有权对商家提供的证明文件及信息进行不定时的抽查，并有权要求商家提供证明文件原件供核对或补充提供证明文件、信息，商家应当提供。如商家不能提供，则甲方有权立即中止/解除本协议。
3.6.      查询核验。商家无条件并不可撤销地授权甲方及相关合作方（包括但不限于第三方支付机构、合作银行等）查询并核验商家信息，包括但不限于征信信息、身份信息、联系信息等，并同意甲方与相关合作方共享上述信息。
3.7.      商家责任。商家保证其向甲方及相关合作方提供的全部文件及信息全面、真实、准确、合法、有效。商家提供虚假、过期、失效文件或信息，或未及时通知并更新其文件或信息的，应独立承担全部法律责任。商家违反本条约定义务的，甲方有权立即中止/解除本协议，并要求商家支付人民币10万元作为违约金，该违约金不足以弥补商家违约行为给甲方（包括其合作伙伴、代理人、职员等）或其他任何第三方造成的全部损失的，甲方有权要求商家补足。
4.     商品交付
4.1.      合同与发货。买家支付价款，则商家与买家之间的买卖合同成立；订单确认时，商家与买家之间的买卖合同生效。 商家应按对消费者的承诺及平台规则（包括但不限于《康小铺发货规则》、《康小铺特殊商品发货规则》等）及时将商品交付消费者。
4.2.      商品包装。商家应按对消费者的承诺及平台规则对商品进行包装，包装费用由商家承担。商家在包装中不得夹带任何违反法律法规或本协议约定的资料、宣传单等，不得附带任何非正常交易或服务所必需的第三方网站或店铺信息等。
4.3.      违规行为的判定和处理。甲方有权对商家延迟发货、虚假发货、缺货、欺诈发货等违规行为进行处理，相关定义及违规判定、处理方式以平台规则的规定为准。 
5.     商品质量保证
5.1.      总体要求。商家保证所售商品符合《中华人民共和国产品质量法》等法律法规、规章、相关标准、本协议约定及平台规则之规定（包括但不限于商品安全性，商品功能材质、标识标志、外观、包装与描述符合性等）。
5.2.      如实描述。商家保证如实描述有关商品信息，不做引人误解的虚假宣传，不存在发布虚假广告、欺骗和误导消费者等行为。
5.3.      正品保证。商家保证商品来源真实、合法，未侵犯他人商标专用权、专利权、著作权或其他合法权益，不存在伪造商品产地，伪造或冒用他人厂名、厂址、认证标志、质量标志、名优标志、包装装潢等行为。
5.4.      品质保证。商家保证销售的所有商品清洁、整齐、包装完好、适宜销售。凡有保质期的商品，在送达消费者订单指定收货地时均在保质期内。对于临近保质期的商品，商家应在商品页面的显著位置作出说明。
5.5.      标签瑕疵。商家保证销售的所有商品及吊牌、商品外包装上，不存在任何之前在其他商场或任何渠道销售的标志、价格。如商家对商品之前的价格标签未作处理或出现价格标签重叠、错粘或其他足以影响甲方商业信誉的标志或瑕疵，商家应当为甲方消除影响并承担赔偿责任。
5.6.      不合格商品的退回。商家销售的商品不符合国家相关法律法规、规章、相关标准、本协议约定及平台规则规定的，视为不合格商品。商家销售不合格商品，消费者有权将该商品退回商家，运费由商家承担。
5.7.      严重问题商品的认定及处理
5.7.1.        严重问题商品的认定。若经消费者投诉、品牌方投诉、甲方调查、司法机关或者行政机关调查等途径，发现商家存在下列情形之一的，则涉及商品将被认定为“严重问题商品”：
（1）   销售假冒伪劣商品或者过期商品；
（2）   提供非法服务；
（3）   违反本协议第5条规定的商品质量要求且情节较为严重；
（4）   与上述行为性质类似、甲方认为不宜继续销售的其他情形。
5.7.2.        严重问题商品的处理。商家销售“严重问题商品”的，甲方可对相关商品作即时下架处理，并通知商家提供相关证据，包括但不限于商品销售许可、进货凭证、授权销售证明、商品进口证明等，商家应立即提交。若商家不能及时提供有效证明文件，甲方有权采取下列一项或多项措施：
（1）   立即解除本协议；
（2）   限制商家店铺资金（包括但不限于店铺保证金、活动保证金及货款，下同）提现；
（3）   要求商家支付通过康小铺平台销售的“严重问题商品”历史总销售额（以商品ID为准）的十倍作为消费者赔付金赔付消费者，且甲方有权以商家店铺资金抵扣消费者赔付金赔付消费者；
（4）   扣除商家交纳的保证金；
（5）   平台规则规定的其他违规处理措施。
5.8.      召回。若因商家销售的商品存在缺陷危及人身财产安全，或存在重大安全问题，或因法律诉讼等情形，甲方有权决定召回有关产品，商家应按甲方要求完成对召回产品的退、换、维修，在甲方平台或甲方指定的其他网站公布召回信息，并承担由此产生的所有费用。
5.9.      违规认定。甲方有权根据平台规则（包括但不限于《康小铺假货处理规则》、《康小铺商品描述及质量抽检规则》等），对商家销售假货、商品描述及质量抽检不合格等行为进行处理，“假货”、“商品描述”、“抽检不合格”等相关定义及违规判定、处理方式以平台规则的规定为准。
5.10.   违约责任。商家违反本协议第5条约定的，还应当承担相关违约责任，赔偿甲方、消费者或第三方由此产生的所有损失。
6.     售后及客户服务
6.1.      售后责任。商家应根据相关法律法规、本协议约定以及平台规则之规定，负责为消费者提供商品的“修理、更换、退货”等售后服务，并承担因上述售后服务而产生的一切费用（包括但不限于往返运费、退换货费用等），保障消费者的合法权益，避免甲方承担因商品售后服务而产生的任何法律责任（包括但不限于任何赔偿、补偿或处罚）或声誉受损。
6.2.      客户服务
6.2.1.        回复要求。商家应指派专人负责处理客户服务问题，并将服务电话及工作邮件向甲方备案。商家的回复内容中应包含对于该问题的解释、明确的处理方案及事件说明，“正在查询/正在沟通”等无实质解决方案的回复视为延迟回复，具体以甲方的认定为准。
6.2.2.        问题范围。客户服务问题包括但不限于：商品咨询、退换货政策、取消订单、物流快递问题等。
6.3.      监督检查。甲方有权对商家售后服务及客户服务的质量进行监督检查，根据平台规则（包括但不限于《康小铺售后规则》、《康小铺商家客户服务管理规则》）对商家进行考核，并对售后服务不达标、客服回复率或者回复态度不符合要求的商家进行处理。 
7.     保证金及货款结算
7.1.      保证金的缴存。商家应当根据平台规则（包括但不限于《康小铺保证金规则》）之规定，向甲方缴存保证金；对于该等保证金（包括补缴的保证金），甲方无须支付任何利息等孳息。
7.2.      保证金标准的调整。甲方有权根据平台规则的调整、店铺经营状况的变化、商家违约情形及/或实际赔付情况、潜在赔付风险等情况，调整商家保证金标准。
7.3.      保证金的补足。因保证金标准调整或其他原因导致商家保证金余额低于其应缴存保证金标准的，甲方有权要求商家在指定期限内补足，或自店铺资金中划转相应的金额予以补足。商家未在指定期限内补足，或者店铺资金不足以补足保证金的，甲方有权解除本协议，停止服务。
7.4.      保证金的退还。店铺关闭后，平台将按照平台规则之规定，退还商家保证金。
7.5.      货款入账。正常经营情况下，消费者确认收货后10天，消费者支付的货款自动进入商家账户，商家可提取货款。若商家存在虚假发货、欺诈发货等违约行为，甲方有权调整相关订单的自动确认收货时间，或者取消商家店铺订单的自动确认收货功能，相关订单的货款需消费者主动确认收货或主动申请退款后，方可进入商家账户。
7.6.      店铺资金限制。双方确认，甲方有权关闭商家后台的提现功能，限制商家店铺资金提现。同时，甲方有权自商家店铺资金中扣划相应消费者赔付金、违约金以及其他费用或款项。商家无条件并不可撤销地授权甲方通知相关合作方（包括但不限于第三方支付机构、合作银行等）立即停止向商家支付货款等结算款项、直接扣划店铺资金等。 
8.     知识产权
8.1.      商家权利保证。商家保证已合法取得其店铺经营或宣传推广所涉知识产权或其他相关权利的使用权。
8.2.      授权平台使用。对于商家因店铺经营或宣传推广而在康小铺平台发布、使用或者向康小铺平台提交的内容，包括但不限于专利、商标、名称、特有标识、装潢、技术秘密、肖像、版式设计、图片、音频、视频等，商家特此授权甲方为本协议下目的使用其知识产权及其他相关权利，且商家保证该等授权许可是合法有效的、免费的、非独家的、不可撤回的。
8.3.      平台自有知识产权的保留。商家知悉并同意，甲方或其关联方拥有、使用、许可、控制的或者甲方或其关联方对之享有其他权利的一切知识产权、工业产权和专有权利，包括全部商标、著作权、名称、标识、标志、微信公众号、域名、网站名称、网页、艺术作品、人物形象、专利，例如“康小铺”、“康小铺商城”、 “康小铺及图”，“康小铺”app图标等，由甲方或其关联方独家拥有并保留。
8.4.      侵犯平台知识产权行为的禁止。商家同意并保证，其任一级代表、代理、受托人或代表其各自的董事、高级管理人员或职工及其自身，不得在中国之境内外注册、使用与甲方及其关联方拥有、使用、许可或控制的商标、名称、标识、标志、微信公众号、域名、网站名称、网页、艺术作品、人物形象等相同或近似的商标，或侵犯甲方或其关联方享有的一切知识产权、工业产权和专有权利，或妨碍甲方或其关联方独自全部拥有或保留前述权利。
8.5.      商家责任。乙方同意并保证，若其注册与甲方及甲方关联方相同或近似的商标、名称、标识、标志、微信公众号、域名、网页等，用于开展与甲方及甲方关联方实质相同或近似的业务，则应当在甲方或甲方关联方提出相关要求时，无偿将相关商标、名称、标识、标志、微信公众号、域名、网页等转让给甲方或甲方关联方。如由此给甲方及/或甲方关联方造成损失的，乙方应赔偿全部损失并消除给甲方及/或甲方关联方造成的不良影响，同时甲方有权采取限制商家店铺资金提现、直接自商家店铺资金中扣划损失赔偿金等措施，并有权立即解除本协议。
8.6.      拘束范围。乙方同意并保证其任一级代表、代理、受托人或代表其各自的董事、高级管理人员或职工均遵守本协议的约定，受到本协议的拘束，如同该人被指定为“乙方”一样。
9.     保密条款
9.1.      商业秘密范围及保密期限。本协议所称商业秘密包括但不限于本协议、任何补充协议所述内容及在合作过程中涉及的其他秘密信息。任何一方未经商业秘密提供方同意，均不得将该信息向任何第三方披露、传播、编辑或展示。协议方承诺，本协议终止后仍承担此条款下的保密义务，保密期将另行持续三年。
9.2.      合法披露。因对方书面同意以及国家行政、司法强制行为而披露商业秘密的，披露方不承担责任；该商业秘密已为公众所知悉的，披露方不承担责任。
9.3.      商家使用平台资料的限制。商家不得将从甲方平台获取的任何信息或数据用于本协议约定以外的用途；未经甲方许可，不擅自获取、使用、传播甲方平台的任何资料。
10.  承诺与保证
10.1.   遵守协议与规则。商家保证严格遵守本协议及平台规则，不从事任何有损甲方利益的行为。
10.2.   商品和信息。商家保证所发布、销售的商品或信息符合如下要求：
（1）   来源正当合法，除商品详情另外说明外，均为全新正品；
（2）   不侵犯任何第三方的合法权益（包括但不限于物权、债权、著作权、商标专用权、专利权等）；
（3）   甲方不会因商家在康小铺平台开设店铺或销售产品而受到任何第三方投诉/起诉；
（4）   不属于违禁商品或信息，即相关法律法规或平台规则禁止出售的商品或禁止发布的信息。
10.3.   价格。商家在康小铺平台上销售的同款商品的销售价格不得高于商家在其他渠道的销售价格。
10.4.   描述。商家自行编辑上传的店铺名称及描述、商品说明、介绍、图片等信息资料是真实有效并恰当反映店铺和商品特性的，不存在虚假、伪造或侵犯第三方权益的内容，不存在违反《中华人民共和国广告法》、《中华人民共和国价格法》等法律法规的情形，且商家保证甲方在其平台使用上述信息资料不会侵犯第三方的权益。
10.5.   商品质量及售后。商家将按照不低于《中华人民共和国产品质量法》、《中华人民共和国消费者权益保护法》及其他法律法规、国家强制性标准以及平台规则的要求，出售商品并提供“三包”等售后服务。
10.6.   充分披露。商家承诺未隐瞒任何其他信息以致足以影响甲方签订及履行本协议。
10.7.   诚实信用。商家保证在使用康小铺平台进行交易的过程中遵守诚实信用原则，不在交易中采取虚假宣传、混淆等欺诈或不正当竞争行为，不扰乱网络交易的正常秩序，不从事与网上交易无关的行为。
10.8.   经营模式。商家承诺不抄袭、模仿甲方商业模式从事拼单类业务。商家与甲方合作期间，甲方有权监督商家的经营行为，并对商家诱导非官方交易的行为做出处理，相关定义及违规判定、处理方式以平台规则的规定为准。
10.9.   虚假交易的禁止。商家不得以任何手段利用甲方平台规则漏洞或系统漏洞，通过虚假交易套取平台积分、红包、补贴（即刷单套券），或者获取虚假商品销量、虚假好评、虚假信用评价等不当利益，或者恶意损害其他商家或任何第三方合法权益。
10.10.   公平交易
10.10.1.   禁止合作的情形。对于被甲方开除或主动辞退的员工以及甲方在职员工，商家承诺不得以合伙、合作、入股、咨询顾问、雇佣等任何形式与该等员工进行合作。
10.10.2.   相关合作的报备。对于从甲方正常离职的员工，若商家以合伙、合作、入股、咨询顾问、雇佣等任何形式与该等正常离职员工进行合作，则应当自合作开始之日起三日内向甲方进行报备。
10.11.   账户的保管。商家应妥善保管、使用甲方提供的相关账户（包括但不限于用户名、原始密码信息）及/或商家自行修改的密码，并确保使用其该等账户的主体均为商家或商家授权的人员；除非适用的法律法规另有明确规定或本协议另有明确的约定，商家不得以任何形式泄露、擅自转让、披露或授权他人使用该账户。
10.12.   违法行为的禁止。商家签署及履行本协议过程中应当遵守有关法律法规以及其他任何对其适用的规定，不得利用甲方或甲方平台从事任何违法活动，包括但不限于侵害任何第三方的合法权益或者获取任何不正当利益，商家应就其实施的与本协议有关的行为承担全部责任。
10.13.   商家数据的使用。商家知悉并同意：对于商家因开设店铺、经营需要、行使或履行本协议及平台规则的权利义务而向甲方提交的任何信息或数据，以及商家在经营过程中产生的交易数据、店铺或商品评价数据等，无论本协议是否终止，甲方均有权合理使用，使用方式包括但不限于依据该等信息或数据进行市场分析和调研，且甲方无义务返还商家。同时，甲方无义务就获取、备份、处理、使用前述信息或数据向商家支付任何费用。
10.14.   商家信息的披露。商家知悉并同意：甲方有义务根据有关法律要求向司法机关和政府部门提供商家的信息和资料。甲方有权根据自己的判断、有关协议和规则、国家生效裁判文书或者与交易有关的消费者的合理请求披露商家的信息资料，甲方对此不承担任何责任。
10.15.   个人信息保护。商家保证严格依据《中华人民共和国网络安全法》等法律法规的规定以及本协议的约定，使用和保护用户（消费者）的个人信息，包括但不限于：
（1）   确保通过合法渠道获取、使用和保存个人信息，按照用户的要求查询、更正、删除个人信息，保证不在违背用户真实意愿、未通过甲方审核或用户未明确同意的情况下，向甲方用户发送任何性质的商品推荐、推广信息等；
（2）   保证不会将从甲方平台获取的个人信息或数据用于本协议约定以外的用途，承诺不以任何方式、向任何第三方泄露/出售甲方平台用户的个人信息；
（3）   保证不擅自获取、使用、传播涉及甲方平台用户的任何资料，包括但不限于交易数据、账户信息、支付信息、甲方其他商家展示于甲方平台的信息等。
10.16.   纠纷处理。对于因商家经营行为导致的，消费者、知识产权权利人或其他第三方向行政机关发起的举报投诉、向法院提起的诉讼，或行政机关主动介入调查等情形，商家保证积极处理。
10.17.   商家责任
10.17.1.   一般责任。商家违背第10.1条至第10.16条保证或者承诺的，应当自行负责处理由此产生的争议、纠纷、处罚、诉讼、仲裁、投诉、索赔等，并承担全部法律责任（包括但不限于赔偿由此给消费者、甲方及/或任何他方造成的全部损失），确保甲方免于承受与此相关的任何索赔、责任追究或损失。同时，甲方有权制止商家的违法违约行为，追究商家的违约及/或侵权责任，并对商家采取以下各类措施中的一项或多项：
（1）     部分或全部商品屏蔽、降权、下架、禁售、删除；
（2）     部分或全部商品移除资源位、禁止上资源位、移除广告；
（3）     店铺禁止上新、禁止上架；
（4）     关闭或限制商家账户权限、店铺功能；
（5）     限制退店；
（6）     提高店铺保证金标准、限制店铺资金提现；
（7）     扣除保证金；
（8）     单方解除本协议，终止与商家的合作；
（9）     平台规则规定的其他违规处理措施。
10.17.2.   特别责任。商家违背第10.9条承诺，套取甲方平台积分、红包、补贴的，甲方除有权按照第10.17.1的规定进行处理以外，还有权从商家店铺资金中扣除相当于补贴金额十倍的款项作为违约金；商家行为构成犯罪的，甲方有权向公安部门报案以进一步追究商家刑事责任。
11.  关联关系条款
11.1.   关联关系的情形。甲方有权将具备关联关系的店铺形成关联圈。前述关联关系是指店铺存在下列情形之一：
（1）   店铺入驻人、管理人、紧急联系人等登记信息存在交叉（若店铺入驻人、管理人、紧急联系人等发生过变更，则包括变更前后的主体，下同）；
（2）   店铺提现银行账户、与提现银行账户绑定的手机号码等存在信息交叉；
（3）   存在其他类似性质的信息交叉及关联。
11.2.   统一管理。甲方有权对关联圈内的商家账户进行统一管理，包括但不限于统一增加或扣减信誉值，统一扣划店铺资金，统一中止/终止平台服务等。
11.3.   关联店铺的处理。若关联圈中的任一店铺存在违反相关法律法规、本协议、平台规则的情形，甲方有权要求商家对关联圈内各店铺间的关联关系作出正式的书面解释，也有权无需通知直接判定各店铺间的关联关系；同时，甲方有权立即对违规店铺及其关联店铺统一采取以下各类措施中的一项或多项：
（1）   部分或全部商品屏蔽、降权、下架、禁售、删除；
（2）   部分或全部商品移除资源位、禁止上资源位、移除广告；
（3）   店铺禁止上新、禁止上架；
（4）   关闭或限制商家账户权限、店铺功能；
（5）   限制退店；
（6）   提高店铺保证金标准、限制店铺资金提现；
（7）   扣除保证金；
（8）   直接扣划各店铺资金冲抵消费者赔付金及违约店铺应承担的其他款项或费用；
（9）   单方解除本协议，终止与商家的合作；
（10） 限制店铺主体使用其信息注册其他康小铺店铺；
（11） 平台规则规定的其他违规处理措施。

12.  有限责任
12.1.   纠纷处理。商家了解并同意，甲方及/或其关联公司并非司法机构，仅能以普通或非专业人员的知识水平标准对商家提交的证据材料进行鉴别，甲方及/或其关联公司对交易纠纷的调处、对知识产权维权投诉等事项的处理完全是基于商家的委托，或本协议约定、平台规则以及相关法律法规的规定，甲方及/或其关联公司无法保证交易纠纷或知识产权维权投诉等事项的处理结果符合商家的期望，也不对上述事项的处理结果及保证金赔付决定承担任何责任。商家应保证其提交的材料及信息的真实性、合法性，并承担其或买家、权利人或其他第三方提供的信息、数据不实的风险和责任。如商家因此遭受损失，商家同意自行向受益人或致损方索赔。
12.2.   技术手段。商家了解并同意，鉴于现有技术水平和客观条件的限制，甲方将采取一切可能的技术手段保持乙方使用甲方平台服务所涉的技术和信息的有效性、准确性、可靠性、及时性、稳定性、完整性，但甲方对此不作任何承诺或保证。
12.3.   外部影响。不论在何种情况下，甲方均不对由于Internet连接故障，电脑、通讯或其他系统的故障，电力故障，罢工，劳动争议，暴乱，起义，骚乱，生产力或生产资料不足，火灾，洪水，风暴，爆炸，不可抗力，战争，政府行为，国际、国内法院的命令或第三方的不作为而造成的不能服务或延迟服务承担责任。 
13.  期限和终止
13.1.   期限。本协议期限为自签署之日起至协议解除之日止，但保密、违约责任、售后服务义务及产品质量保证责任在协议终止后将继续有效。
13.2.   终止
13.2.1.  商家退店。商家有权根据《康小铺退店规则》申请解除本协议、退出康小铺平台，甲方审核通过后本协议终止。
13.2.2.     平台解除。出现下列情形之一的，甲方有权单方解除本协议：
（1）   商家违反平台规则或本协议中的承诺或保证，包括但不限于本协议项下的任何约定;
（2）   商家超过九十（90）天未以商家后台管理账户及密码登录康小铺平台;
（3）   商家未能按期全额支付有关服务费用和/或活动费用；
（4）   商家与甲方产生纠纷，或商家行为可能影响甲方商誉；
（5）   商家擅自终止履行本协议或者将本协议项下权利义务转让给任何第三方；
（6）   甲方自主决定解除本协议，并以书面形式提前通知商家；
（7）   可以解除协议的其他情形。
13.3.   协议终止后事项的处理
13.3.1.     账户关闭。自本协议终止之日起，甲方将关闭商家在甲方的账户权限，并对商家产品全部下架，商家将无法再通过该账户进行任何形式的操作，且康小铺平台不再显示任何商家产品信息。
13.3.2.     数据处理。本协议终止后，甲方有权保留商家的注册信息及交易行为记录等数据，但甲方没有为商家保留这些数据的义务，亦不承担在协议终止后向商家或第三方提供任何数据信息的义务，也不就协议终止向商家或任何第三方承担责任，但法律另有规定的除外。
13.3.3.     不免除售后责任。本协议终止并不免除商家依据本协议应向客户承担的售后服务及产品保证责任，商家仍应履行售后服务义务及产品质量保证责任；如在本协议终止后，因售后服务问题或商家产品质量问题导致甲方或其他第三方人身或财产损失的，商家仍应承担全部责任。
14.  违约责任
14.1.   总体要求。商家违反与甲方的各项约定，或者违反平台规则及有关法律法规规定的，甲方有权要求商家承担违约责任。
14.1.1.     违约认定。商家理解并同意，甲方有权在本协议中约定及平台规则中规定违约认定程序和标准，甲方有权判定商家是否构成违约并采取处理措施。商家有义务及时对交易异常、数据异常现象及涉嫌违约行为进行充分举证和合理解释，甲方有权对商家举证的材料和解释进行审核，并根据审核结果作出相应处理。商家保证其提交的证据材料的真实性、合法性，并自行承担举证不能的后果。
14.1.2.     违约责任。商家的违约行为致使甲方及/或其关联公司利益遭受损失的，商家应赔偿甲方及/或其关联公司的损失。上述损失包括但不限于直接经济损失、消费者流失损失、商誉损失、以及甲方及/或其关联公司为减少损失、防止损失扩大、固定证据或者追究商家相关法律责任所支出的诉讼费、保全费、公证费、律师费、差旅费、鉴定费等一切有关费用和支出。商家的违约行为造成甲方及/或其关联方商誉受损的，商家还应为甲方及/或其关联方消除影响，消除影响的方式包括但不限于在公开发行的报刊、新闻媒体上刊登声明等。
14.2.   消费者赔付金。商家违反本协议约定及/或平台规则之规定，按约需承担消费者赔付金的，甲方有权决定赔付方式（包括但不限于发放长期有效的无门槛现金券），相关消费者赔付金由商家承担。
14.3.   纠纷处理的费用承担。若因商家自行编辑、上传的店铺信息、产品素材问题、产品质量问题或因发错货、超卖、退货处理不及时等原因导致甲方被第三方投诉、起诉的，甲方有权选择与第三方和解、调解或诉讼，商家应承担由此支出的一切费用并承担甲方因此遭受的一切损失。
14.4.   店铺资金扣除。商家出现下列情形之一的，一切损失和责任由商家承担，同时甲方有权扣除商家全部保证金或暂停支付商家销售款项：
（1）   因甲方宣传商家产品，引起的第三方维权、投诉、诉讼等；
（2）   因商家原因致使价格或活动设置错误，甲方进行先行赔付后三（3）个工作日内商家未赔偿给甲方。
14.5.   保证金的扣划与补缴。甲方有权在要求商家承担合同约定责任外扣除部分或全部保证金。甲方扣划保证金后，商家应在接到甲方通知后三日内补齐，否则，甲方有权在商家结算款项中直接扣划。保证金的扣除并不免除甲方要求商家按合同约定承担的违约责任。
14.6.   商家违约行为的范围。受商家委托负责经营商家康小铺店铺的代理人、受托人、受雇人等类似人员所实施的行为均视为商家的行为，若该等行为违反本协议约定，则商家应当承担违约责任。
14.7.   费用的支付。商家违反本协议约定而需向甲方支付的任何违约金、赔偿金及其他所有费用，应在甲方通知后五（5）日内一次性支付给甲方，否则，甲方有权在结算款项中直接扣除，并向商家追索不足部分。
14.8.   不免除售后责任。由于商家发生上述违约行为导致商家应赔偿甲方损失或支付赔偿金、违约金，商家仍需继续执行售后服务并对已售出的商品承担一切责任。
14.9.   平台的责任。协议履行期间，若甲方违反本协议约定导致商家遭受损失的，商家有权要求甲方承担违约责任。
15.  不可抗力
15.1.   由于不可抗力事件导致一方不能及时履行或者不能履行该方在本协议下的任何义务（付款义务除外）的，不构成违约。但是受不可抗力事件影响的一方应立即把不可抗力事件的性质和程度通知对方，并积极采取相应补救措施，以最大程度地减少和避免损失。
16.  甲方反商业贿赂条款
16.1.   总体要求。乙方应当严格遵守法律法规有关禁止商业贿赂行为规定，坚决拒绝商业贿赂、行贿及其他不正当商业行为的馈赠。
16.2.   商业贿赂的定义。本协议所指的商业贿赂是指商家为获取与甲方的合作及合作的利益，商家或其单位工作人员给予甲方员工的一切精神及物质上直接或间接的馈赠，如现金、回扣、娱乐、旅游等。
16.3.   商家的义务。商家或商家工作人员不得以商家或个人名义向甲方任何员工及其亲属、关联方私下直接或间接赠送礼金、物品、有价证券、股份或采取其他变相手段提供不正当利益，否则均视为侵害甲方利益的行为。不正当利益包括但不限于现金、支票、信用礼品卡、样品、或其他商品、娱乐票券、会员卡、货币或货物形式的回扣、回佣、就业或置业、商家付款的旅游、宴请及个人服务等。
16.4.   投诉。若甲方员工要求商家给予其任何形式的不正当利益，商家应及时投诉，并提供相关证据给甲方。甲方相关人员查实后作出处理，并为商家保密。
16.5.   违规的责任。若商家贿赂甲方任何员工，以图获取任何不正当商业利益或更特殊的商业待遇或不配合甲方查处其员工的受贿行为的，甲方将立即开除涉事员工，永久停止与商家的一切合作，并依法对商家采取诸如暂停支付所有应付账款的措施，同时商家应向甲方支付人民币伍万元整作为违约金。情节严重、造成重大经济损失的，甲方将依法移交司法机关处理。
 
17.  其他
17.1.   条款的独立性。如果根据适用的法律认定本协议中的任何条款或者任何条款中的任何部分无效、违法或者不具有可执行性，这种无效、违法或者不具有可执行性不影响本协议中的任何其它条款或者这些条款中的任何其它部分的效力。
17.2.   法律适用。本协议的订立、履行、解释、变更及争议解决均适用中华人民共和国大陆地区法律（不包括冲突法规则）。
17.3.   争议解决
17.3.1.     约定管辖。对于因本协议产生的或者与本协议有关的争议，应友好协商解决，协商不成的，任何一方均有权提起诉讼，且双方一致同意由甲方住所地人民法院管辖。
17.3.2.     平台与买家的管辖约定。商家了解并确认：甲方已通过《康小铺用户服务协议》与买家约定，对于因《康小铺用户服务协议》而产生的或者与该协议有关的争议，若甲方为争议当事人之一的，各方应努力通过友好协商的方式进行解决，协商不成的，任何一方均有权提起诉讼，且各方一致同意由甲方住所地人民法院管辖。商家不得以任何方式排除《康小铺用户服务协议》中该项管辖条款的适用；如商家自行发布或与用户约定的网络购物合同管辖条款与《康小铺用户服务协议》约定的管辖条款冲突的，以《康小铺用户服务协议》约定为准。
17.4.   通知及送达
17.4.1.     通知。本协议签订或履行过程中，甲方向商家寄送的书面通知，在交邮后第五个自然日即视为送达，商家指定邮寄地址为其身份证住址或住所地。书面通知形式还包括但不限于在康小铺平台公告、向商家发送电子邮件、平台站内信、系统信息、手机短信、QQ消息和传真等电子方式，在采用电子方式进行通知的情况下，发送当日即视为送达。商家应保证提供的联系信息（包括但不限于身份证住址、住所地、联系地址、联系人、联系电话、电子邮箱，下同）真实、准确、有效，如信息变更应立即在康小铺平台系统更新；如商家未及时更新，向原联系方式送达的仍视为有效送达。
17.4.2.     法律文书送达。对于因本协议或因本协议所规定事项引起或与之相关的任何纠纷（包括但不限于一切与商家在康小铺平台发布信息、销售商品或提供服务相关的纠纷），商家声明认可以下内容：
（1）   司法机关可通过邮寄、手机短信或电子邮件等方式向商家送达法律文书，商家认可上述送达方式的有效性、合法性。以邮寄方式送达法律文书的，将法律文书寄送至商家提供给康小铺平台的联系地址即视为送达。以手机短信送达法律文书的，通过手机短信方式发至商家提供给康小铺平台的手机号码即视为送达。以电子邮件送达法律文书的，通过电子邮件方式发至商家提供给康小铺平台的电子邮箱地址即视为送达。
（2）   商家同意司法机关可采取以上一种或多种送达方式向其送达法律文书，司法机关采取多种方式向其送达法律文书的，送达时间以上述送达方式中最先送达的为准。
（3）   商家确认的上述送达方式适用于各个司法阶段，包括但不限于一审、二审、再审、执行以及督促程序（含支付令送达）。
（4）   商家保证提供的联系方式是真实、准确、有效的，并进行实时更新。如果因提供的联系信息不准确，或不及时告知变更后的联系方式，使法律文书无法送达或未及时送达的，由商家自行承担由此可能产生的法律后果。
`;
}