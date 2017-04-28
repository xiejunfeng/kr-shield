var lodash = require('lodash');
let getBaseConf = require('./config.base.js');


let conf = getBaseConf();
/*
* 我是case的简要描述
* 要做什么事情
* 测试什么情况
* 测试什么业务
* 是否依赖别的case
* 需要注意的地方
* */

let localConf = {
  specs: [
    './test/case-one/spec/**.js'
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 30000,
    require: ['babel-register', './test/setup.js']
  }
};

exports.config = lodash.assign (conf, localConf);

