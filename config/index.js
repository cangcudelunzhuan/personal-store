const path = require('path');

const { TARO_ENV, NODE_ENV, SYS_ENV } = process.env;
const pro_cwd = process.cwd();

const config = {
  projectName: 'personal-store',
  date: '2020-1-25',
  designWidth: 750, // 375
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: TARO_ENV ? 'build/h5' : `dist/${TARO_ENV}`,
  babel: {
    sourceMap: true,
    presets: [
      ['env', {
        modules: false
      }]
    ],
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-object-rest-spread',
      ['transform-runtime', {
        "helpers": false,
        "polyfill": false,
        "regenerator": true,
        "moduleName": 'babel-runtime'
      }]
    ]
  },
  alias: {
    '@': path.resolve(pro_cwd, 'src')
  },
  defineConstants: {
  },
  mini: {
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['taro-ui', 'taro-listview'],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      cssModules: {
        enable: true,
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },webpackChain(chain, webpack){
      chain.output.publicPath('./');
      // if(SYS_ENV !== 'production'){
        const now = Date.now();
        chain.output.filename(`js/[name]_${now}.js`);
        chain.output.chunkFilename(`chunk/[name]_${now}.js`);
      // }
    }
  }
}

module.exports = function (merge) {
  if (NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge(
    {},
    config,
    require('./prod'),
    {env:{NODE_ENV:JSON.stringify(SYS_ENV)}}
  )
}
