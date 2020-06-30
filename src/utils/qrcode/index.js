import Taro from '@tarojs/taro';

import {
  QRCode,
  QRErrorCorrectLevel
} from './qrcode'


// support Chinese
function utf16to8 (str) {
  var out, i, len, c
  out = ''
  len = str.length
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i)
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    }
  }
  return out
}

function drawRoundedRect(ctx, x, y, width, height, r, fill, stroke) {
  ctx.save();
  ctx.setFillStyle('#f8f8f8');
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.arcTo(x, y, x + r, y, r);
  if (fill) { ctx.fill(); }
  if (stroke) { ctx.stroke(); }
  ctx.restore(); 
}

function saveCanvas({canvasId, download=true}){
  if(Taro.getEnv() === Taro.ENV_TYPE.WEB){
    const cvs = document.querySelector(`[canvasid="${canvasId}"]`);
    const baseData = cvs.toDataURL('image/png');

    if(download){
      const oa = document.createElement('a');
      oa.setAttribute('href', baseData);
      oa.download = '康小铺文件下载.png';
      document.body.appendChild(oa);
      
      oa.click();
      setTimeout(function(){
        document.body.removeChild(oa);
      });
    }

    return baseData;
  }
}

function drawQrcode (options, context) {
  options = options || {}
  const baseOptions = {
    width: 256,
    height: 256,
    x: 0,
    y: 0,
    typeNumber: -1,
    correctLevel: QRErrorCorrectLevel.H,
    background: '#ffffff',
    foreground: '#000000',
    image: {
      imageResource: '',
      dx: 0,
      dy: 0,
      dWidth: 100,
      dHeight: 100
    }
  }
  
  options.image = Object.assign(baseOptions.image, options.image);
  options = Object.assign(baseOptions, options);

  options._this = options._this || context;

  if (!options.canvasId && !options.ctx) {
    console.warn('please set canvasId or ctx!')
    return
  }

  createCanvas()

  function createCanvas () {
    // create the qrcode itself
    var qrcode = new QRCode(options.typeNumber, options.correctLevel)
    qrcode.addData(utf16to8(options.text))
    qrcode.make()

    // get canvas context
    var ctx
    if (options.ctx) {
      ctx = options.ctx
    } else {
      ctx = options._this ? Taro.createCanvasContext && Taro.createCanvasContext(options.canvasId, options._this) : Taro.createCanvasContext && Taro.createCanvasContext(options.canvasId)
    }

    // compute tileW/tileH based on options.width/options.height
    var tileW = options.width / qrcode.getModuleCount()
    var tileH = options.height / qrcode.getModuleCount()

    // draw in the canvas
    for (var row = 0; row < qrcode.getModuleCount(); row++) {
      for (var col = 0; col < qrcode.getModuleCount(); col++) {
        var style = qrcode.isDark(row, col) ? options.foreground : options.background
        ctx.setFillStyle(style)
        var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW))
        var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW))
        ctx.fillRect(Math.round(col * tileW) + options.x, Math.round(row * tileH) + options.y, w, h)
      }
    }

    if (options.image.imageResource) {
      // 是否加圆角背景
      if(options.image.hasBgRadius){
        const offsetVal = 6;
        drawRoundedRect(ctx, options.image.dx-offsetVal, options.image.dy-offsetVal, options.image.dWidth+offsetVal*2, options.image.dHeight+offsetVal*2, 8, true, false);
      }
      ctx.drawImage(options.image.imageResource, options.image.dx, options.image.dy, options.image.dWidth, options.image.dHeight)
    }

    if(typeof options.callback === 'function'){
      options.callback(ctx);
    } else {
      ctx.draw();
    }
  }
}

export default drawQrcode
export {saveCanvas}