const fs = require('fs');
const path = require('path');

const pack = require(path.join(process.cwd(),'./package.json'));

const configPath = path.join(process.cwd(), 'src', 'config', 'index.js');

let content = fs.readFileSync(configPath).toString();

content = content.replace(/version\s*\:.+/, `version: '${pack.version}',`);

fs.writeFileSync(configPath, content);
