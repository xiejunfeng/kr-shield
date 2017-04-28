const gulp = require('gulp');
const mocha = require('gulp-mocha');
const webdriver = require('gulp-webdriver');
require("babel-register");
const server = require('wdio-phantomjs-service');

var selenium = require('selenium-standalone');
gulp.task('selenium:install', function (done) {
  selenium.install({
    logger: function (message) {
      console.log(message);
    },
    drivers: {
      chrome: {
        version: '2.28',
        arch: process.arch,
        baseURL: 'https://chromedriver.storage.googleapis.com'
      }
    }
  }, function(err){
    console.log(err);
    if(err) return done(err);
  });

});

gulp.task('selenium:start', function (done) {
  console.log(process.arch)
  selenium.start({
    drivers: {
      chrome: {
        version: '2.28',
        arch: process.arch,
        baseURL: 'https://chromedriver.storage.googleapis.com'
      }
    }
  }, function (err, child) {
    if (err) return done(err);
    selenium.child = child;
    done();
  });
});

// 超时进程没有销毁问题
gulp.task('test',['selenium:start'], () => {
  return gulp.src('test/config.js').pipe(webdriver()).once('end', function() {
    selenium.child.kill();
  });
});