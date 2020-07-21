const { execSync } = require('child_process');
const { join } = require('path');
require('./version');

const cwd = process.cwd();
const pack = require(join(cwd, 'package.json'));

execSync(`cd ${cwd} && rm -rf ./package-lock.json && npm install && rm -rf ./package-lock.json build && SYS_ENV=${process.env.SYS_ENV} taro build --type h5 && cp public/* build/h5`, { stdio: 'inherit' });
execSync(`cd ${cwd}/build && mkdir app && cp -r h5 app/v${pack.version} && cd ../ && tar cvf build.tar build`);
