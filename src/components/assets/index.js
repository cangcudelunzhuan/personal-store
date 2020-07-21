import home from './images/home';
import common from './images/common';
import register from './images/register';
import guide from './images/guide';
import shop from './images/shop';
import account from './images/account';
import password from './images/password';
import other from './images/other';
import share from './images/share';
import bond from './images/bond';
import yuncang from './images/yuncang';

export default {
  home: appendHost(home),
  common: appendHost(common),
  register: appendHost(register),
  guide: appendHost(guide),
  shop: appendHost(shop),
  account: appendHost(account),
  password: appendHost(password),
  other: appendHost(other),
  share: appendHost(share),
  bond: appendHost(bond),
  yuncang: appendHost(yuncang),
}

function appendHost(srcs) {
  const host = 'https://jxkcdn.jingxiaokang.com';
  Object.keys(srcs).forEach(k => {
    const src = srcs[k].replace(/(?:\?|\&)host=0/, '');
    if (src.indexOf('http') !== 0) {
      srcs[k] = srcs[k].indexOf('host=0') === -1 ? `${host}${src}` : src;
    }
  });
  return srcs;
}