// var mochawesome = require('mochawesome');
require("babel-register");

var costomReport = require('../lib/wdio-wesome-repoter/report');

function getConf() {
  let conf = {
    capabilities: [
      {
        browserName: 'phantomjs',
        'phantomjs.binary.path': `${process.cwd()}/node_modules/phantomjs-prebuilt/bin/phantomjs`
      }
      // If you want to use other browsers,
      // you may need local Selenium standalone server.
    ],
    // services: ['phantomjs'],
    exclude: [],
    maxInstances: 2,
    sync: true,
    logLevel: 'error',
    coloredLogs: true,
    waitforTimeout: 20000,
    connectionRetryTimeout: 50000,
    connectionRetryCount: 3,
    // 设置错误以后 截屏所放置的地方；
    screenshotPath: './errorShots/',
    screenshotOnReject: true,
    framework: 'mocha',
    reporters: [costomReport],
    reporterOptions: {
      outputDir: './',
      combined: true
    },
    mochaOpts: {
      ui: 'bdd',
      timeout: 30000,

    }
  }
  return conf;
}

module.exports = getConf;