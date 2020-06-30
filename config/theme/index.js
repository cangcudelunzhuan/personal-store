const path = require('path');
const fs = require('fs');

const pro_dir = process.cwd();
let scssDir = require.resolve('taro-ui');

if(scssDir){
  scssDir = path.join(scssDir.replace('index.js', 'style'), 'index.scss');
  let content = fs.readFileSync(scssDir).toString('utf-8');
  content = content.replace(/\n.*\/variables\/.*\n/, `\n@import '${path.join(pro_dir, 'config', 'theme', 'variables.scss')}';\n`);
  fs.writeFileSync(scssDir, content);
}