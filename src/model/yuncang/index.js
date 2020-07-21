import { $get } from '@jxkang/wechat-utils'

export default {
  //店铺会员统计  /invite/cloud-team-data
  cloudTeamInfo: (reqModel) => $get('/commission-service/invite/cloud-team-data', reqModel),
  cloudTeamMember: (reqModel) => $get('/commission-service/invite/cloud-team-members', reqModel),
  cloudTeamMemberDetail: (reqModel) => $get('/commission-service/invite/cloud-team-member-detail', reqModel),
}