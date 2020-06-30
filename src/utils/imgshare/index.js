import Store from '@/store';
import Utils from '@/utils';
import Assets from '@/components/assets';

const getInfo = {
  init() {
    const { shareImgInfo } = Store.globalStore.data;
    const { background, avatar, logoImg, originlogo, originavatar } = shareImgInfo;
    if(!background) {
      getInfo.getBackground()
    }
    if(!avatar) {
      getInfo.getAvatar(originavatar)
    }
    if(!logoImg) {
      getInfo.getLogoImg(originlogo)
    }
  },
  getAvatar(img) {
    const { getImageInfo } = Utils;
    getInfo.saveImgInfo('originavatar', img)
    getImageInfo({
      src: img
    }).then((res) => {
      getInfo.saveImgInfo('avatar', res.el)
    })
  },
  getBackground() {
    const { getImageInfo } = Utils;
    getImageInfo({
      src: Assets.share.share_bg
    }).then((res) => {
      getInfo.saveImgInfo('background', res.el)
    })
  },
  getLogoImg(img) {
    const { getImageInfo } = Utils;
    getInfo.saveImgInfo('originlogo', img)
    getImageInfo({
      src: img
    }).then((res) => {
      getInfo.saveImgInfo('logoImg', res.el)
    })
  },
  saveImgInfo(key, value) {
    const { globalStore } = Store;
    const { shareImgInfo } = globalStore.data;
    shareImgInfo[key] = value;
    globalStore.setData('shareImgInfo', shareImgInfo, 'imgshare.jsx,line:53');
  },
  clearShareInfo() {
    const { globalStore } = Store;
    if(globalStore.data.shareImgInfo && globalStore.data.shareImgInfo !== {}) {
      globalStore.setData('shareImgInfo', {}, 'my-qrcode.jsx,line:95');
    }
  }
}

export default getInfo;